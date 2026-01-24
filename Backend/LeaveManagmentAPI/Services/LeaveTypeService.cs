using LeaveManagementAPI.Data;
using LeaveManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace LeaveManagementAPI.Services
{
    public class LeaveTypeService : ILeaveTypeService
    {
        private readonly AppDbContext _context;

        public LeaveTypeService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<LeaveType> AddLeaveTypeAsync(LeaveType leaveType)
        {
            _context.LeaveTypes.Add(leaveType);
            await _context.SaveChangesAsync();
            return leaveType;
        }

        public async Task<IEnumerable<LeaveType>> GetAllLeaveTypesAsync()
        {
            return await _context.LeaveTypes.ToListAsync();
        }

        public async Task<LeaveType?> UpdateLeaveTypeAsync(int id, LeaveType leaveType)
        {
            var existing = await _context.LeaveTypes.FindAsync(id);
            if (existing == null) return null;

            existing.Name = leaveType.Name;
            existing.DefaultQuota = leaveType.DefaultQuota;
            
            await _context.SaveChangesAsync();
            return existing;
        }
    }
}
