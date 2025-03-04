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
    public class RollcallFaceController : ControllerBase
    {
        private readonly AppDBContext _context;

        public RollcallFaceController(AppDBContext context)
        {
            _context = context;
        }

        // GET: api/RollcallFace
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RollcallFace>>> GetRollcallFaces()
        {
            return await _context.RollcallFaces.ToListAsync();
        }

        // GET: api/RollcallFace/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RollcallFace>> GetRollcallFace(string id)
        {
            var rollcallFace = await _context.RollcallFaces.FindAsync(id);

            if (rollcallFace == null)
            {
                return NotFound();
            }

            return rollcallFace;
        }

        // PUT: api/RollcallFace/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRollcallFace(string id, RollcallFace rollcallFace)
        {
            if (id != rollcallFace.StudentId)
            {
                return BadRequest();
            }

            _context.Entry(rollcallFace).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RollcallFaceExists(id))
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

        // POST: api/RollcallFace
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RollcallFace>> PostRollcallFace(RollcallFace rollcallFace)
        {
            _context.RollcallFaces.Add(rollcallFace);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (RollcallFaceExists(rollcallFace.StudentId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetRollcallFace", new { id = rollcallFace.StudentId }, rollcallFace);
        }

        // DELETE: api/RollcallFace/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRollcallFace(string id)
        {
            var rollcallFace = await _context.RollcallFaces.FindAsync(id);
            if (rollcallFace == null)
            {
                return NotFound();
            }

            _context.RollcallFaces.Remove(rollcallFace);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RollcallFaceExists(string id)
        {
            return _context.RollcallFaces.Any(e => e.StudentId == id);
        }
    }
}
