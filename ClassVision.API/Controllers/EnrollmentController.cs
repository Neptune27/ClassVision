using ClassVision.API.Extensions;
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
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace ClassVision.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnrollmentController(AppDBContext context) : ControllerBase
    {
        private readonly AppDBContext _context = context;

        // GET: api/Enrollment
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Enrollment>>> GetEnrollments([FromQuery] string? courseId)
        {

            IQueryable<Enrollment> query = _context.Enrollments;
            if (!string.IsNullOrWhiteSpace(courseId))
            {
                query = query.Where(s => s.Course.Id.ToString() == courseId);
            }
            var data = await query.Include(d => d.Student).Include(d => d.Course).ToListAsync();
            return data;
        }

        // GET: api/Enrollment/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Enrollment>> GetEnrollment(Guid id)
        {
            var enrollment = await _context.Enrollments.FindAsync(id);

            if (enrollment == null)
            {
                return NotFound();
            }

            return enrollment;
        }

        // PUT: api/Enrollment/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEnrollment(Guid id, Enrollment enrollment)
        {
            if (id != enrollment.CourseId)
            {
                return BadRequest();
            }

            _context.Entry(enrollment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EnrollmentExists(id))
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

        // POST: api/Enrollment
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Enrollment>> PostEnrollment(EnrollmentModifyDto dto)
        {
            var enrollment = new Enrollment()
            {
                CourseId = Guid.Parse(dto.CourseId),
                StudentId = dto.StudentId,
                CreatedAt = DateTimeOffset.UtcNow,
                LastUpdated = DateTimeOffset.UtcNow,
                IsActive = true,
            };

            _context.Enrollments.Add(enrollment);
            await AddNewAttendantToExistingCourse(Guid.Parse(dto.CourseId), dto.StudentId);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (EnrollmentExists(enrollment.CourseId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetEnrollment", new { id = enrollment.CourseId }, enrollment);
        }

        public record EnrollmentByUser(Guid ClassId);

        [HttpPost("ByUser")]
        [Authorize]
        public async Task<IActionResult> PostEnrollmentByUser(EnrollmentByUser dto)
        {
            var claim = HttpContext.User.Claims.GetClaimByUserId();

            if (claim is null)
            {
                return Unauthorized();
            }

            var userId = claim.Value;
            var student = await _context.ClassUsers.FirstAsync(c => c.User.Id == userId);
            var enrollment = new Enrollment()
            {
                CourseId = dto.ClassId,
                StudentId = student.Id,
                CreatedAt = DateTimeOffset.UtcNow,
                LastUpdated = DateTimeOffset.UtcNow,
                IsActive = true,
            };

            _context.Enrollments.Add(enrollment);
            await AddNewAttendantToExistingCourse(dto.ClassId, student.Id);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (EnrollmentExists(enrollment.CourseId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetEnrollment", new { id = enrollment.CourseId }, enrollment);

        }

        private async Task AddNewAttendantToExistingCourse(Guid courseId, string studentId)
        {
            var course = await _context.Courses
                .Include(c=>c.Schedules).FirstOrDefaultAsync(c => c.Id == courseId);

            if (course is null)
            {
                return;   
            }

            var attendants = course.Schedules
                .Select(schedule =>
                {
                    return new Attendant()
                    {
                        Id = Guid.NewGuid(),
                        CourseId = courseId,
                        StudentId = studentId,
                        Status = Data.Enums.EAttendantStatus.ABSENT,
                        ScheduleId = schedule.Id,
                        LastUpdated = DateTimeOffset.UtcNow,
                        CreatedAt = DateTimeOffset.UtcNow,
                    };
                }).ToList();



            await _context.Attendants.AddRangeAsync(attendants);
        }

        // DELETE: api/Enrollment/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEnrollment(string id)
        {
            var value = id.Split("|");

            if (value.Length != 2)
            {
                return BadRequest();
            }

            var enrollment = await _context.Enrollments
                .Include(e => e.Attendants)
                .Where(e => e.CourseId == Guid.Parse(value[0]) && e.StudentId == value[1]).FirstAsync();
            if (enrollment == null)
            {
                return NotFound();
            }

            _context.Attendants.RemoveRange(enrollment.Attendants);
            _context.Enrollments.Remove(enrollment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("IsEnroll/{courseId}")]
        [Authorize]
        public async Task<IActionResult> IsEnroll(Guid courseId) 
        {
            var claim = HttpContext.User.Claims.GetClaimByUserId();

            if (claim is null)
            {
                return Unauthorized();
            }

            var userId = claim.Value;

            var classUser = await _context.ClassUsers.FirstAsync(c => c.User.Id == userId);

            var isEnroll = _context.Enrollments.Any(e => e.CourseId == courseId && e.Student == classUser);
            var isTeacher = _context.Courses.Any(e => e.Teacher == classUser);
            return Ok(isEnroll || isTeacher);
        }

        private bool EnrollmentExists(Guid id)
        {
            return _context.Enrollments.Any(e => e.CourseId == id);
        }
    }
}
