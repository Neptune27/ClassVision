using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClassVision.Data;
using ClassVision.Data.Entities;
using ClassVision.Data.DTOs.Teachers;
using Microsoft.AspNetCore.Identity;

namespace ClassVision.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeacherController(AppDBContext context, UserManager<AppUser> userManager) : ControllerBase
    {
        private readonly AppDBContext _context = context;
        private readonly UserManager<AppUser> userManager = userManager;
        private readonly TeacherMapper mapper = new();

        // GET: api/Teacher
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Teacher>>> GetTeachers()
        {
            return await _context.Teachers.ToListAsync();
        }

        // GET: api/Teacher/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Teacher>> GetTeacher(string id)
        {
            var teacher = await _context.Teachers.FindAsync(id);

            if (teacher == null)
            {
                return NotFound();
            }

            return teacher;
        }

        // PUT: api/Teacher/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTeacher(string id, TeacherModifyDto dto)
        {
            var teacher = mapper.ToEntity(dto);

            if (id != teacher.Id)
            {
                return BadRequest();
            }


            teacher.LastUpdated = DateTimeOffset.UtcNow;
            var user = await userManager.Users.FirstOrDefaultAsync(u => u.Id == dto.UserId);

            if (user is null)
            {
                return NotFound();
            }

            teacher.User = user;

            _context.Entry(teacher).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TeacherExists(id))
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

        // POST: api/Teacher
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TeacherModifyDto>> PostTeacher(TeacherModifyDto dto)
        {
            var teacher = mapper.ToEntity(dto);

            teacher.LastUpdated = DateTimeOffset.UtcNow;
            teacher.CreatedAt = DateTimeOffset.UtcNow;
            var user = await userManager.Users.FirstOrDefaultAsync(u => u.Id == dto.UserId);

            if (user is null)
            {
                return NotFound();
            }

            teacher.User = user;

            _context.Teachers.Add(teacher);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (TeacherExists(teacher.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetTeacher", new { id = teacher.Id }, teacher);
        }

        // DELETE: api/Teacher/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeacher(string id)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null)
            {
                return NotFound();
            }

            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TeacherExists(string id)
        {
            return _context.Teachers.Any(e => e.Id == id);
        }
    }
}
