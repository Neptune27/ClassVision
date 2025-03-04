using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassVision.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddRollcall : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RollCallImages",
                columns: table => new
                {
                    Path = table.Column<string>(type: "text", nullable: false),
                    ScheduleId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RollCallImages", x => x.Path);
                    table.ForeignKey(
                        name: "FK_RollCallImages_Schedules_ScheduleId",
                        column: x => x.ScheduleId,
                        principalTable: "Schedules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RollcallFaces",
                columns: table => new
                {
                    ImageId = table.Column<string>(type: "text", nullable: false),
                    StudentId = table.Column<string>(type: "text", nullable: false),
                    W = table.Column<int>(type: "integer", nullable: false),
                    H = table.Column<int>(type: "integer", nullable: false),
                    X = table.Column<int>(type: "integer", nullable: false),
                    Y = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RollcallFaces", x => new { x.StudentId, x.ImageId });
                    table.ForeignKey(
                        name: "FK_RollcallFaces_RollCallImages_ImageId",
                        column: x => x.ImageId,
                        principalTable: "RollCallImages",
                        principalColumn: "Path");
                    table.ForeignKey(
                        name: "FK_RollcallFaces_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_RollcallFaces_ImageId",
                table: "RollcallFaces",
                column: "ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_RollCallImages_ScheduleId",
                table: "RollCallImages",
                column: "ScheduleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RollcallFaces");

            migrationBuilder.DropTable(
                name: "RollCallImages");
        }
    }
}
