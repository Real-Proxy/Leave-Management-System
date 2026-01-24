using LeaveManagementAPI.Models;

namespace LeaveManagementAPI.Services
{
    public interface IUserService
    {
        Task<User> CreateUserAsync(User user);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User?> GetUserByIdAsync(int id);
    }
}
