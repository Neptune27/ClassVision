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

    [HttpGet("Details/{id}")]
    public async Task<IActionResult> DetailsAsync(string id)
    {
        var classroom = await dBContext.Classrooms.FirstOrDefaultAsync(c => c.RoomId == id);

        return Ok(classroom);
    }


    [HttpPost("[action]")]
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
            CreatedAt = DateTime.Now,
            LastUpdated = DateTime.Now,
            IsActive = true,
        };

        var result = await dBContext.Classrooms.AddAsync(classroom);

        return Ok(result);
    }

    [HttpGet("[action]")]
    public async Task<IActionResult> EditAsync(string id)
    {
        var result = await dBContext.Classrooms.FirstOrDefaultAsync(c => c.RoomId == id);

        if (result is null)
        {
            return BadRequest(id);
        }

        return Ok(result);
    }

    [HttpPost("Edit/{id}")]
    public async Task<IActionResult> EditPostAsync(string id, [FromBody] ClassroomCreateDto dto)
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

    [HttpDelete("[action]")]
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
