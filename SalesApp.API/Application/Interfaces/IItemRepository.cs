using System.Collections.Generic;
using System.Threading.Tasks;
using SalesApp.API.Domain.Entities;

namespace SalesApp.API.Application.Interfaces;

public interface IItemRepository
{
    Task<List<Item>> GetAllAsync();
    Task<Item?> GetByIdAsync(int id);
}
