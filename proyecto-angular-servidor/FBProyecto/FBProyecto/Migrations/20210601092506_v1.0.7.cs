using Microsoft.EntityFrameworkCore.Migrations;

namespace FBProyecto.Migrations
{
    public partial class v107 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Read",
                table: "UserLog");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Read",
                table: "UserLog",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
