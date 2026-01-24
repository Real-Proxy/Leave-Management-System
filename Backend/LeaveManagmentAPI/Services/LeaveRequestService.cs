using LeaveManagementAPI.Data;
using LeaveManagementAPI.DTOs;
using LeaveManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagementAPI.Services
{
    public class LeaveRequestService : ILeaveRequestService
    {
        private readonly AppDbContext _context;

        public LeaveRequestService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<LeaveRequest> CreateLeaveRequestAsync(int userId, CreateLeaveRequestDto requestDto)
        {
            // 1. Mandatory Fields
            if (string.IsNullOrWhiteSpace(requestDto.Reason))
                throw new ArgumentException("Leave reason is mandatory.");

            if (requestDto.ToDate < requestDto.FromDate)
                throw new ArgumentException("End date must be after start date.");

            // 2. Past Dates Check
            if (requestDto.FromDate.Date < DateTime.Today)
                throw new ArgumentException("Cannot apply for leave in the past.");

            // 3. Valid Leave Type
            var leaveType = await _context.LeaveTypes.FindAsync(requestDto.LeaveTypeId);
            if (leaveType == null)
                throw new ArgumentException("Invalid Leave Type.");

            // 4. Quota Check
            var requestedDays = (requestDto.ToDate.Date - requestDto.FromDate.Date).Days + 1;

            // Since EF Core SQLite translation for TimeSpan totaldays might be tricky
            var relevantLeaves = await _context.LeaveRequests
                .Where(lr => lr.UserId == userId && 
                             lr.LeaveTypeId == requestDto.LeaveTypeId && 
                             lr.Status == "Approved")
                .ToListAsync();
            
            var usedDays = relevantLeaves.Sum(lr => (lr.ToDate - lr.FromDate).Days + 1);

            if (usedDays + requestedDays > leaveType.DefaultQuota)
            {
                throw new InvalidOperationException($"Leave quota exceeded. Used: {usedDays}, Requested: {requestedDays}, Limit: {leaveType.DefaultQuota}");
            }

            var leaveRequest = new LeaveRequest
            {
                UserId = userId,
                LeaveTypeId = requestDto.LeaveTypeId,
                FromDate = requestDto.FromDate,
                ToDate = requestDto.ToDate,
                Reason = requestDto.Reason,
                Status = "Pending",
                RequestDate = DateTime.Now
            };

            _context.LeaveRequests.Add(leaveRequest);
            await _context.SaveChangesAsync();
            return leaveRequest;
        }

        public async Task<IEnumerable<LeaveRequest>> GetPendingLeavesAsync()
        {
            return await _context.LeaveRequests
                .Include(l => l.User)
                .Include(l => l.LeaveType)
                .Where(l => l.Status == "Pending")
                .ToListAsync();
        }

        public async Task<IEnumerable<LeaveRequest>> GetUserLeavesAsync(int userId)
        {
            return await _context.LeaveRequests
                .Include(l => l.LeaveType)
                .Where(l => l.UserId == userId)
                .ToListAsync();
        }

        public async Task<LeaveRequest?> ApproveLeaveAsync(int id)
        {
            var leave = await _context.LeaveRequests.FindAsync(id);
            if (leave == null) return null;

            leave.Status = "Approved";
            await _context.SaveChangesAsync();
            return leave;
        }

        public async Task<LeaveRequest?> RejectLeaveAsync(int id)
        {
            var leave = await _context.LeaveRequests.FindAsync(id);
            if (leave == null) return null;

            leave.Status = "Rejected";
            await _context.SaveChangesAsync();
            return leave;
        }
        public async Task<IEnumerable<LeaveRequest>> GetAllLeavesAsync()
        {
            return await _context.LeaveRequests
                .Include(l => l.User)
                .Include(l => l.LeaveType)
                .OrderByDescending(l => l.RequestDate)
                .ToListAsync();
        }
    }
}
