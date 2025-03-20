namespace Bakalauras.Entities
{
    public class Customer
    {
        public Guid Id { get; set; }
        public string? UserId { get; set; }
        public User? User { get; set; }
        public ICollection<Visit> Visits { get; set; } = new List<Visit>();
    }
}
