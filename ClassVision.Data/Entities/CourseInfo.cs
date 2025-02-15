using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassVision.Data.Entities;

public class CourseInfo : BaseEntity
{
    [Key]
    public string Id { get; set; } = null!;

    public string Name { get; set; } = null!;

}
