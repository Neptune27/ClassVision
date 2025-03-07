using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassVision.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddStatusRollCallFace : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "RollcallFaces",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "RollcallFaces");
        }
    }
}
