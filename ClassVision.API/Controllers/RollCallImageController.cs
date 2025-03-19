using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClassVision.Data;
using ClassVision.Data.Entities;
using System.Net.Http.Headers;
using System.Text.Json;
using ClassVision.Data.DTOs.Rollcalls;
using ClassVision.API.Hubs;

namespace ClassVision.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RollCallImageController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly HttpClient client;

        public RollCallImageController(AppDBContext context, HttpClient client)
        {
            _context = context;
            this.client = client;
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
            var schedule = await _context.Schedules
                .Include(s => s.Attendants)
                .Where(s => s.Id == scheduleId).SingleAsync();

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


            var ext = Path.GetExtension(filepond.FileName);
            var filePath = $"/api/Media/{Guid.CreateVersion7()}{ext}";
            var saveFilePath = Path.Combine($"./wwwroot{filePath}");
            using (var stream = System.IO.File.Create(saveFilePath))
            {
                await filepond.CopyToAsync(stream);
            }


            var image = new RollCallImage()
            {
                Path = filePath,
                Schedule = schedule
            };



            using var form = new MultipartFormDataContent();
            schedule.Attendants.ForEach(a =>
            {
                form.Add(new StringContent(a.StudentId), "user_ids");
            });

            //var fileContent = new ByteArrayContent(await System.IO.File.ReadAllBytesAsync(saveFilePath));
            //fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse(filepond.ContentType);
            //form.Add(pdfContent, "birthCertificate", Path.GetFileName(pdfPath));


            var fileStream = new FileStream(saveFilePath, FileMode.Open, FileAccess.Read);
            var streamContent = new StreamContent(fileStream);
            streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            form.Add(streamContent, "image", filepond.FileName);
            // Replace with your actual API endpoint
            var response = await client.PostAsync("http://localhost:8010/face_recognize", form);
            string stringResult = await response.Content.ReadAsStringAsync();

            var objResult = JsonSerializer.Deserialize<AIRecognizeResult>(stringResult);


            var faces = objResult.Faces.Select(f => new RollcallFace()
            {
                Id = f.IdPendingFace is null ? Guid.NewGuid() : Guid.Parse(f.IdPendingFace),
                ImageId = image.Path,
                StudentId = f.IdUser,
                Status = f.Status == "recognize" ? Data.Enums.EFaceStatus.AUTOMATED : Data.Enums.EFaceStatus.NOT_SELECTED,
                X = f.BBox.X,
                Y = f.BBox.Y,
                W = f.BBox.W,
                H = f.BBox.H,

            });

            image.Faces = [.. faces];

            await _context.RollCallImages.AddAsync(image);
            await _context.SaveChangesAsync();
            Console.WriteLine("A");
            return Ok(filePath);    
        }


        public record SubmitDto(string Path, Guid ScheduleId);


        //private async Task Handle

        [HttpPost("submit")]
        public async Task<IActionResult> Submit(SubmitDto dto)
        {
            var path = dto.Path;
            var data = RollcallHub.RollcallData.GetValueOrDefault(path);

            if (data is null)
            {
                return BadRequest();
            }

            var filteredData = data.Where(data => data.Value.UserId is not null)
                .Select(data => data.Value).ToList();


            if (filteredData is null)
            {
                return Ok();
            }

            var image = await _context.RollCallImages
                .Include(i => i.Faces)
                .Where(i => i.Path == path)
                .SingleAsync();

            var imageFacesNeedUpdated = image.Faces
                .Where(f => filteredData.Any(fd => fd.Id == f.Id.ToString()));

            Dictionary<string, string> updateFaceDict = [];

            foreach (var item in imageFacesNeedUpdated)
            {
                item.Status = Data.Enums.EFaceStatus.SELECTED;
                item.StudentId = filteredData.First(fd => fd.Id == item.Id.ToString()).UserId;
                updateFaceDict.Add(item.Id.ToString(), item.StudentId);
            }

            var imageFaceWithIds = image.Faces.Where(f => !string.IsNullOrEmpty(f.StudentId));


            var response = await client.PostAsJsonAsync("http://localhost:8010/update_embedding", updateFaceDict);
            string stringResult = await response.Content.ReadAsStringAsync();

            var schedule = await _context.Schedules
                .Include(s => s.Attendants)
                .Where(s => s.Id == dto.ScheduleId)
                .SingleAsync();

            if (schedule is not null)
            {
                var attendee = schedule.Attendants.Where(a => imageFaceWithIds.Any(f=> f.StudentId == a.StudentId));
                foreach (var attendant in attendee)
                {
                    attendant.Status = Data.Enums.EAttendantStatus.PRESENT;
                }
            }


            await _context.SaveChangesAsync();
            return Ok();



        }


        // DELETE: api/RollCallImage/5
        [HttpDelete]
        public async Task<IActionResult> DeleteRollCallImage([FromQuery] string path)
        {


            var rollCallImage = await _context.RollCallImages
                .Include(i => i.Faces)
                .FirstOrDefaultAsync(r => r.Path.Contains(path));
            if (rollCallImage == null)
            {
                return NotFound();
            }

            _context.RollcallFaces.RemoveRange(rollCallImage.Faces);
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
