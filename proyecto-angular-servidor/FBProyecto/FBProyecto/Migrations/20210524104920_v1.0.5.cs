using Microsoft.EntityFrameworkCore.Migrations;

namespace FBProyecto.Migrations
{
    public partial class v105 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.AddColumn<string>(
                name: "CommentText",
                table: "Log",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

        }
    }
}
