using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClassVision.Data;
using ClassVision.Data.Entities;

namespace ClassVision.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CourseInfoController(AppDBContext context) : ControllerBase
{
    private readonly AppDBContext _context = context;

    // GET: api/CourseInfo
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CourseInfo>>> GetCourseInfos()
    {
        return await _context.CourseInfoes.ToListAsync();
    }

    // GET: api/CourseInfo/5
    [HttpGet("{id}")]
    public async Task<ActionResult<CourseInfo>> GetCourseInfo(string id)
    {
        var courseInfo = await _context.CourseInfoes.FindAsync(id);

        if (courseInfo == null)
        {
            return NotFound();
        }

        return courseInfo;
    }

    // PUT: api/CourseInfo/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutCourseInfo(string id, CourseInfo courseInfo)
    {
        if (id != courseInfo.Id)
        {
            return BadRequest();
        }

        _context.Entry(courseInfo).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CourseInfoExists(id))
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

    // POST: api/CourseInfo
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<CourseInfo>> PostCourseInfo(CourseInfo courseInfo)
    {
        _context.CourseInfoes.Add(courseInfo);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            if (CourseInfoExists(courseInfo.Id))
            {
                return Conflict();
            }
            else
            {
                throw;
            }
        }

        return CreatedAtAction("GetCourseInfo", new { id = courseInfo.Id }, courseInfo);
    }

    // DELETE: api/CourseInfo/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCourseInfo(string id)
    {
        var courseInfo = await _context.CourseInfoes.FindAsync(id);
        if (courseInfo == null)
        {
            return NotFound();
        }

        _context.CourseInfoes.Remove(courseInfo);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool CourseInfoExists(string id)
    {
        return _context.CourseInfoes.Any(e => e.Id == id);
    }
}
