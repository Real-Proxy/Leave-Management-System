using LeaveManagementAPI.DTOs;
using LeaveManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LeaveManagementAPI.Controllers
{
    [ApiController]
    [Route("api/leaves")]
    [Authorize] // Require Login for all endpoints
    public class LeavesController : ControllerBase
    {
        private readonly ILeaveRequestService _leaveService;

        public LeavesController(ILeaveRequestService leaveService)
        {
            _leaveService = leaveService;
        }

        [HttpPost("apply")]
        public async Task<IActionResult> ApplyLeave([FromBody] CreateLeaveRequestDto requestDto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("id")?.Value;
            if (!int.TryParse(userIdString, out int userId))
            {
                return Unauthorized();
            }

            try
            {
                var request = await _leaveService.CreateLeaveRequestAsync(userId, requestDto);
                return Ok(request);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        [HttpGet("my-leaves")]
        public async Task<IActionResult> GetMyLeaves()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("id")?.Value;
            if (!int.TryParse(userIdString, out int userId))
            {
                return Unauthorized();
            }

            var leaves = await _leaveService.GetUserLeavesAsync(userId);
            return Ok(leaves);
        }

        [HttpGet("pending")]
        [Authorize(Roles = "Manager,Admin")]
        public async Task<IActionResult> GetPendingLeaves()
        {
            var leaves = await _leaveService.GetPendingLeavesAsync();
            return Ok(leaves);
        }

        [HttpPut("{id}/approve")]
        [Authorize(Roles = "Manager,Admin")]
        public async Task<IActionResult> ApproveLeave(int id)
        {
            var leave = await _leaveService.ApproveLeaveAsync(id);
            if (leave == null) return NotFound("Leave request not found");
            return Ok(leave);
        }

        [HttpPut("{id}/reject")]
        [Authorize(Roles = "Manager,Admin")]
        public async Task<IActionResult> RejectLeave(int id)
        {
            var leave = await _leaveService.RejectLeaveAsync(id);
            if (leave == null) return NotFound("Leave request not found");
            return Ok(leave);
        }
    }
}
