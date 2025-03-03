using ClassVision.Data;
using ClassVision.Data.DTOs;
using ClassVision.Data.Entities;
using Humanizer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ClassVision.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendeeController : ControllerBase
    {
        private readonly AppDBContext _context;

        public AttendeeController(AppDBContext context)
        {
            _context = context;
        }

        // GET: api/Attendants
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Attendant>>> GetAttendants()
        {
            return await _context.Attendants.ToListAsync();
        }

        // GET: api/Attendants/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Attendant>> GetAttendant(Guid id)
        {
            var attendant = await _context.Attendants.FindAsync(id);

            if (attendant == null)
            {
                return NotFound();
            }

            return attendant;
        }

        // PUT: api/Attendants/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        public async Task<IActionResult> PutAttendant(AttendantModifyDto dto)
        {
            //if (id != attendant.CourseId)
            //{
            //    return BadRequest();
            //}

            var courseId = Guid.Parse(dto.CourseId);
            var studentId = dto.StudentId;
            var status = dto.Status;
            var scheduleId = Guid.Parse(dto.ScheduleId);

            var attendant = await _context.Attendants.FindAsync(courseId, studentId, scheduleId);

            if (attendant is null)
            {
                return NotFound();
            }

            attendant.Status = status;

            _context.Entry(attendant).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();
        }

        // POST: api/Attendants
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Attendant>> PostAttendant(AttendantModifyDto dto)
        {

            var attendant = new Attendant()
            {
                Id = Guid.NewGuid(),
                CourseId = Guid.Parse(dto.CourseId),
                StudentId = dto.StudentId,
                Status = dto.Status,
                ScheduleId = Guid.Parse(dto.ScheduleId),
                LastUpdated = DateTimeOffset.UtcNow,
                CreatedAt = DateTimeOffset.UtcNow,
            };

            _context.Attendants.Add(attendant);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (AttendantExists(attendant.CourseId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetAttendant", new { id = attendant.CourseId }, attendant);
        }

        [HttpPost("bySchedule/{scheduleId}")]
        public async Task<ActionResult<Attendant>> PostAttendantBySchedule(Guid scheduleId)
        {

            var schedule = await _context.Schedules
                .Include(s => s.Course)
                .ThenInclude(c => c.Enrollments)
                .Include(s => s.Attendants)
                .FirstAsync(s => s.Id == scheduleId);

            if (schedule is null)
            {
                return NotFound();
            }

            var attendants = schedule.Course.Enrollments
                .Where(e => !schedule.Attendants.Any(a => a.StudentId == e.StudentId))
                .Select(e =>
            {
                return new Attendant()
                {
                    Id = Guid.NewGuid(),
                    CourseId = schedule.Course.Id,
                    StudentId = e.StudentId,
                    Status = Data.Enums.EAttendantStatus.ABSENT,
                    ScheduleId = schedule.Id,
                    LastUpdated = DateTimeOffset.UtcNow,
                    CreatedAt = DateTimeOffset.UtcNow,
                };
            });



            await _context.Attendants.AddRangeAsync(attendants);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {

                foreach (var attendant in attendants)
                {
                    if (AttendantExists(attendant.CourseId))
                    {
                        return Conflict();
                    }
                    else
                    {
                        throw;
                    }
                }
            }

            return Ok(attendants);
        }


        // DELETE: api/Attendants/5
        [HttpDelete("{idComposite}")]
        public async Task<IActionResult> DeleteAttendant(string idComposite)
        {
            var ids = idComposite.Split("|").ToList();
            if (ids.Count != 3)
            {
                return BadRequest();
            }

            var courseId = Guid.Parse(ids[0]);
            var studentId = ids[1];
            var scheduleId = Guid.Parse(ids[2]);

            var attendant = await _context.Attendants.FindAsync(courseId, studentId, scheduleId);
            if (attendant == null)
            {
                return NotFound();
            }

            _context.Attendants.Remove(attendant);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AttendantExists(Guid id)
        {
            return _context.Attendants.Any(e => e.CourseId == id);
        }
    }
}
