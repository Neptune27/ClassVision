using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassVision.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDB_ResetLater : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courses_CourseInfoes_CourseInfoId",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Enrollments_Schedules_ScheduleId",
                table: "Enrollments");

            migrationBuilder.DropIndex(
                name: "IX_Enrollments_ScheduleId",
                table: "Enrollments");

            migrationBuilder.DropColumn(
                name: "ScheduleId",
                table: "Enrollments");

            migrationBuilder.AlterColumn<string>(
                name: "CourseInfoId",
                table: "Courses",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "ClassroomRoomId",
                table: "Courses",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Courses_ClassroomRoomId",
                table: "Courses",
                column: "ClassroomRoomId");

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Classrooms_ClassroomRoomId",
                table: "Courses",
                column: "ClassroomRoomId",
                principalTable: "Classrooms",
                principalColumn: "RoomId");

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_CourseInfoes_CourseInfoId",
                table: "Courses",
                column: "CourseInfoId",
                principalTable: "CourseInfoes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Classrooms_ClassroomRoomId",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Courses_CourseInfoes_CourseInfoId",
                table: "Courses");

            migrationBuilder.DropIndex(
                name: "IX_Courses_ClassroomRoomId",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "ClassroomRoomId",
                table: "Courses");

            migrationBuilder.AddColumn<Guid>(
                name: "ScheduleId",
                table: "Enrollments",
                type: "uuid",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CourseInfoId",
                table: "Courses",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Enrollments_ScheduleId",
                table: "Enrollments",
                column: "ScheduleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_CourseInfoes_CourseInfoId",
                table: "Courses",
                column: "CourseInfoId",
                principalTable: "CourseInfoes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Enrollments_Schedules_ScheduleId",
                table: "Enrollments",
                column: "ScheduleId",
                principalTable: "Schedules",
                principalColumn: "Id");
        }
    }
}
