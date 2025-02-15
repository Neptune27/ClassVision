using ClassVision.Data.Entities;
using ClassVision.Data.Enums;
using Riok.Mapperly.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassVision.Data.DTOs;

[Mapper]
public partial class AttendantMapper
{
    public partial AttendantDto ToDto(Attendant attendant);
}

public class AttendantDto
{
    public Guid Id { get; set; }

    public string StudentId { get; set; } = null!;

    public Guid CourseId { get; set; }

    public Guid ScheduleId { get; set; }

    public StudentInfoDto Student { get; set; } = null!;

    public CourseDto Course { get; set; } = null!;

    public ScheduleDto Schedule { get; set; } = null!;

    public EAttendantStatus Status { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset LastUpdated { get; set; }

    public bool IsActive { get; set; }
}

