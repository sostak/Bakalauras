namespace Bakalauras.Core.DTOs
{
    public class CustomerDto
    {
        public required string Id { get; set; }
        public required string UserId { get; set; }
        public required string PhoneNumber { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
    }
} 