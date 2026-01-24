namespace LeaveManagementAPI.Models
{
    public class LeaveRequest
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        
        public int LeaveTypeId { get; set; }
        public LeaveType? LeaveType { get; set; }

        public DateTime RequestDate { get; set; } = DateTime.Now;
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string? Reason { get; set; }
        public string? Status { get; set; }
    }
}
