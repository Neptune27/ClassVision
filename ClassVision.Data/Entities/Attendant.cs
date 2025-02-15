using ClassVision.Data.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassVision.Data.Entities;

public class Attendant : BaseEntity
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    public string StudentId { get; set; } = null!;

    public Guid CourseId { get; set; }

    public Guid ScheduleId { get; set; }

    public Student Student { get; set; } = null!;

    public Course Course { get; set; } = null!;

    public Schedule Schedule { get; set; } = null!;

    public EAttendantStatus Status { get; set; }

}
