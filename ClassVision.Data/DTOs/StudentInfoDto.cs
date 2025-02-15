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
public partial class StudentInfoMapper
{
    public partial StudentInfoDto ToDto(Student student);
}

public class StudentInfoDto
{
    public string Id { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public EGender Gender { get; set; }
    public DateOnly Birthday { get; set; }
    public DateOnly EnrollAt { get; set; }
    public string PhoneNumber { get; set; } = null!;
    public string Address { get; set; } = null!;
}
