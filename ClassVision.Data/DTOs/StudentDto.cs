using ClassVision.Data.Entities;
using ClassVision.Data.Enums;
using Riok.Mapperly.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassVision.Data.DTOs;


[Mapper]
public partial class StudentMapper
{
    public partial StudentDto ToDto(Student student);
}

public class StudentDto
{
    public string Id { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public EGender Gender { get; set; }
    public DateOnly Birthday { get; set; }
    public DateOnly EnrollAt { get; set; }
    public string PhoneNumber { get; set; } = null!;
    public string Address { get; set; } = null!;
    public List<AttendantDto> Attendants { get; set; } = [];

    public List<EnrollmentDto> Enrollments { get; set; } = [];
}
