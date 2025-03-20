using Bakalauras.Core.Interfaces;
using Bakalauras.Core.DTOs;
using Bakalauras.Entities;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Bakalauras.Repository;
using Microsoft.Extensions.Configuration;

namespace Bakalauras.Core.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public AuthService(IJwtTokenService jwtTokenService, UserManager<User> userManager, IConfiguration configuration, RoleManager<IdentityRole> roleManager, ApplicationDbContext context)
        {
            _jwtTokenService = jwtTokenService;
            _userManager = userManager;
            _configuration = configuration;
            _roleManager = roleManager;
            _context = context;
        }

        public async Task<AuthTokensDto> LoginAsync(LoginUserDto loginUser)
        {
            var user = await _userManager.FindByEmailAsync(loginUser.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginUser.Password))
            {
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var accessToken = _jwtTokenService.CreateAccessToken(user.Email, user.Id, roles);
            var refreshToken = _jwtTokenService.CreateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userManager.UpdateAsync(user);

            return new AuthTokensDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
        }

        public async Task<AuthTokensDto> RegisterAsync(RegisterUserDto registerUser)
        {
            var existingUser = await _userManager.FindByEmailAsync(registerUser.Email);
            if (existingUser != null)
            {
                throw new InvalidOperationException("User with this email already exists");
            }

            var user = new User
            {
                Email = registerUser.Email,
                UserName = registerUser.Email,
                FirstName = registerUser.FirstName,
                LastName = registerUser.LastName,
                PhoneNumber = registerUser.PhoneNumber
            };

            var result = await _userManager.CreateAsync(user, registerUser.Password);
            if (!result.Succeeded)
            {
                throw new InvalidOperationException($"Failed to create user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }

            // By default, assign the Customer role
            await _userManager.AddToRoleAsync(user, UserRoles.Customer);

            // Create a Customer record
            var customer = new Customer
            {
                Id = Guid.NewGuid(),
                UserId = user.Id
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            var roles = await _userManager.GetRolesAsync(user);
            var accessToken = _jwtTokenService.CreateAccessToken(user.Email, user.Id, roles);
            var refreshToken = _jwtTokenService.CreateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userManager.UpdateAsync(user);

            return new AuthTokensDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
        }

        public async Task<AuthTokensDto> RefreshTokenAsync(RefreshTokenDto refreshToken)
        {
            var principal = _jwtTokenService.GetPrincipalFromExpiredToken(refreshToken.AccessToken);
            var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null || user.RefreshToken != refreshToken.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                throw new UnauthorizedAccessException("Invalid refresh token");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var newAccessToken = _jwtTokenService.CreateAccessToken(user.Email, user.Id, roles);
            var newRefreshToken = _jwtTokenService.CreateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userManager.UpdateAsync(user);

            return new AuthTokensDto
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            };
        }

        public async Task ChangeUserRoleAsync(ChangeUserRoleDto changeRole)
        {
            var user = await _userManager.FindByIdAsync(changeRole.UserId);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }

            var currentRoles = await _userManager.GetRolesAsync(user);

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Remove current roles
                await _userManager.RemoveFromRolesAsync(user, currentRoles);

                // Add new role
                await _userManager.AddToRoleAsync(user, changeRole.NewRole);

                // If changing to Mechanic
                if (changeRole.NewRole == UserRoles.Mechanic)
                {
                    if (string.IsNullOrEmpty(changeRole.Specialization) || !changeRole.ExperienceLevel.HasValue)
                    {
                        throw new InvalidOperationException("Specialization and experience level are required for mechanics");
                    }

                    // Remove customer record
                    var existingCustomer = await _context.Customers.FirstOrDefaultAsync(c => c.UserId == user.Id);
                    if (existingCustomer != null)
                    {
                        _context.Customers.Remove(existingCustomer);
                    }

                    // Create Mechanic record
                    var mechanic = new Mechanic
                    {
                        Id = Guid.NewGuid(),
                        UserId = user.Id,
                        Specialization = changeRole.Specialization,
                        ExperienceLevel = changeRole.ExperienceLevel.Value
                    };

                    _context.Mechanics.Add(mechanic);
                }
                // If changing to Customer
                else if (changeRole.NewRole == UserRoles.Customer)
                {
                    // Remove mechanic record
                    var existingMechanic = await _context.Mechanics.FirstOrDefaultAsync(m => m.UserId == user.Id);
                    if (existingMechanic != null)
                    {
                        _context.Mechanics.Remove(existingMechanic);
                    }

                    // Create Customer record
                    var customer = new Customer
                    {
                        Id = Guid.NewGuid(),
                        UserId = user.Id
                    };

                    _context.Customers.Add(customer);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<UserDto> GetUserByIdAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault();

            return new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber ?? string.Empty,
                Role = role
            };
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _userManager.Users.ToListAsync();
            var userDtos = new List<UserDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var role = roles.FirstOrDefault();

                userDtos.Add(new UserDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    PhoneNumber = user.PhoneNumber ?? string.Empty,
                    Role = role
                });
            }

            return userDtos;
        }

        public async Task<IEnumerable<CustomerDto>> GetAllCustomersAsync()
        {
            var customers = await _context.Customers
                .Include(c => c.User)
                .ToListAsync();

            return customers.Select(c => new CustomerDto
            {
                Id = c.Id.ToString(),
                UserId = c.UserId,
                PhoneNumber = c.User.PhoneNumber ?? string.Empty,
                FirstName = c.User.FirstName,
                LastName = c.User.LastName,
                Email = c.User.Email
            });
        }

        public async Task<IEnumerable<MechanicDto>> GetAllMechanicsAsync()
        {
            var mechanics = await _context.Mechanics
                .Include(m => m.User)
                .ToListAsync();

            return mechanics.Select(m => new MechanicDto
            {
                Id = m.Id.ToString(),
                UserId = m.UserId,
                PhoneNumber = m.User.PhoneNumber ?? string.Empty,
                FirstName = m.User.FirstName,
                LastName = m.User.LastName,
                Email = m.User.Email,
                Specialization = m.Specialization,
                ExperienceLevel = m.ExperienceLevel
            });
        }

        public async Task<CustomerDto> GetCustomerByIdAsync(string userId)
        {
            var customer = await _context.Customers
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (customer == null)
            {
                throw new KeyNotFoundException("Customer not found");
            }

            return new CustomerDto
            {
                Id = customer.Id.ToString(),
                UserId = customer.UserId,
                PhoneNumber = customer.User.PhoneNumber ?? string.Empty,
                FirstName = customer.User.FirstName,
                LastName = customer.User.LastName,
                Email = customer.User.Email
            };
        }

        public async Task<MechanicDto> GetMechanicByIdAsync(string userId)
        {
            var mechanic = await _context.Mechanics
                .Include(m => m.User)
                .FirstOrDefaultAsync(m => m.UserId == userId);

            if (mechanic == null)
            {
                throw new KeyNotFoundException("Mechanic not found");
            }

            return new MechanicDto
            {
                Id = mechanic.Id.ToString(),
                UserId = mechanic.UserId,
                PhoneNumber = mechanic.User.PhoneNumber ?? string.Empty,
                FirstName = mechanic.User.FirstName,
                LastName = mechanic.User.LastName,
                Email = mechanic.User.Email,
                Specialization = mechanic.Specialization,
                ExperienceLevel = mechanic.ExperienceLevel
            };
        }

        public async Task<UserDto> UpdateUserAsync(string userId, UpdateUserDto updateUser)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }

            // Update user properties
            user.FirstName = updateUser.FirstName;
            user.LastName = updateUser.LastName;
            user.PhoneNumber = updateUser.PhoneNumber;

            // Save changes
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                throw new InvalidOperationException($"Failed to update user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }

            // Return updated user
            return await GetUserByIdAsync(userId);
        }
    }
}
