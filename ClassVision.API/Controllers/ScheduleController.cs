using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClassVision.Data;
using ClassVision.Data.Entities;
using ClassVision.Data.DTOs;
using Microsoft.AspNetCore.Authorization;
using ClassVision.API.Extensions;

namespace ClassVision.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ScheduleController : ControllerBase
    {
        private readonly AppDBContext _context;

        public ScheduleController(AppDBContext context)
        {
            _context = context;
        }

        // GET: api/Schedule
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Schedule>>> GetSchedules([FromQuery] string? courseId)
        {
            IQueryable<Schedule> query = _context.Schedules
                .Include(s => s.Course)
                .ThenInclude(c => c.CourseInfo)
                .Include(s => s.Course)
                .ThenInclude(c => c.Classroom);


            if (!string.IsNullOrWhiteSpace(courseId))
            {
                query = query.Where(s => s.Course.Id.ToString() == courseId);
            }

            return await query.ToListAsync();
        }

        // GET: api/Schedule/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Schedule>> GetSchedule(Guid id)
        {
            var schedule = await _context.Schedules
                .Include(s => s.Course)
                .ThenInclude(c => c.CourseInfo)
                .Include(s => s.Course)
                .ThenInclude(c => c.Enrollments)
                .ThenInclude(e => e.Student)
                .Include(s => s.Course)
                .ThenInclude(c => c.Classroom)
                .Include(s => s.Course)
                .ThenInclude(c => c.Teacher)
                .Include(s => s.Attendants)
                .ThenInclude(a => a.Enrollment)
                .Include(s => s.Images)
                .ThenInclude(i => i.Faces)
                .ThenInclude(f => f.Student)
                .FirstAsync(s => s.Id == id);

            if (schedule == null)
            {
                return NotFound();
            }

            return schedule;
        }

        // GET: api/Schedule/5
        [HttpGet("byUser")]
        public async Task<ActionResult<IEnumerable<Schedule>>> GetSchedulesByUser()
        {
            var claim = HttpContext.User.Claims.GetClaimByUserId();

            if (claim is null)
            {
                return Unauthorized();
            }

            var userId = claim.Value;

            var schedule = await _context.Schedules
                .Include(s => s.Course)
                .ThenInclude(c => c.CourseInfo)
                .Where(s => s.Course.Teacher.User.Id == userId).ToListAsync();

            return schedule;
        }

        // PUT: api/Schedule/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSchedule(Guid id, Schedule schedule)
        {
            if (id != schedule.Id)
            {
                return BadRequest();
            }

            _context.Entry(schedule).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ScheduleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Schedule
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Schedule>> PostSchedule(ScheduleModifyDto dto)
        {

            for (int i = 0; i < dto.Period; i++)
            {
                var schedule = new Schedule
                {
                    CreatedAt = DateTimeOffset.UtcNow,
                    LastUpdated = DateTimeOffset.UtcNow,
                    Course = await _context.Courses.FirstAsync(c => c.Id.ToString() == dto.CourseId),
                    Date = dto.Date.AddDays(7 * i),
                    StartTime = dto.StartTime,
                    EndTime = dto.EndTime
                };
                _context.Schedules.Add(schedule);
            }


            await _context.SaveChangesAsync();

            return Ok("[]");
            //return CreatedAtAction("GetSchedule", new { id = schedule.Id }, schedule);
        }

        // DELETE: api/Schedule/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSchedule(Guid id)
        {
            var schedule = await _context.Schedules.FindAsync(id);
            if (schedule == null)
            {
                return NotFound();
            }

            _context.Schedules.Remove(schedule);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ScheduleExists(Guid id)
        {
            return _context.Schedules.Any(e => e.Id == id);
        }
    }
}
