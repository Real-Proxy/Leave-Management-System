using LeaveManagementAPI.Data;
using LeaveManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagementAPI.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User> CreateUserAsync(User user)
        {
            // Simple check to ensure email is unique
            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            {
                throw new InvalidOperationException("User with this email already exists.");
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users
                .Include(u => u.Manager) // Include details if needed
                .ToListAsync();
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }
    }
}
