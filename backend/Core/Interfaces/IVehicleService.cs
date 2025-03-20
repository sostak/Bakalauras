using Bakalauras.Core.DTOs;

namespace Bakalauras.Core.Interfaces
{
    public interface IVehicleService
    {
        Task<IEnumerable<VehicleDto>> GetAllAsync();
        Task<VehicleDto> GetByIdAsync(Guid id);
        Task<VehicleDto> CreateAsync(VehicleDto vehicleDto);
        Task<VehicleDto> UpdateAsync(Guid id, VehicleDto vehicleDto);
        Task DeleteAsync(Guid id);
    }
} 