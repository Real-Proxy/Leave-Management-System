using LeaveManagementAPI.Data;
using LeaveManagementAPI.Models;
using Microsoft.Extensions.DependencyInjection;

namespace LeaveManagementAPI
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<AppDbContext>();
            context.Database.EnsureCreated();

            if (!context.Users.Any())
            {
                context.Users.Add(new User 
                { 
                    Name = "Admin", 
                    Email = "admin@lms.com", 
                    Password = "admin", 
                    Role = UserRole.Admin 
                });
                context.SaveChanges();
            }

            if (!context.LeaveTypes.Any())
            {
                context.LeaveTypes.AddRange(
                    new LeaveType { Name = "Casual Leave", DefaultQuota = 10 },
                    new LeaveType { Name = "Medical Leave", DefaultQuota = 15 }
                );
                context.SaveChanges();
            }
        }
    }
}
