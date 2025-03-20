using Microsoft.AspNetCore.Identity;

namespace Bakalauras.Entities
{
    public class UserRoles
    {
        public const string Admin = nameof(Admin);
        public const string Customer = nameof(Customer);
        public const string Mechanic = nameof(Mechanic);

        public static readonly IReadOnlyCollection<string> All = [Admin, Customer, Mechanic];
    }
}
