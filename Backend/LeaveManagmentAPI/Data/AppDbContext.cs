using Microsoft.EntityFrameworkCore;
using LeaveManagementAPI.Models;

namespace LeaveManagementAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<LeaveType> LeaveTypes { get; set; }
        public DbSet<LeaveRequest> LeaveRequests { get; set; }
    }
}
