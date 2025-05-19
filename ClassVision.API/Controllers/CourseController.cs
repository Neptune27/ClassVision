using ClassVision.API.Extensions;
using ClassVision.Data;
using ClassVision.Data.DTOs.Courses;
using ClassVision.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml;

namespace ClassVision.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly AppDBContext _context;

        public CourseController(AppDBContext context)
        {
            _context = context;
        }

        // GET: api/Courses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Course>>> GetCourses()
        {
            return await _context.Courses
                .Include(c => c.Schedules)
                .Include(c => c.Teacher)
                .Include(c => c.Enrollments)
                .ToListAsync();
        }


        [HttpGet("IsTeacher/{id}")]
        public async Task<ActionResult<bool>> GetIsTeacher(Guid id)
        {
            var claim = HttpContext.User.Claims.GetClaimByUserId();

            if (claim is null)
            {
                return Ok(false);
            }

            var course = await _context.Courses.Include(c => c.Teacher).ThenInclude(t => t.User).FirstOrDefaultAsync(c => c.Id == id);

            if (course is null)
            {
                return BadRequest();
            }
            var userId = claim.Value;

            var teacher = course.Teacher;

            if (teacher.User is null)
            {
                return Ok(false);
            }

            return teacher.User.Id == claim.Value;

        }

        [HttpGet("ByUser")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Course>>> GetCoursesByUser()
        {

            var claim = HttpContext.User.Claims.GetClaimByUserId();

            if (claim is null)
            {
                return Unauthorized();
            }

            var userId = claim.Value;

            var classUser = await _context.ClassUsers.FirstOrDefaultAsync(c => c.User != null &&  c.User.Id == userId);

            if (classUser == null)
            {
                return Unauthorized();
            }

            return await _context.Courses
                .Include(c => c.Schedules)
                .Include(c => c.Teacher)
                .Include(c => c.Enrollments)
                .Where(c => c.Teacher == classUser || c.Enrollments.Any(e => e.Student == classUser))
                .ToListAsync();
        }

        // GET: api/Courses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Course>> GetCourse(Guid id)
        {
            var course = await _context.Courses.FindAsync(id);

            if (course == null)
            {
                return NotFound();
            }

            return course;
        }


        // PUT: api/Courses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCourse(Guid id, Course course)
        {
            if (id != course.Id)
            {
                return BadRequest();
            }

            _context.Entry(course).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CourseExists(id))
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

        // POST: api/Courses
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Course>> PostCourse(CourseModifyDto dto)
        {

            var teacher = await _context.ClassUsers.FirstAsync(it => it.Id == dto.TeacherId || it.User.Id == dto.TeacherId);

            var course = new Course
            {
                CourseName = dto.CourseName,
                Teacher = teacher,
                CreatedAt = DateTimeOffset.UtcNow,
                LastUpdated = DateTimeOffset.UtcNow,
                IsActive = true
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCourse", new { id = course.Id }, course);
        }

        // DELETE: api/Courses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(Guid id)
        {

            var course = await _context.Courses.FindAsync(id);
            if (course == null)
            {
                return NotFound();
            }

            if (!course.Archived)
            {
                course.Archived = true;
                await _context.SaveChangesAsync();
                return Ok();
            }


            course.IsActive = false;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CourseExists(Guid id)
        {
            return _context.Courses.Any(e => e.Id == id);
        }
    }
}
