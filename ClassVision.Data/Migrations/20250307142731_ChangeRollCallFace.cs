using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassVision.Data.Migrations
{
    /// <inheritdoc />
    public partial class ChangeRollCallFace : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_RollcallFaces",
                table: "RollcallFaces");

            migrationBuilder.AlterColumn<string>(
                name: "StudentId",
                table: "RollcallFaces",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "RollcallFaces",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_RollcallFaces",
                table: "RollcallFaces",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_RollcallFaces_StudentId_ImageId",
                table: "RollcallFaces",
                columns: new[] { "StudentId", "ImageId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_RollcallFaces",
                table: "RollcallFaces");

            migrationBuilder.DropIndex(
                name: "IX_RollcallFaces_StudentId_ImageId",
                table: "RollcallFaces");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "RollcallFaces");

            migrationBuilder.AlterColumn<string>(
                name: "StudentId",
                table: "RollcallFaces",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_RollcallFaces",
                table: "RollcallFaces",
                columns: new[] { "StudentId", "ImageId" });
        }
    }
}
