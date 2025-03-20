using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Bakalauras.Core.Interfaces;
using Bakalauras.Core.Auth;
using Bakalauras.Core.DTOs;
using Bakalauras.Entities;

namespace Bakalauras.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthTokensDto>> Register(RegisterUserDto registerUser)
        {
            var tokens = await _authService.RegisterAsync(registerUser);
            return Ok(tokens);
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthTokensDto>> Login(LoginUserDto loginUser)
        {
            var tokens = await _authService.LoginAsync(loginUser);
            return Ok(tokens);
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<AuthTokensDto>> RefreshToken(RefreshTokenDto refreshToken)
        {
            var tokens = await _authService.RefreshTokenAsync(refreshToken);
            return Ok(tokens);
        }

        [Authorize(Policy = PolicyNames.AdminRole)]
        [HttpPost("change-role")]
        public async Task<IActionResult> ChangeUserRole(ChangeUserRoleDto changeRole)
        {
            await _authService.ChangeUserRoleAsync(changeRole);
            return Ok();
        }

        [Authorize]
        [HttpGet("current-user")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _authService.GetUserByIdAsync(userId);
            return Ok(user);
        }

        [Authorize(Policy = PolicyNames.AdminRole)]
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
        {
            var users = await _authService.GetAllUsersAsync();
            return Ok(users);
        }

        [Authorize(Policy = PolicyNames.AdminRole)]
        [HttpGet("customers")]
        public async Task<ActionResult<IEnumerable<CustomerDto>>> GetAllCustomers()
        {
            var customers = await _authService.GetAllCustomersAsync();
            return Ok(customers);
        }

        [Authorize(Policy = PolicyNames.AdminRole)]
        [HttpGet("mechanics")]
        public async Task<ActionResult<IEnumerable<MechanicDto>>> GetAllMechanics()
        {
            var mechanics = await _authService.GetAllMechanicsAsync();
            return Ok(mechanics);
        }

        [Authorize(Policy = PolicyNames.CustomerRole)]
        [HttpGet("customers/{userId}")]
        public async Task<ActionResult<CustomerDto>> GetCustomerById(string userId)
        {
            // Check if the user is requesting their own data or is an admin
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (currentUserId != userId && !User.IsInRole(UserRoles.Admin))
            {
                return Forbid();
            }

            var customer = await _authService.GetCustomerByIdAsync(userId);
            return Ok(customer);
        }

        [Authorize(Policy = PolicyNames.MechanicRole)]
        [HttpGet("mechanics/{userId}")]
        public async Task<ActionResult<MechanicDto>> GetMechanicById(string userId)
        {
            // Check if the user is requesting their own data or is an admin
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (currentUserId != userId && !User.IsInRole(UserRoles.Admin))
            {
                return Forbid();
            }

            var mechanic = await _authService.GetMechanicByIdAsync(userId);
            return Ok(mechanic);
        }

        [Authorize]
        [HttpPut("users/{userId}")]
        public async Task<ActionResult<UserDto>> UpdateUser(string userId, UpdateUserDto updateUser)
        {
            // Check if the user is updating their own data or is an admin
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (currentUserId != userId && !User.IsInRole(UserRoles.Admin))
            {
                return Forbid();
            }

            var updatedUser = await _authService.UpdateUserAsync(userId, updateUser);
            return Ok(updatedUser);
        }
    }
}
