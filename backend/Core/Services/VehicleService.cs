using Bakalauras.Core.Interfaces;
using Bakalauras.Entities;
using Bakalauras.Core.DTOs;

namespace Bakalauras.Core.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly IVehicleRepository _repository;

        public VehicleService(IVehicleRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<VehicleDto>> GetAllAsync()
        {
            var vehicles = await _repository.GetAllAsync();
            return vehicles.Select(v => new VehicleDto
            {
                Id = v.Id,
                LicensePlate = v.LicensePlate,
                VIN = v.VIN,
                Manufacturer = v.Manufacturer,
                Model = v.Model,
                Year = v.Year,
                Color = v.Color
            });
        }

        public async Task<VehicleDto> GetByIdAsync(Guid id)
        {
            var vehicle = await _repository.GetByIdAsync(id);
            if (vehicle == null) return null;

            return new VehicleDto
            {
                Id = vehicle.Id,
                LicensePlate = vehicle.LicensePlate,
                VIN = vehicle.VIN,
                Manufacturer = vehicle.Manufacturer,
                Model = vehicle.Model,
                Year = vehicle.Year,
                Color = vehicle.Color
            };
        }

        public async Task<VehicleDto> CreateAsync(VehicleDto vehicleDto)
        {
            var vehicle = new Vehicle
            {
                Id = Guid.NewGuid(),
                LicensePlate = vehicleDto.LicensePlate,
                VIN = vehicleDto.VIN,
                Manufacturer = vehicleDto.Manufacturer,
                Model = vehicleDto.Model,
                Year = vehicleDto.Year,
                Color = vehicleDto.Color
            };

            var createdVehicle = await _repository.CreateAsync(vehicle);
            return new VehicleDto
            {
                Id = createdVehicle.Id,
                LicensePlate = createdVehicle.LicensePlate,
                VIN = createdVehicle.VIN,
                Manufacturer = createdVehicle.Manufacturer,
                Model = createdVehicle.Model,
                Year = createdVehicle.Year,
                Color = createdVehicle.Color
            };
        }

        public async Task<VehicleDto> UpdateAsync(Guid id, VehicleDto vehicleDto)
        {
            var vehicle = new Vehicle
            {
                Id = id,
                LicensePlate = vehicleDto.LicensePlate,
                VIN = vehicleDto.VIN,
                Manufacturer = vehicleDto.Manufacturer,
                Model = vehicleDto.Model,
                Year = vehicleDto.Year,
                Color = vehicleDto.Color
            };

            var updatedVehicle = await _repository.UpdateAsync(vehicle);
            return new VehicleDto
            {
                Id = updatedVehicle.Id,
                LicensePlate = updatedVehicle.LicensePlate,
                VIN = updatedVehicle.VIN,
                Manufacturer = updatedVehicle.Manufacturer,
                Model = updatedVehicle.Model,
                Year = updatedVehicle.Year,
                Color = updatedVehicle.Color
            };
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }
    }
} 