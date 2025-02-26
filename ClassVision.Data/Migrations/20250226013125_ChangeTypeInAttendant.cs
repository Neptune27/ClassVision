using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassVision.Data.Migrations
{
    /// <inheritdoc />
    public partial class ChangeTypeInAttendant : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attendants_Courses_CourseId",
                table: "Attendants");

            migrationBuilder.DropForeignKey(
                name: "FK_Attendants_Students_StudentId",
                table: "Attendants");

            migrationBuilder.DropForeignKey(
                name: "FK_Courses_CourseInfoes_CourseInfoId",
                table: "Courses");

            migrationBuilder.AlterColumn<string>(
                name: "CourseInfoId",
                table: "Courses",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Attendants_Courses_CourseId",
                table: "Attendants",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Attendants_Enrollments_CourseId_StudentId",
                table: "Attendants",
                columns: new[] { "CourseId", "StudentId" },
                principalTable: "Enrollments",
                principalColumns: new[] { "CourseId", "StudentId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Attendants_Students_StudentId",
                table: "Attendants",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_CourseInfoes_CourseInfoId",
                table: "Courses",
                column: "CourseInfoId",
                principalTable: "CourseInfoes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attendants_Courses_CourseId",
                table: "Attendants");

            migrationBuilder.DropForeignKey(
                name: "FK_Attendants_Enrollments_CourseId_StudentId",
                table: "Attendants");

            migrationBuilder.DropForeignKey(
                name: "FK_Attendants_Students_StudentId",
                table: "Attendants");

            migrationBuilder.DropForeignKey(
                name: "FK_Courses_CourseInfoes_CourseInfoId",
                table: "Courses");

            migrationBuilder.AlterColumn<string>(
                name: "CourseInfoId",
                table: "Courses",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddForeignKey(
                name: "FK_Attendants_Courses_CourseId",
                table: "Attendants",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Attendants_Students_StudentId",
                table: "Attendants",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_CourseInfoes_CourseInfoId",
                table: "Courses",
                column: "CourseInfoId",
                principalTable: "CourseInfoes",
                principalColumn: "Id");
        }
    }
}
