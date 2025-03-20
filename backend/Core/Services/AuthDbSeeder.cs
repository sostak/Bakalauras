using Bakalauras.Entities;
using Microsoft.AspNetCore.Identity;

namespace Bakalauras.Core.Services
{
    public class AuthDbSeeder
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;

        public AuthDbSeeder(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        public async Task SeedAsync()
        {
            await AddDefaultRoles();
            await AddAdminUser();
        }

        private async Task AddAdminUser()
        {
            var newAdminUser = new User()
            {
                Email = _configuration["Admin:Email"],
                UserName = "Admin"
            };

            var existingAdminUser = await _userManager.FindByEmailAsync(newAdminUser.Email);
            if (existingAdminUser == null)
            {
                var createAdminUserResult = await _userManager.CreateAsync(newAdminUser, _configuration["Admin:Password"]);
                if (createAdminUserResult.Succeeded)
                {
                    await _userManager.AddToRoleAsync(newAdminUser, UserRoles.Admin);
                }
            }
        }

        private async Task AddDefaultRoles()
        {
            foreach (var role in UserRoles.All)
            {
                var roleExists = await _roleManager.RoleExistsAsync(role);
                if (!roleExists)
                    await _roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }
}
