﻿using System.ComponentModel.DataAnnotations;

namespace ClassVision.Data.DTOs.Accounts;


public class RegisterDto
{
    [Required]
    public string? UserName { get; set; }

    [Required]
    [EmailAddress]
    public string? Email { get; set; }

    [Required]
    public string? Password { get; set; }

    [Required]
    public string? FirstName { get; set; }

    [Required]
    public string? LastName { get; set; }

}
