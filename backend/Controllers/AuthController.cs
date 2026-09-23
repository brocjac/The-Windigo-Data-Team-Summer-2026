using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Models;
using Microsoft.AspNetCore.Mvc.ActionConstraints;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ThePondsBuildingDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(ThePondsBuildingDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    // POST: /api/Auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterWorkerRequest request)
    {
        string email = request.Email.Trim().ToLower();

        var emailExist = await _context.Workers.AnyAsync(x => x.Email == email);

        if (emailExist)
        {
            return BadRequest("An account with this email already exists.");
        }

        var worker = new Worker
        {
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = email,
            AccountStatus = "pending",
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

        var passwordHasher = new PasswordHasher<Worker>();

        worker.PasswordHash = passwordHasher.HashPassword(
            worker,
            request.Password
        );

        _context.Workers.Add(worker);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            worker.WorkerId,
            worker.FirstName,
            worker.LastName,
            worker.Email,
            worker.AccountStatus
        });

    }

    // POST: /api/Auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        string email = request.Email.Trim().ToLower();

        var worker = await _context.Workers.FirstOrDefaultAsync(x => x.Email == email);

        if (worker == null)
        {
            return Unauthorized("Invalid email or password.");
        }

        var passwordHasher = new PasswordHasher<Worker>();

        var passwordResult = passwordHasher.VerifyHashedPassword(
            worker,
            worker.PasswordHash,
            request.Password
        );

        if (passwordResult == PasswordVerificationResult.Failed)
        {
            return Unauthorized("Invalid email or password.");
        }

        if (worker.AccountStatus != "active")
        {
            return Unauthorized("This account is not active.");
        }

        var token = CreateToken(worker);

        return Ok(new
        {
            token,
            worker = new
            {
                worker.WorkerId,
                worker.FirstName,
                worker.LastName,
                worker.Email
            }
        });
    }

    private string CreateToken(Worker worker)
    {
        var jwtKey = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException(
                "JWT Key is not configured."
            );

        var jwtIssuer = _configuration["Jwt:Issuer"]
            ?? throw new InvalidOperationException(
                "JWT Issuer is not configured."
            );

        var jwtAudience = _configuration["Jwt:Audience"]
            ?? throw new InvalidOperationException(
                "JWT Audience is not configured."
            );
        var claims = new List<Claim>
        {
            new Claim("WorkerId", worker.WorkerId.ToString()),
            new Claim(ClaimTypes.Name, $"{worker.FirstName} {worker.LastName}"),
            new Claim(ClaimTypes.Email, worker.Email)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey)
        );

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims:claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}