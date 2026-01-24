namespace LeaveManagementAPI.DTOs
{
    public class CreateLeaveRequestDto
    {
        public int LeaveTypeId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string Reason { get; set; } = string.Empty;
    }
}
