using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassVision.Data.Entities;

public class Classroom : BaseEntity
{
    [Key]
    public string RoomId { get; set; } = null!;

    public int Capacity { get; set; }


}
