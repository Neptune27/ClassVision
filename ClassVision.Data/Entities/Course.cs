using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassVision.Data.Entities;

public class Course : BaseEntity
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key]
    public Guid Id { get; set; }

    public string CourseInfo { get; set; } = null!;

    public ClassUser Teacher { get; set; } = null!;

    public List<ClassUser> Students { get; set; } = [];

    public Classroom Classroom { get; set; } = null!;

    public List<Attendant> Attendants { get; set; } = [];

    public List<Enrollment> Enrollments { get; set; } = [];

    public List<Schedule> Schedules { get; set; } = [];

    public int Period { get; set; }

}
