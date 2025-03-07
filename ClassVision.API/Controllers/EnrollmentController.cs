﻿using ClassVision.Data;
using ClassVision.Data.DTOs;
using ClassVision.Data.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace ClassVision.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnrollmentController(AppDBContext context) : ControllerBase
    {
        private readonly AppDBContext _context = context;

        // GET: api/Enrollment
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Enrollment>>> GetEnrollments([FromQuery] string? courseId)
        {

            IQueryable<Enrollment> query = _context.Enrollments;
            if (!string.IsNullOrWhiteSpace(courseId))
            {
                query = query.Where(s => s.Course.Id.ToString() == courseId);
            }
            var data = await query.ToListAsync();
            return data;
        }

        // GET: api/Enrollment/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Enrollment>> GetEnrollment(Guid id)
        {
            var enrollment = await _context.Enrollments.FindAsync(id);

            if (enrollment == null)
            {
                return NotFound();
            }

            return enrollment;
        }

        // PUT: api/Enrollment/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEnrollment(Guid id, Enrollment enrollment)
        {
            if (id != enrollment.CourseId)
            {
                return BadRequest();
            }

            _context.Entry(enrollment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EnrollmentExists(id))
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

        // POST: api/Enrollment
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Enrollment>> PostEnrollment(EnrollmentModifyDto dto)
        {
            var enrollment = new Enrollment()
            {
                CourseId = Guid.Parse(dto.CourseId),
                StudentId = dto.StudentId,
                CreatedAt = DateTimeOffset.UtcNow,
                LastUpdated = DateTimeOffset.UtcNow,
                IsActive = true,
            };

            _context.Enrollments.Add(enrollment);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (EnrollmentExists(enrollment.CourseId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetEnrollment", new { id = enrollment.CourseId }, enrollment);
        }

        // DELETE: api/Enrollment/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEnrollment(Guid id)
        {
            var enrollment = await _context.Enrollments.FindAsync(id);
            if (enrollment == null)
            {
                return NotFound();
            }

            _context.Enrollments.Remove(enrollment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EnrollmentExists(Guid id)
        {
            return _context.Enrollments.Any(e => e.CourseId == id);
        }
    }
}
