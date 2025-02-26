using ClassVision.Data.Entities;
using ClassVision.Data.Enums;
using Riok.Mapperly.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassVision.Data.DTOs;

public class AttendantModifyDto
{
    public Guid Id { get; set; }

    public string StudentId { get; set; } = null!;

    public Guid CourseId { get; set; }

    public Guid ScheduleId { get; set; }

    public StudentInfoDto Student { get; set; } = null!;

    public CourseDto Course { get; set; } = null!;

    public ScheduleModifyDto Schedule { get; set; } = null!;

    public EAttendantStatus Status { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset LastUpdated { get; set; }

    public bool IsActive { get; set; }
}

