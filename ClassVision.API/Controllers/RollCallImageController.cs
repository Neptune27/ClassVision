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
    public class RollCallImageController : ControllerBase
    {
        private readonly AppDBContext _context;

        public RollCallImageController(AppDBContext context)
        {
            _context = context;
        }

        // GET: api/RollCallImage
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RollCallImage>>> GetRollCallImages()
        {
            return await _context.RollCallImages.ToListAsync();
        }

        // GET: api/RollCallImage/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RollCallImage>> GetRollCallImage(string id)
        {
            var rollCallImage = await _context.RollCallImages.FindAsync(id);

            if (rollCallImage == null)
            {
                return NotFound();
            }

            return rollCallImage;
        }

        // PUT: api/RollCallImage/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRollCallImage(string id, RollCallImage rollCallImage)
        {
            if (id != rollCallImage.Path)
            {
                return BadRequest();
            }

            _context.Entry(rollCallImage).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RollCallImageExists(id))
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

        // POST: api/RollCallImage
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RollCallImage>> PostRollCallImage(RollCallImage rollCallImage)
        {
            _context.RollCallImages.Add(rollCallImage);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (RollCallImageExists(rollCallImage.Path))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetRollCallImage", new { id = rollCallImage.Path }, rollCallImage);
        }

        [HttpPost("{scheduleId}")]
        public async Task<IActionResult> OnPostUploadAsync(Guid scheduleId, IFormFile filepond)
        {
            var schedule = await _context.Schedules.FindAsync(scheduleId);

            if (schedule is null)
            {
                return NotFound();
            }

            // Process uploaded files
            if (filepond.Length <= 0)
            {
                // Don't rely on or trust the FileName property without validation.
                return BadRequest();
            }

            List<string> filePaths = [];

            var ext = Path.GetExtension(filepond.FileName);
            var filePath = $"/api/Media/{Guid.CreateVersion7()}{ext}";
            var saveFilePath = Path.Combine($"./wwwroot{filePath}");
            using var stream = System.IO.File.Create(saveFilePath);
            await filepond.CopyToAsync(stream);
            filePaths.Add(filePath);

            var image = new RollCallImage()
            {
                Path = filePath,
                Schedule = schedule
            };

            await _context.RollCallImages.AddAsync(image);
            await _context.SaveChangesAsync();

            return Ok(filePath);
        }


        // DELETE: api/RollCallImage/5
        [HttpDelete]
        public async Task<IActionResult> DeleteRollCallImage([FromQuery] string path)
        {


            var rollCallImage = await _context.RollCallImages.FirstOrDefaultAsync(r => r.Path.Contains(path));
            if (rollCallImage == null)
            {
                return NotFound();
            }

            _context.RollCallImages.Remove(rollCallImage);
            await _context.SaveChangesAsync();

            return NoContent();
        }



        private bool RollCallImageExists(string id)
        {
            return _context.RollCallImages.Any(e => e.Path == id);
        }
    }
}
