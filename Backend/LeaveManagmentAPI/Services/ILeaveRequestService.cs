using LeaveManagementAPI.DTOs;
using LeaveManagementAPI.Models;

namespace LeaveManagementAPI.Services
{
    public interface ILeaveRequestService
    {
        Task<LeaveRequest> CreateLeaveRequestAsync(int userId, CreateLeaveRequestDto requestDto);
        Task<IEnumerable<LeaveRequest>> GetUserLeavesAsync(int userId);
        Task<IEnumerable<LeaveRequest>> GetPendingLeavesAsync();
        Task<LeaveRequest?> ApproveLeaveAsync(int id);
        Task<LeaveRequest?> RejectLeaveAsync(int id);
        Task<IEnumerable<LeaveRequest>> GetAllLeavesAsync();
    }
}
