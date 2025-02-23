﻿using ClassVision.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassVision.Data.Entities;


public class Student : BaseEntity
{
    [Key]
    public string Id { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public EGender Gender { get; set; }

    public DateOnly Birthday { get; set; }

    public DateOnly EnrollAt { get; set; }

    public string PhoneNumber { get; set; } = null!;

    public string Address { get; set; } = null!;

    public List<Attendant> Attendants { get; set; } = [];

    public List<Enrollment> Enrollments { get; set; } = [];

    public string Media { get; set; } = string.Empty;
}
