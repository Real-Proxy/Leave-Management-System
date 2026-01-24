using LeaveManagementAPI.Models;

namespace LeaveManagementAPI.Services
{
    public interface ILeaveTypeService
    {
        Task<LeaveType> AddLeaveTypeAsync(LeaveType leaveType);
        Task<LeaveType?> UpdateLeaveTypeAsync(int id, LeaveType leaveType);
        Task<IEnumerable<LeaveType>> GetAllLeaveTypesAsync();
    }
}
