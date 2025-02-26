using ClassVision.Data.Entities;
using Riok.Mapperly.Abstractions;

namespace ClassVision.Data.DTOs;


public class EnrollmentModifyDto
{
    public string StudentId { get; set; } = null!;

    public string CourseId { get; set; }

}