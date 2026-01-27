using LeaveManagementSystem.Api.Data;
using LeaveManagementSystem.Api.DTOs;
using LeaveManagementSystem.Api.Models;
using LeaveManagementSystem.Api.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LeaveManagementSystem.Api.Controllers
{
    [ApiController]
    [Route("api/leaves")]
    public class LeaveController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LeaveController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ===============================
        // EMPLOYEE: APPLY FOR LEAVE
        // ===============================
        [Authorize(Roles = "Employee")]
        [HttpPost("apply")]
        public async Task<IActionResult> ApplyLeave(LeaveRequest request)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)
                            ?? User.FindFirstValue("sub")!);

            request.UserId = userId;
            request.Status = LeaveStatus.Pending;
            request.CreatedAt = DateTime.UtcNow;

            _context.LeaveRequests.Add(request);
            await _context.SaveChangesAsync();

            return Ok("Leave applied successfully");
        }

        // ===============================
        // EMPLOYEE: GET MY LEAVES
        // ===============================
        [Authorize(Roles = "Employee")]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyLeaves()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)
                            ?? User.FindFirstValue("sub")!);

            var leaves = await _context.LeaveRequests
                .Where(l => l.UserId == userId)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();

            return Ok(leaves);
        }

        // ===============================
        // MANAGER: GET ALL LEAVES
        // ===============================
        [Authorize(Roles = "Manager")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllLeaves()
        {
            var leaves = await _context.LeaveRequests
                .Include(l => l.User)
                .Select(l => new LeaveResponseDto
                {
                    Id = l.Id,
                    UserId = l.UserId,
                    UserEmail = l.User.Email,
                    StartDate = l.StartDate,
                    EndDate = l.EndDate,
                    Type = (int)l.LeaveType,
                    Status = (int)l.Status,
                    Reason = l.Reason
                })
                .ToListAsync();

            return Ok(leaves);
        }


        // ===============================
        // MANAGER: APPROVE LEAVE
        // ===============================
        [Authorize(Roles = "Manager")]
        [HttpPut("{id}/approve")]
        public async Task<IActionResult> ApproveLeave(int id)
        {
            var leave = await _context.LeaveRequests.FindAsync(id);
            if (leave == null) return NotFound("Leave not found");

            leave.Status = LeaveStatus.Approved;
            await _context.SaveChangesAsync();

            return Ok("Leave approved");
        }

        // ===============================
        // MANAGER: REJECT LEAVE
        // ===============================
        [Authorize(Roles = "Manager")]
        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectLeave(int id)
        {
            var leave = await _context.LeaveRequests.FindAsync(id);
            if (leave == null) return NotFound("Leave not found");

            leave.Status = LeaveStatus.Rejected;
            await _context.SaveChangesAsync();

            return Ok("Leave rejected");
        }
    }
}
