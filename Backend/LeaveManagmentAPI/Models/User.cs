using System.ComponentModel.DataAnnotations;

namespace LeaveManagementAPI.Models
{
    public enum UserRole
    {
        Admin,
        Manager,
        Employee
    }

    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty; // Simple string for now
        public UserRole Role { get; set; }
        
        public int? ManagerId { get; set; }
        public User? Manager { get; set; }
    }
}
