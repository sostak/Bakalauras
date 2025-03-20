namespace Bakalauras.Entities
{
    public class Mechanic
    {
        public Guid Id { get; set; }
        public string? UserId { get; set; }
        public User? User { get; set; }
        public required string Specialization { get; set; }
        public int ExperienceLevel { get; set; }
        public ICollection<Visit> Visits { get; set; } = new List<Visit>();
        public ICollection<Service> Services { get; set; } = new List<Service>();
    }
}
