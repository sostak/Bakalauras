namespace Bakalauras.Core.DTOs
{
    public class ChangeUserRoleDto
    {
        public required string UserId { get; set; }
        public required string NewRole { get; set; }
        public string? Specialization { get; set; }
        public int? ExperienceLevel { get; set; }
    }
} 