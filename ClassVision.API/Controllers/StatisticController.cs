﻿using ClassVision.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClassVision.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class StatisticController(AppDBContext context) : ControllerBase
{
    private readonly AppDBContext context = context;

    [HttpGet]
    public async Task<IActionResult> GetStatistic()
    {
        var now = DateTimeOffset.UtcNow;
        var lastMonth = now.AddDays(-30);
        var lastMonthDateOnly = DateOnly.FromDateTime(lastMonth.DateTime);
        var totalClasses = await context.Courses.CountAsync();
        var totalStudents = await context.ClassUsers.CountAsync();
        var totalTeachers = await context.Teachers.CountAsync();
        var totalClassroom = await context.Classrooms.CountAsync();
        var totalAttendee = await context.Attendants.CountAsync();
        var totalCourseType = await context.CourseInfoes.CountAsync();
        var totalEnrollment = await context.Enrollments.CountAsync();
        var totalSchedule = await context.Schedules.CountAsync();
        var totalUser = await context.Users.CountAsync();
        var currentlyAvailable = await context.Schedules.Where(s => s.Date.ToDateTime(s.StartTime) >= now.Date).CountAsync();
        
        var dailyRecognizeTotal = await context
            .RollcallFaces
            .Where(f => f.Image.Schedule.Date > lastMonthDateOnly)
            .Where(f => f.Status != Data.Enums.EFaceStatus.NOT_SELECTED)
            .GroupBy(t => new { t.Image.Schedule.Date })
            .Select(g => new
            {
                Time = g.Key.Date,
                Manual = g.Count(fi => fi.Status == Data.Enums.EFaceStatus.SELECTED),
                Automatic = g.Count(fi => fi.Status == Data.Enums.EFaceStatus.AUTOMATED),
            })
            .OrderBy(x => x.Time)
            .ToListAsync();

        var dailyLoginTotals = await context.ClassUsers
            .SelectMany(c => c.LoginTime)
            .Where(lt => lt > lastMonth)
            .GroupBy(lt => new { lt.Date })
            .Select(t => new {
                Date = t.Key.Date.ToString(),
                Users = t.Count()
            })
            .ToListAsync();
        return Ok(new
        {
            TotalClasses = totalClasses,
            TotalStudents = totalStudents,
            TotalTeachers = totalTeachers,
            TotalClassroom = totalClassroom,
            TotalAttendee = totalAttendee,
            TotalCourseType = totalCourseType,
            TotalEnrollment = totalEnrollment,
            TotalSchedule = totalSchedule,
            TotalUser = totalUser,
            CurrentlyAvailable = currentlyAvailable,
            MonthlyTotals = dailyRecognizeTotal,
            DailyLoginTotals = dailyLoginTotals
        });
    }
}
