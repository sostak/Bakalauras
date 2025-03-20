namespace Bakalauras.Entities
{
    public class InventoryItem
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required string Type { get; set; }
        public required string MeasurementUnit { get; set; }
        public int StockQuantity { get; set; }
        public int MinimumQuantity { get; set; }
        public ICollection<InventoryOperation> InventoryOperations { get; set; } = new List<InventoryOperation>();
    }
}
