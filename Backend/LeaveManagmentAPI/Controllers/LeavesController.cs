using Microsoft.AspNetCore.Mvc;
using LeaveManagementAPI.Data;
using LeaveManagementAPI.Models;

namespace LeaveManagementAPI.Controllers
{
    [ApiController]
    [Route("api/leaves")]
    public class LeavesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LeavesController(AppDbContext context)
        {
            _context = context;
        }

       
        [HttpPost("apply")]
        public IActionResult ApplyLeave(LeaveRequest request)
        {
            if (request.FromDate > request.ToDate)
            {
                return BadRequest("FromDate cannot be after ToDate");
            }

            request.Status = "Pending";
            _context.LeaveRequests.Add(request);
            _context.SaveChanges();

            return Ok(request);
        }


        [HttpGet("user/{userId}")]
        public IActionResult GetUserLeaves(int userId)
        {
            var leaves = _context.LeaveRequests
                .Where(l => l.UserId == userId)
                .ToList();

            return Ok(leaves);
        }

       
        [HttpGet("pending")]
        public IActionResult GetPendingLeaves()
        {
            var pendingLeaves = _context.LeaveRequests
                .Where(l => l.Status == "Pending")
                .ToList();

            return Ok(pendingLeaves);
        }

        [HttpPut("{id}/approve")]
        public IActionResult ApproveLeave(int id)
        {
            var leave = _context.LeaveRequests.Find(id);

            if (leave == null)
            {
                return NotFound("Leave request not found");
            }

            leave.Status = "Approved";
            _context.SaveChanges();

            return Ok(leave);
        }


        [HttpPut("{id}/reject")]
        public IActionResult RejectLeave(int id)
        {
            var leave = _context.LeaveRequests.Find(id);

            if (leave == null)
            {
                return NotFound("Leave request not found");
            }

            leave.Status = "Rejected";
            _context.SaveChanges();

            return Ok(leave);
        }
    }
}
