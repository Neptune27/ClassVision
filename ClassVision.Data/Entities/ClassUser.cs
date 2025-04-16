using ClassVision.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassVision.Data.Entities;


public class ClassUser : BaseEntity
{
    [Key]
    public string Id { get; set; } = null!;
    public AppUser? User { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public List<Attendant> Attendants { get; set; } = [];

    public List<Enrollment> Enrollments { get; set; } = [];

    public List<RollcallFace> RollcallFaces { get; set; } = [];

    public string Media { get; set; } = string.Empty;

    public List<DateTimeOffset> LoginTime { get; set; } = [];
}
