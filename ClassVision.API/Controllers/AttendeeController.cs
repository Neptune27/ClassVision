using ClassVision.API.Extensions;
using ClassVision.API.Services;
using ClassVision.Data;
using ClassVision.Data.DTOs;
using ClassVision.Data.Entities;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
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
    [Authorize]
    public class AttendeeController(AppDBContext context, SpreadsheetService spreadsheetService) : ControllerBase
    {
        private readonly AppDBContext _context = context;
        private readonly SpreadsheetService spreadsheetService = spreadsheetService;

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


        [HttpGet("byClass/{id}")]
        public async Task<IActionResult> GetAttendeeByClass(Guid id)
        {
            var data = await _context.Courses.Where(c => c.Id == id)
            .Include(s => s.Enrollments)
            .ThenInclude(e => e.Student)
            .Include(s => s.Enrollments)
            .ThenInclude(s => s.Attendants)
            .Select(c => 
                c.Enrollments)
            .SingleAsync();

            return Ok(data);
        }

        [HttpGet("byClass/toExcel/{id}")]
        public async Task<IActionResult> ExportByClass(Guid id)
        {
            var data = await _context.Courses.Where(c => c.Id == id)
            .Include(s => s.Enrollments)
            .ThenInclude(e => e.Student)
            .Include(s => s.Enrollments)
            .ThenInclude(s => s.Attendants)
            .Select(c =>
                c.Enrollments)
            .SingleAsync();


            var filePath = $"/api/Media/Excels/{Guid.CreateVersion7()}.xlsx";
            var saveFilePath = Path.Combine($"./wwwroot{filePath}");

            //System.IO.Directory.CreateDirectory(saveFilePath);

            List<Dictionary<string, string>> converted = [.. data.Select(d =>
            {
                Dictionary<string, string> dict = [];
                dict.Add("Student Id", d.Student.Id);
                dict.Add("First Name", d.Student.FirstName);
                dict.Add("Last Name", d.Student.LastName);

                for (int i = 0; i < d.Attendants.Count; i++)
                {
                    var attendant = d.Attendants[i];
                    dict.Add($"W{i+1}", attendant.Status.ToString());
			    }

                return dict;
            })];
            spreadsheetService.Export(converted, saveFilePath, "A1");

            return Ok(filePath);
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

            var userId = HttpContext.User.Claims.GetClaimByUserId().Value;

            var courseId = Guid.Parse(dto.CourseId);
            var studentId = dto.StudentId;
            var status = dto.Status;
            var scheduleId = Guid.Parse(dto.ScheduleId);

            var course = await _context.Courses.Where(c => c.Id == courseId && c.Teacher.User.Id == userId)
                .SingleOrDefaultAsync();

            if (course is null)
            {
                return BadRequest();
            }

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
