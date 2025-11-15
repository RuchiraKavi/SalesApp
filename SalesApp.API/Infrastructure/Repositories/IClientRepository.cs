using SalesApp.API.Domain.Entities;

namespace SalesApp.API.Application.Interfaces;
public interface IClientRepository
{
    Task<List<Client>> GetAllAsync();
    Task<Client?> GetByIdAsync(int id);
}
