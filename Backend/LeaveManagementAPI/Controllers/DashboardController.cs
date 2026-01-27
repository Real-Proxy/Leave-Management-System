using LeaveManagementSystem.Api.Data;
using LeaveManagementSystem.Api.DTOs.Dashboard;
using LeaveManagementSystem.Api.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LeaveManagementSystem.Api.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ===============================
        // EMPLOYEE DASHBOARD
        // ===============================
        [Authorize(Roles = "Employee")]
        [HttpGet("employee")]
        public IActionResult GetEmployeeDashboard()
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub")!
            );

            var leaves = _context.LeaveRequests
                .Where(l => l.UserId == userId);

            var dto = new EmployeeDashboardDto
            {
                TotalLeaves = leaves.Count(),
                PendingLeaves = leaves.Count(l => l.Status == LeaveStatus.Pending),
                ApprovedLeaves = leaves.Count(l => l.Status == LeaveStatus.Approved),
                RejectedLeaves = leaves.Count(l => l.Status == LeaveStatus.Rejected)
            };

            return Ok(dto);
        }

        // ===============================
        // MANAGER DASHBOARD
        // ===============================
        [Authorize(Roles = "Manager")]
        [HttpGet("manager")]
        public IActionResult GetManagerDashboard()
        {
            var leaves = _context.LeaveRequests.AsQueryable();

            var dto = new ManagerDashboardDto
            {
                TotalLeaves = leaves.Count(),
                PendingLeaves = leaves.Count(l => l.Status == LeaveStatus.Pending),
                ApprovedLeaves = leaves.Count(l => l.Status == LeaveStatus.Approved),
                RejectedLeaves = leaves.Count(l => l.Status == LeaveStatus.Rejected)
            };

            return Ok(dto);
        }
    }
}
