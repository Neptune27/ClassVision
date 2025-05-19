using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClassVision.Data;
using ClassVision.Data.Entities;

namespace ClassVision.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly AppDBContext _context;

        public StudentController(AppDBContext context)
        {
            _context = context;
        }

        // GET: api/Student
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClassUser>>> GetStudents()
        {
            return await _context.ClassUsers.Include(cu => cu.User).ToListAsync();
        }

        // GET: api/Student
        [HttpGet("authorized")]
        public async Task<ActionResult<IEnumerable<ClassUser>>> GetStudentsAuthorized()
        {
            return await _context.ClassUsers.Include(cu => cu.User)
                .Where(cu => cu.User != null).ToListAsync();
        }

        [HttpGet("byCourse/{courseId}")]
        public async Task<ActionResult<IEnumerable<ClassUser>>> GetStudentsByCourse(Guid courseId)
        {
            
            var course = await _context.Courses.Include(c => c.Students).FirstOrDefaultAsync(c => c.Id == courseId);

            if (course is null)
            {
                return NotFound();   
            }

            return course.Students.ToList();

        }

        // GET: api/Student/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ClassUser>> GetStudent(string id)
        {
            var student = await _context.ClassUsers.FindAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            return student;
        }

        // PUT: api/Student/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStudent(string id, ClassUser student)
        {
            if (id != student.Id)
            {
                return BadRequest();
            }

            _context.Entry(student).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StudentExists(id))
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

        // POST: api/Student
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ClassUser>> PostStudent(ClassUser student)
        {
            student.Id = Guid.CreateVersion7().ToString();

            _context.ClassUsers.Add(student);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (StudentExists(student.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetStudent", new { id = student.Id }, student);
        }

        // DELETE: api/Student/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(string id)
        {
            var student = await _context.ClassUsers.FindAsync(id);
            if (student == null)
            {
                return NotFound();
            }

            _context.ClassUsers.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StudentExists(string id)
        {
            return _context.ClassUsers.Any(e => e.Id == id);
        }
    }
}
