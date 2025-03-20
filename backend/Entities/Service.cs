namespace Bakalauras.Entities
{
    public class Service
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public DateTime PlannedStartTime { get; set; }
        public DateTime PlannedEndTime { get; set; }
        public required string Description { get; set; }

        public Guid? MechanicId { get; set; }
        public Mechanic? Mechanic { get; set; }

        public Guid? VisitId { get; set; }
        public Visit? Visit { get; set; }
    }
}
