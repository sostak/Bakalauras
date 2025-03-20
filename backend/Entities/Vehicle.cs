namespace Bakalauras.Entities
{
    public class Vehicle
    {
        public Guid Id { get; set; }
        public required string LicensePlate { get; set; }
        public string? VIN { get; set; }
        public required string Manufacturer { get; set; }
        public required string Model { get; set; }
        public int? Year { get; set; }
        public string? Color { get; set; }

        public ICollection<Visit> Visits { get; set; } = new List<Visit>();
    }
}
