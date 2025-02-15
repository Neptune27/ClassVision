using ClassVision.Data.Entities;
using Riok.Mapperly.Abstractions;

namespace ClassVision.Data.DTOs;


[Mapper]
public partial class EnrollmentMapper
{
    public partial EnrollmentDto ToDto(Enrollment student);
}


public class EnrollmentDto
{
    public string StudentId { get; set; } = null!;

    public Guid CourseId { get; set; }

    public StudentInfoDto Student { get; set; } = null!;

    public CourseDto Course { get; set; } = null!;
}