using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassVision.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUniqueRollCallFace : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_RollcallFaces_StudentId_ImageId",
                table: "RollcallFaces");

            migrationBuilder.CreateIndex(
                name: "IX_RollcallFaces_StudentId",
                table: "RollcallFaces",
                column: "StudentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_RollcallFaces_StudentId",
                table: "RollcallFaces");

            migrationBuilder.CreateIndex(
                name: "IX_RollcallFaces_StudentId_ImageId",
                table: "RollcallFaces",
                columns: new[] { "StudentId", "ImageId" },
                unique: true);
        }
    }
}
