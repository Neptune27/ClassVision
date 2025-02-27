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
    public string Id { get; set; } = null!;

    public string StudentId { get; set; } = null!;

    public string CourseId { get; set; } = null!;

    public string ScheduleId { get; set; } = null!;

    public EAttendantStatus Status { get; set; }

    public bool IsActive { get; set; }
}

