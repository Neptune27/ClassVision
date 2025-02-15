using ClassVision.Data.Entities;
using Riok.Mapperly.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Text;
using System.Threading.Tasks;

namespace ClassVision.Data.DTOs.Classrooms;


public class ClassroomDto
{
    public string RoomId { get; set; } = null!;

    public int Capacity { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime LastUpdated { get; set; }

    public bool IsActive { get; set; }
}

