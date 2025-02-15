using ClassVision.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassVision.Data.Entities;

public class Teacher
{
    [Key]
    public string Id { get; set; } = null!;

    public AppUser User { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public EGender Gender { get; set; }

    public DateOnly Birthday { get; set; }

    public DateOnly HireDate { get; set; }

    public string PhoneNumber { get; set; } = null!;

    public string Address { get; set; } = null!;

}
