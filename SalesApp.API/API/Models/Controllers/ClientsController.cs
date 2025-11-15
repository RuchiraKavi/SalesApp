using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using SalesApp.API.Application.Interfaces;
using System.Collections.Generic;

namespace SalesApp.API.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientsController : ControllerBase
{
    private readonly IClientRepository _repo;
    public ClientsController(IClientRepository repo) => _repo = repo;

    [HttpGet] public async Task<IActionResult> Get() => Ok(await _repo.GetAllAsync());
    [HttpGet("{id}")] public async Task<IActionResult> Get(int id) => Ok(await _repo.GetByIdAsync(id));
}
