using AutoMapper;
using Bakalauras.Entities;
using Bakalauras.Core.DTOs;

namespace Bakalauras.Core.Mappings
{
    public class UserMappingProfile : Profile
    {
        public UserMappingProfile()
        {
            CreateMap<User, UserDto>();
        }
    }
}
