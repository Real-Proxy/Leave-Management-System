using LeaveManagementAPI.DTOs;

namespace LeaveManagementAPI.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
    }
}
