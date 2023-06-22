using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace EduAPI.Migrations
{
    /// <inheritdoc />
    public partial class Initial2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<byte[]>(
                name: "password_hash",
                table: "Users",
                type: "longblob",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext");

            migrationBuilder.AddColumn<int>(
                name: "LiveLectureClassId",
                table: "Users",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "id_number",
                table: "Users",
                type: "longtext",
                nullable: false);

            migrationBuilder.AddColumn<byte[]>(
                name: "password_salt",
                table: "Users",
                type: "longblob",
                nullable: false);

            migrationBuilder.CreateTable(
                name: "LiveLectures",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: false),
                    Description = table.Column<string>(type: "longtext", nullable: true),
                    Date = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Duration = table.Column<uint>(type: "int unsigned", nullable: true),
                    Lecturerid = table.Column<int>(type: "int", nullable: true),
                    ChannelName = table.Column<string>(type: "longtext", nullable: false),
                    ShareUrl = table.Column<string>(type: "longtext", nullable: false),
                    RecordingLink = table.Column<string>(type: "longtext", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LiveLectures", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LiveLectures_Users_Lecturerid",
                        column: x => x.Lecturerid,
                        principalTable: "Users",
                        principalColumn: "id");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Tags",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    tag_name = table.Column<string>(type: "longtext", nullable: false),
                    LiveLectureClassId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tags", x => x.id);
                    table.ForeignKey(
                        name: "FK_Tags_LiveLectures_LiveLectureClassId",
                        column: x => x.LiveLectureClassId,
                        principalTable: "LiveLectures",
                        principalColumn: "Id");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Users_LiveLectureClassId",
                table: "Users",
                column: "LiveLectureClassId");

            migrationBuilder.CreateIndex(
                name: "IX_LiveLectures_Lecturerid",
                table: "LiveLectures",
                column: "Lecturerid");

            migrationBuilder.CreateIndex(
                name: "IX_Tags_LiveLectureClassId",
                table: "Tags",
                column: "LiveLectureClassId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_LiveLectures_LiveLectureClassId",
                table: "Users",
                column: "LiveLectureClassId",
                principalTable: "LiveLectures",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_LiveLectures_LiveLectureClassId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "Tags");

            migrationBuilder.DropTable(
                name: "LiveLectures");

            migrationBuilder.DropIndex(
                name: "IX_Users_LiveLectureClassId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LiveLectureClassId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "id_number",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "password_salt",
                table: "Users");

            migrationBuilder.AlterColumn<string>(
                name: "password_hash",
                table: "Users",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(byte[]),
                oldType: "longblob");
        }
    }
}
