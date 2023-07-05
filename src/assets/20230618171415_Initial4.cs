using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduAPI.Migrations
{
    /// <inheritdoc />
    public partial class Initial4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LiveLectures_Users_Lecturerid",
                table: "LiveLectures");

            migrationBuilder.DropColumn(
                name: "Duration",
                table: "LiveLectures");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "LiveLectures");

            migrationBuilder.AlterColumn<string>(
                name: "ShareUrl",
                table: "LiveLectures",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext");

            migrationBuilder.AlterColumn<string>(
                name: "RecordingLink",
                table: "LiveLectures",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext");

            migrationBuilder.AlterColumn<int>(
                name: "Lecturerid",
                table: "LiveLectures",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_LiveLectures_Users_Lecturerid",
                table: "LiveLectures",
                column: "Lecturerid",
                principalTable: "Users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LiveLectures_Users_Lecturerid",
                table: "LiveLectures");

            migrationBuilder.AlterColumn<string>(
                name: "ShareUrl",
                table: "LiveLectures",
                type: "longtext",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "RecordingLink",
                table: "LiveLectures",
                type: "longtext",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Lecturerid",
                table: "LiveLectures",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<uint>(
                name: "Duration",
                table: "LiveLectures",
                type: "int unsigned",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "LiveLectures",
                type: "longtext",
                nullable: false);

            migrationBuilder.AddForeignKey(
                name: "FK_LiveLectures_Users_Lecturerid",
                table: "LiveLectures",
                column: "Lecturerid",
                principalTable: "Users",
                principalColumn: "id");
        }
    }
}
