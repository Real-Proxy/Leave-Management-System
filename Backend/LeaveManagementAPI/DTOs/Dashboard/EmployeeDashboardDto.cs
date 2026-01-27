namespace LeaveManagementSystem.Api.DTOs.Dashboard
{
    public class EmployeeDashboardDto
    {
        public int TotalLeaves { get; set; }
        public int PendingLeaves { get; set; }
        public int ApprovedLeaves { get; set; }
        public int RejectedLeaves { get; set; }
    }
}
