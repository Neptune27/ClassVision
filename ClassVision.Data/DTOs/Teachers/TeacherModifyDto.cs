using ClassVision.Data.Entities;
using ClassVision.Data.Enums;
using Riok.Mapperly.Abstractions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassVision.Data.DTOs.Teachers;


[Mapper]
public partial class TeacherMapper
{
    [MapProperty("User.Id", "UserId")]
    public partial TeacherModifyDto ToModifyDto(Teacher teacher);

    public partial Teacher ToEntity(TeacherModifyDto dto);
}

public class TeacherModifyDto
{
    public string Id { get; set; } = null!;

    public string UserId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public EGender Gender { get; set; }

    public DateOnly Birthday { get; set; }

    public DateOnly HireDate { get; set; }

    public string PhoneNumber { get; set; } = null!;

    public string Address { get; set; } = null!;
}
