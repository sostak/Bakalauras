using Microsoft.EntityFrameworkCore.Migrations;

namespace Bakalauras.Migrations
{
    public partial class MovePhoneNumberToUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Update User.PhoneNumber from Customer table
            migrationBuilder.Sql(@"
                UPDATE AspNetUsers u
                INNER JOIN Customers c ON u.Id = c.UserId
                SET u.PhoneNumber = c.PhoneNumber
                WHERE u.PhoneNumber IS NULL");

            // Update User.PhoneNumber from Mechanic table
            migrationBuilder.Sql(@"
                UPDATE AspNetUsers u
                INNER JOIN Mechanics m ON u.Id = m.UserId
                SET u.PhoneNumber = m.PhoneNumber
                WHERE u.PhoneNumber IS NULL");

            // Remove PhoneNumber column from Customer table
            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "Customers");

            // Remove PhoneNumber column from Mechanic table
            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "Mechanics");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Add back PhoneNumber column to Customer table
            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "Customers",
                type: "varchar(256)",
                nullable: true);

            // Add back PhoneNumber column to Mechanic table
            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "Mechanics",
                type: "varchar(256)",
                nullable: true);

            // Restore Customer.PhoneNumber from User.PhoneNumber
            migrationBuilder.Sql(@"
                UPDATE Customers c
                INNER JOIN AspNetUsers u ON c.UserId = u.Id
                SET c.PhoneNumber = u.PhoneNumber");

            // Restore Mechanic.PhoneNumber from User.PhoneNumber
            migrationBuilder.Sql(@"
                UPDATE Mechanics m
                INNER JOIN AspNetUsers u ON m.UserId = u.Id
                SET m.PhoneNumber = u.PhoneNumber");
        }
    }
} 