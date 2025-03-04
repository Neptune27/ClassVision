using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassVision.Data.Entities;

public class RollCallImage
{
    [Key]
    public string Path { get; set; } = null!;

    public List<RollcallFace> Faces { get; set; } = [];
    
    public Schedule Schedule { get; set; } = null!;
}
