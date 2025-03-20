namespace Bakalauras.Entities
{
    public class InventoryOperation
    {
        public Guid Id { get; set; }
        public required string Description { get; set; }
        public int Quantity { get; set; }
        public DateTime Time { get; set; }
        public Guid InventoryItemId { get; set; }
        public InventoryItem? InventoryItem { get; set; }
    }
}
