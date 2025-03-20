namespace Bakalauras.Entities
{
    public class Visit
    {
        public Guid Id { get; set; }
        public DateTime Time { get; set; }
        public required string Status { get; set; }
        public required string Type { get; set; }
        public Guid? CustomerId { get; set; }
        public Customer? Customer { get; set; }
        public Guid? VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }
        public Guid? MechanicId { get; set; }
        public Mechanic? Mechanic { get; set; }
        public ICollection<Service> Services { get; set; } = new List<Service>();
    }
}
