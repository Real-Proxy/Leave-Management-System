namespace LeaveManagementAPI.Models
{
    public class LeaveType
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int DefaultQuota { get; set; }
    }
}
