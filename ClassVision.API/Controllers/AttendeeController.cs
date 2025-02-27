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
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAttendant(Guid id, Attendant attendant)
        {
            if (id != attendant.CourseId)
            {
                return BadRequest();
            }

            _context.Entry(attendant).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AttendantExists(id))
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

        // POST: api/Attendants
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Attendant>> PostAttendant(Attendant attendant)
        {
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

        // DELETE: api/Attendants/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAttendant(Guid id)
        {
            var attendant = await _context.Attendants.FindAsync(id);
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
