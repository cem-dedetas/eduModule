using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace EduAPI.Migrations
{
    /// <inheritdoc />
    public partial class Initial6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RecordingLink",
                table: "LiveLectures");

            migrationBuilder.AddColumn<int>(
                name: "ChatLogid",
                table: "LiveLectures",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ChatLog",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatLog", x => x.id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Recording",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    start = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    end = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    sid = table.Column<string>(type: "longtext", nullable: true),
                    ruid = table.Column<string>(type: "longtext", nullable: true),
                    resourceId = table.Column<string>(type: "longtext", nullable: true),
                    url = table.Column<string>(type: "longtext", nullable: true),
                    LiveLectureClassId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recording", x => x.id);
                    table.ForeignKey(
                        name: "FK_Recording_LiveLectures_LiveLectureClassId",
                        column: x => x.LiveLectureClassId,
                        principalTable: "LiveLectures",
                        principalColumn: "Id");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ChatMessage",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    userid = table.Column<int>(type: "int", nullable: false),
                    content = table.Column<string>(type: "longtext", nullable: false),
                    timeStamp = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ChatLogid = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatMessage", x => x.id);
                    table.ForeignKey(
                        name: "FK_ChatMessage_ChatLog_ChatLogid",
                        column: x => x.ChatLogid,
                        principalTable: "ChatLog",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_ChatMessage_Users_userid",
                        column: x => x.userid,
                        principalTable: "Users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_LiveLectures_ChatLogid",
                table: "LiveLectures",
                column: "ChatLogid");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessage_ChatLogid",
                table: "ChatMessage",
                column: "ChatLogid");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessage_userid",
                table: "ChatMessage",
                column: "userid");

            migrationBuilder.CreateIndex(
                name: "IX_Recording_LiveLectureClassId",
                table: "Recording",
                column: "LiveLectureClassId");

            migrationBuilder.AddForeignKey(
                name: "FK_LiveLectures_ChatLog_ChatLogid",
                table: "LiveLectures",
                column: "ChatLogid",
                principalTable: "ChatLog",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LiveLectures_ChatLog_ChatLogid",
                table: "LiveLectures");

            migrationBuilder.DropTable(
                name: "ChatMessage");

            migrationBuilder.DropTable(
                name: "Recording");

            migrationBuilder.DropTable(
                name: "ChatLog");

            migrationBuilder.DropIndex(
                name: "IX_LiveLectures_ChatLogid",
                table: "LiveLectures");

            migrationBuilder.DropColumn(
                name: "ChatLogid",
                table: "LiveLectures");

            migrationBuilder.AddColumn<string>(
                name: "RecordingLink",
                table: "LiveLectures",
                type: "longtext",
                nullable: true);
        }
    }
}
