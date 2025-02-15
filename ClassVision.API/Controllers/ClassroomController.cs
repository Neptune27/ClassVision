using ClassVision.Data;
using ClassVision.Data.DTOs.Classrooms;
using ClassVision.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClassVision.API.Controllers;


[Route("/api/[controller]")]
[ApiController]
[Authorize]
public class ClassroomController(AppDBContext dBContext) : Controller
{
    private readonly AppDBContext dBContext = dBContext;

    [HttpGet("")]
    public async Task<IActionResult> IndexAsync()
    {
        var classrooms = await dBContext.Classrooms.ToListAsync();

        return Ok(classrooms);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> IndexAsync(string id)
    {
        var result = await dBContext.Classrooms.FirstOrDefaultAsync(c => c.RoomId == id);

        if (result is null)
        {
            return BadRequest(id);
        }

        return Ok(result);
    }


    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] ClassroomCreateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        Classroom classroom = new()
        {
            RoomId = dto.RoomId,
            Capacity = dto.Capacity,
            CreatedAt = DateTime.UtcNow,
            LastUpdated = DateTime.UtcNow,
            IsActive = true,
        };

        var result = await dBContext.Classrooms.AddAsync(classroom);
        await dBContext.SaveChangesAsync();

        return Ok(result.Entity);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> EditAsync(string id, [FromBody] ClassroomCreateDto dto)
    {
        var result = await dBContext.Classrooms.FirstOrDefaultAsync(c => c.RoomId == id);

        if (result is null)
        {
            return BadRequest(id);
        }

        result.Capacity = dto.Capacity;
        await dBContext.SaveChangesAsync();

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsync(string id)
    {
        var result = await dBContext.Classrooms.FirstOrDefaultAsync(c => c.RoomId == id);

        if (result is null)
        {
            return BadRequest(id);
        }

        dBContext.Classrooms.Remove(result);

        await dBContext.SaveChangesAsync();

        return Ok();

    }

    //// POST: ClassroomController/Delete/5
    //[HttpPost]
    //[ValidateAntiForgeryToken]
    //public ActionResult Delete(int id, IFormCollection collection)
    //{
    //    try
    //    {
    //        return RedirectToAction(nameof(IndexAsync));
    //    }
    //    catch
    //    {
    //        return View();
    //    }
    //}
}
