﻿// <auto-generated />
using System;
using ClassVision.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ClassVision.Data.Migrations
{
    [DbContext(typeof(AppDBContext))]
    [Migration("20250307144253_RemoveUniqueRollCallFace")]
    partial class RemoveUniqueRollCallFace
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.HasPostgresExtension(modelBuilder, "vector");
            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("ClassVision.Data.Entities.AppUser", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("integer");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("boolean");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("boolean");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("text");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("text");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("boolean");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("text");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("boolean");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex");

                    b.ToTable("AspNetUsers", (string)null);
                });

            modelBuilder.Entity("ClassVision.Data.Entities.Attendant", b =>
                {
                    b.Property<Guid>("CourseId")
                        .HasColumnType("uuid");

                    b.Property<string>("StudentId")
                        .HasColumnType("text");

                    b.Property<Guid>("ScheduleId")
                        .HasColumnType("uuid");

                    b.Property<DateTimeOffset>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<DateTimeOffset>("LastUpdated")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("Status")
                        .HasColumnType("integer");

                    b.HasKey("CourseId", "StudentId", "ScheduleId");

                    b.HasIndex("ScheduleId");

                    b.HasIndex("StudentId");

                    b.ToTable("Attendants");
                });

            modelBuilder.Entity("ClassVision.Data.Entities.Classroom", b =>
                {
                    b.Property<string>("RoomId")
                        .HasColumnType("text");

                    b.Property<int>("Capacity")
                        .HasColumnType("integer");

                    b.Property<DateTimeOffset>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<DateTimeOffset>("LastUpdated")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("RoomId");

                    b.ToTable("Classrooms");
                });

            modelBuilder.Entity("ClassVision.Data.Entities.Course", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("ClassroomRoomId")
                        .HasColumnType("text");

                    b.Property<string>("CourseInfoId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTimeOffset>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<DateTimeOffset>("LastUpdated")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("Period")
                        .HasColumnType("integer");

                    b.Property<string>("TeacherId")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("ClassroomRoomId");

                    b.HasIndex("CourseInfoId");

                    b.HasIndex("TeacherId");

                    b.ToTable("Courses");
                });

            modelBuilder.Entity("ClassVision.Data.Entities.CourseInfo", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<DateTimeOffset>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<DateTimeOffset>("LastUpdated")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("CourseInfoes");
                });

            modelBuilder.Entity("ClassVision.Data.Entities.Enrollment", b =>
                {
                    b.Property<Guid>("CourseId")
                        .HasColumnType("uuid");

                    b.Property<string>("StudentId")
                        .HasColumnType("text");

                    b.Property<DateTimeOffset>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<DateTimeOffset>("LastUpdated")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("CourseId", "StudentId");

                    b.HasIndex("StudentId");

                    b.ToTable("Enrollments");
                });

            modelBuilder.Entity("ClassVision.Data.Entities.RollCallImage", b =>
                {
                    b.Property<string>("Path")
                        .HasColumnType("text");

                    b.Property<Guid>("ScheduleId")
                        .HasColumnType("uuid");

                    b.HasKey("Path");

                    b.HasIndex("ScheduleId");

                    b.ToTable("RollCallImages");
                });

            modelBuilder.Entity("ClassVision.Data.Entities.RollcallFace", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int>("H")
                        .HasColumnType("integer");

                    b.Property<string>("ImageId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("StudentId")
                        .HasColumnType("text");

                    b.Property<int>("W")
                        .HasColumnType("integer");

                    b.Property<int>("X")
                        .HasColumnType("integer");

                    b.Property<int>("Y")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("ImageId");

                    b.HasIndex("StudentId");

                    b.ToTable("RollcallFaces");
                });

            modelBuilder.Entity("ClassVision.Data.Entities.Schedule", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("CourseId")
                        .HasColumnType("uuid");

                    b.Property<DateTimeOffset>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateOnly>("Date")
                        .HasColumnType("date");

                    b.Property<TimeOnly>("EndTime")
                        .HasColumnType("time without time zone");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<DateTimeOffset>("LastUpdated")
                        .HasColumnType("timestamp with time zone");

                    b.Property<TimeOnly>("StartTime")
                        .HasColumnType("time without time zone");

                    b.HasKey("Id");

                    b.HasIndex("CourseId");

                    b.ToTable("Schedules");
                });

            modelBuilder.Entity("ClassVision.Data.Entities.Student", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateOnly>("Birthday")
                        .HasColumnType("date");

                    b.Property<Guid?>("CourseId")
                        .HasColumnType("uuid");

                    b.Property<DateTimeOffset>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateOnly>("EnrollAt")
                        .HasColumnType("date");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Gender")
                        .HasColumnType("integer");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTimeOffset>("LastUpdated")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Media")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("CourseId");

                    b.ToTable("Students");
                });

            modelBuilder.Entity("ClassVision.Data.Entities.Teacher", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateOnly>("Birthday")
                        .HasColumnType("date");

                    b.Property<DateTimeOffset>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Gender")
                        .HasColumnType("integer");

                    b.Property<DateOnly>("HireDate")
                        .HasColumnType("date");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTimeOffset>("LastUpdated")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Teachers");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex");

                    b.ToTable("AspNetRoles", (string)null);

                    b.HasData(
                        new
                        {
                            Id = "1",
                            Name = "Admin",
                            NormalizedName = "ADMIN"
                        },
                        new
                        {
                            Id = "2",
                            Name = "Teacher",
                            NormalizedName = "TEACHER"
                        },
                        new
                        {
                            Id = "3",
                            Name = "User",
                            NormalizedName = "USER"
                        });
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("text");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("text");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("text");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("text");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("text");

                    b.Property<string>("RoleId")
                        .HasColumnType("text");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("text");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.Property<string>("Value")
                        .HasColumnType("text");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("ClassVision.Data.Entities.Attendant", b =>
                {
                    b.HasOne("ClassVision.Data.Entities.Course", null)
                        .WithMany("Attendants")
                        .HasForeignKey("CourseId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ClassVision.Data.Entities.Schedule", "Schedule")
                        .WithMany("Attendants")
                        .HasForeignKey("ScheduleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ClassVision.Data.Entities.Student", null)
                        .WithMany("Attendants")
                        .HasForeignKey("StudentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ClassVision.Data.Entities.Enrollment", "Enrollment")
                        .WithMany("Attendants")
                        .HasForeignKey("CourseId", "StudentId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Enrollment");

                    b.Navigation("Schedule");
                });

            modelBuilder.Entity("ClassVision.Data.Entities.Course", b =>
                {
                    b.HasOne("ClassVision.Data.Entities.Classroom", "Classroom")
                        .WithMany()
                        .HasForeignKey("ClassroomRoomId");

                    b.HasOne("ClassVision.Data.Entities.CourseInfo", "CourseInfo")
                        .WithMany()
                        .HasForeignKey("CourseInfoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ClassVision.Data.Entities.Teacher", "Teacher")
                        .WithMany()
                        .HasForeignKey("TeacherId");

                    b.Navigation("Classroom");

                    b.Navigation("CourseInfo");

                    b.Navigation("Teacher");
                });

            modelBuilder.Entity("ClassVision.Data.Entities.Enrollment", b =>
                {
                    b.HasOne("ClassVision.Data.Entities.Course", "Course")
                        .WithMany("Enrollments")
                        .HasForeignKey("CourseId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("ClassVision.Data.Entities.Student", "Student")
                        .WithMany("Enrollments")
                        .HasForeignKey("StudentId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Course");

                    b.Navigation("Student");
                });

            modelBuilder.Entity("ClassVision.Data.Entities.RollCallImage", b =>
                {
                    b.HasOne("ClassVision.Data.Entities.Schedule", "Schedule")
                        .WithMany("Images")
                        .HasForeignKey("ScheduleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Schedule");
                });

            modelBuilder.Entity("ClassVision.Data.Entities.RollcallFace", b =>
                {
                    b.HasOne("ClassVision.Data.Entities.RollCallImage", "Image")
                        .WithMany("Faces")
                        .HasForeignKey("ImageId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("ClassVision.Data.Entities.Student", "Student")
                        .WithMany("RollcallFaces")
                        .HasForeignKey("StudentId")
                        .OnDelete(DeleteBehavior.NoAction);

                    b.Navigation("Image");

                    b.Navigation("Student");
                });

            modelBuilder.Entity("ClassVision.Data.Entities.Schedule", b =>
                {
                    b.HasOne("ClassVision.Data.Entities.Course", "Course")
                        .WithMany("Schedules")
                        .HasForeignKey("CourseId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Course");
                });

            modelBuilder.Entity("ClassVision.Data.Entities.Student", b =>
                {
                    b.HasOne("ClassVision.Data.Entities.Course", null)
                        .WithMany("Students")
                        .HasForeignKey("CourseId");
                });

            modelBuilder.Entity("ClassVision.Data.Entities.Teacher", b =>
                {
                    b.HasOne("ClassVision.Data.Entities.AppUser", "User")
                        .WithMany()
                        .HasForeignKey("UserId");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("ClassVision.Data.Entities.AppUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("ClassVision.Data.Entities.AppUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ClassVision.Data.Entities.AppUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("ClassVision.Data.Entities.AppUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ClassVision.Data.Entities.Course", b =>
                {
                    b.Navigation("Attendants");

                    b.Navigation("Enrollments");

                    b.Navigation("Schedules");

                    b.Navigation("Students");
                });

            modelBuilder.Entity("ClassVision.Data.Entities.Enrollment", b =>
                {
                    b.Navigation("Attendants");
                });

            modelBuilder.Entity("ClassVision.Data.Entities.RollCallImage", b =>
                {
                    b.Navigation("Faces");
                });

            modelBuilder.Entity("ClassVision.Data.Entities.Schedule", b =>
                {
                    b.Navigation("Attendants");

                    b.Navigation("Images");
                });

            modelBuilder.Entity("ClassVision.Data.Entities.Student", b =>
                {
                    b.Navigation("Attendants");

                    b.Navigation("Enrollments");

                    b.Navigation("RollcallFaces");
                });
#pragma warning restore 612, 618
        }
    }
}
