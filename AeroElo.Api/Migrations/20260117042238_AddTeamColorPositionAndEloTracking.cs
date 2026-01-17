using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AeroElo.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTeamColorPositionAndEloTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BlueTeamLosses",
                table: "Players",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "BlueTeamWins",
                table: "Players",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DefenseElo",
                table: "Players",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DefenseLosses",
                table: "Players",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DefenseWins",
                table: "Players",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OffenseElo",
                table: "Players",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OffenseLosses",
                table: "Players",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OffenseWins",
                table: "Players",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RedTeamLosses",
                table: "Players",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RedTeamWins",
                table: "Players",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DefenseEloChange",
                table: "MatchParticipants",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OffenseEloChange",
                table: "MatchParticipants",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Position",
                table: "MatchParticipants",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TeamColor",
                table: "MatchParticipants",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BlueTeamLosses",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "BlueTeamWins",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "DefenseElo",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "DefenseLosses",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "DefenseWins",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "OffenseElo",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "OffenseLosses",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "OffenseWins",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "RedTeamLosses",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "RedTeamWins",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "DefenseEloChange",
                table: "MatchParticipants");

            migrationBuilder.DropColumn(
                name: "OffenseEloChange",
                table: "MatchParticipants");

            migrationBuilder.DropColumn(
                name: "Position",
                table: "MatchParticipants");

            migrationBuilder.DropColumn(
                name: "TeamColor",
                table: "MatchParticipants");
        }
    }
}
