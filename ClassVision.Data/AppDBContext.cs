﻿using ClassVision.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassVision.Data;

public class AppDBContext: IdentityDbContext<AppUser>
{
    public DbSet<Attendant> Attendants { get; set; }
    public DbSet<Classroom> Classrooms { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<CourseInfo> CourseInfos { get; set; }
    public DbSet<Schedule> Schedules { get; set; }
    public DbSet<Student> Students { get; set; }
    public DbSet<Teacher> Teachers { get; set; }


    public AppDBContext(DbContextOptions options) : base(options)
    {

    }
    protected override void OnModelCreating(ModelBuilder builder)
    {

        builder.Entity<Attendant>(e =>
        {
            e.HasKey(t => new
            {
                t.CourseId,
                t.StudentId,
                t.ScheduleId
            });

            e.HasOne(i => i.Course)
            .WithMany(c => c.Attendants)
            .OnDelete(DeleteBehavior.NoAction);

            e.HasOne(i => i.Student)
            .WithMany(s => s.Attendants)
            .OnDelete(DeleteBehavior.NoAction);

        });

        builder.Entity<Enrollment>(e =>
        {

            e.HasKey(t => new
            {
                t.CourseId,
                t.StudentId
            });

            e.HasOne(i => i.Course)
            .WithMany(c => c.Enrollments)
            .OnDelete(DeleteBehavior.NoAction);

            e.HasOne(i => i.Student)
            .WithMany(s => s.Enrollments)
            .OnDelete(DeleteBehavior.NoAction);


        });
        builder.HasPostgresExtension("vector");

        base.OnModelCreating(builder);



        //List<IdentityRole> identityRoles = [
        //    new IdentityRole
        //    {
        //        Name = "Admin",
        //        NormalizedName = "ADMIN"
        //    },
        //    new IdentityRole
        //    {
        //        Name = "Teacher",
        //        NormalizedName = "TEACHER"
        //    },
        //    new IdentityRole
        //    {
        //        Name = "User",
        //        NormalizedName = "USER"
        //    }
        //    ];

        //builder.Entity<IdentityRole>().HasData(identityRoles);

    }
}
