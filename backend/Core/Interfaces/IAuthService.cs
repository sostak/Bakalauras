using Bakalauras.Core.DTOs;

namespace Bakalauras.Core.Interfaces
{
    public interface IAuthService
    {
        Task<AuthTokensDto> RegisterAsync(RegisterUserDto registerUser);
        Task<AuthTokensDto> LoginAsync(LoginUserDto loginUser);
        Task<AuthTokensDto> RefreshTokenAsync(RefreshTokenDto refreshToken);
        Task ChangeUserRoleAsync(ChangeUserRoleDto changeRole);
        Task<UserDto> GetUserByIdAsync(string id);
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<IEnumerable<CustomerDto>> GetAllCustomersAsync();
        Task<IEnumerable<MechanicDto>> GetAllMechanicsAsync();
        Task<CustomerDto> GetCustomerByIdAsync(string userId);
        Task<MechanicDto> GetMechanicByIdAsync(string userId);
        Task<UserDto> UpdateUserAsync(string userId, UpdateUserDto updateUser);
    }
}
