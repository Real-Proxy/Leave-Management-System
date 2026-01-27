namespace LeaveManagementSystem.Api.DTOs
{
    public class LeaveResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserEmail { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public int Type { get; set; }
        public int Status { get; set; }

        public string Reason { get; set; } = string.Empty;
    }
}
