using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassVision.Data.Entities;

public class Enrollment : BaseEntity
{

    public string StudentId { get; set; } = null!;

    public Guid CourseId { get; set; }

    public ClassUser Student { get; set; } = null!;

    public Course Course { get; set; } = null!;

    public List<Attendant> Attendants { get; set; } = [];

}
