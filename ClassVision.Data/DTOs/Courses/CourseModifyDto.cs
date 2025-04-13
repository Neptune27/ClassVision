using ClassVision.Data.Entities;
using ClassVision.Data.Enums;
using Riok.Mapperly.Abstractions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassVision.Data.DTOs.Courses;


public class CourseModifyDto
{

    public string Id { get; set; } = "";

    public string CourseInfo { get; set; } = null!;

    public string TeacherId { get; set; } = null!;

    public List<ClassUser> Students { get; set; } = [];

    public List<Attendant> Attendants { get; set; } = [];

    public List<Enrollment> Enrollments { get; set; } = [];

    public List<ScheduleModifyDto> Schedules { get; set; } = [];

    public int Period { get; set; }
}
