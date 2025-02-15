using Riok.Mapperly.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassVision.Data.DTOs.Classrooms;


public class ClassroomCreateDto
{
    public string RoomId { get; set; } = null!;

    public int Capacity { get; set; }
}
