using ClassVision.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassVision.Data.Entities;

public class RollcallFace
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    public string ImageId { get; set; } = null!;
    public RollCallImage Image { get; set; } = null!;

    public int W { get; set; }
    public int H { get; set; }
    public int X { get; set; }
    public int Y { get; set; }

    public EFaceStatus Status { get; set; }

    public string? StudentId { get;set; }
    public ClassUser? Student { get; set; }
}
