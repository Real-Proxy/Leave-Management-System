using LeaveManagementSystem.Api.Models.Enums;

namespace LeaveManagementSystem.Api.Models
{
    public class LeaveRequest
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public LeaveType LeaveType { get; set; }

        public string Reason { get; set; } = string.Empty;

        public LeaveStatus Status { get; set; } = LeaveStatus.Pending;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public User? User { get; set; }
    }
}
