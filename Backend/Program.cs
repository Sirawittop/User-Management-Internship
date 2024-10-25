using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using BCrypt.Net;
using System.Linq.Expressions;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")  // Allow your Angular app's origin
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();  // If you need to support credentials
        });
});

// Configure JSON serialization
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// Get connection string
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    throw new Exception("Connection string 'DefaultConnection' not found.");
}

// Add DbContext configuration
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Add CORS middleware - this must be called before other middleware
app.UseCors("AllowSpecificOrigins");

app.UseHttpsRedirection();

// GET endpoint
app.MapGet("/api/user/{id}", async (ApplicationDbContext db, int id) =>
{
    try
    {
        var user = await db.Users
            .Include(u => u.Role)
            .Include(u => u.Permission)
            .Where(u => u.Id == id)
            .Select(u => new UserDto
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                Phone = u.Phone,
                Username = u.Username,
                Role = u.Role != null ? new RoleDto
                {
                    Id = u.Role.Id,
                    Name = u.Role.Name
                } : null,
                Permission = u.Permission != null ? new PermissionDto
                {
                    Id = u.Permission.Id,
                    Name = u.Permission.Name
                } : null
            })
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return Results.NotFound(new
            {
                status = new
                {
                    code = "404",
                    description = "User not found"
                },
                data = (object?)null
            });
        }

        var response = new
        {
            status = new
            {
                code = "200",
                description = "Success"
            },
            data = user
        };

        return Results.Ok(response);
    }
    catch (Exception ex)
    {
        var errorResponse = new
        {
            status = new
            {
                code = "500",
                description = $"Database error: {ex.Message}"
            },
            data = (object?)null
        };

        return Results.Json(errorResponse, statusCode: 500);
    }
})
.WithName("GetUserById")
.WithOpenApi();


app.MapGet("/api/permissions", async (ApplicationDbContext db) =>
{
    try
    {
        var permissions = await db.Permissions
            .Select(p => new PermissionDto
            {
                Id = p.Id,
                Name = p.Name
            })
            .ToListAsync();

        var response = new
        {
            status = new
            {
                code = "200",
                description = "Success"
            },
            data = permissions
        };

        return Results.Ok(response);
    }
    catch (Exception ex)
    {
        var errorResponse = new
        {
            status = new
            {
                code = "500",
                description = $"Database error: {ex.Message}"
            },
            data = (object?)null
        };

        return Results.Json(errorResponse, statusCode: 500);
    }
})
.WithName("GetPermissions")
.WithOpenApi();

app.MapGet("/api/roles", async (ApplicationDbContext db) =>
{
    try
    {
        var roles = await db.Roles
            .Select(r => new RoleDto
            {
                Id = r.Id,
                Name = r.Name
            })
            .ToListAsync();

        var response = new
        {
            status = new
            {
                code = "200",
                description = "Success"
            },
            data = roles
        };

        return Results.Ok(response);
    }
    catch (Exception ex)
    {
        var errorResponse = new
        {
            status = new
            {
                code = "500",
                description = $"Database error: {ex.Message}"
            },
            data = (object?)null
        };

        return Results.Json(errorResponse, statusCode: 500);
    }
})
.WithName("GetRoles")
.WithOpenApi();


app.MapPost("/api/user", async (ApplicationDbContext db, UpdateUserRequest request) =>
{
    try
    {
        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Phone = request.Phone,
            Username = request.Username,
            CreatedAt = DateTime.UtcNow  // Set CreatedAt when creating user
        };

        // Handle Role assignment
        if (!string.IsNullOrEmpty(request.RoleId) && int.TryParse(request.RoleId, out int roleId))
        {
            var role = await db.Roles.FirstOrDefaultAsync(r => r.Id == roleId);
            if (role == null)
            {
                return Results.BadRequest(new
                {
                    status = new
                    {
                        code = "400",
                        description = "Invalid Role: Role not found"
                    },
                    data = (object?)null
                });
            }

            user.RoleId = roleId;
            user.Role = role;
        }

        // Handle Permission assignment
        if (request.Permission != null && !string.IsNullOrEmpty(request.Permission.PermissionId)
            && int.TryParse(request.Permission.PermissionId, out int permissionId))
        {
            var permission = await db.Permissions.FirstOrDefaultAsync(p => p.Id == permissionId);
            if (permission == null)
            {
                return Results.BadRequest(new
                {
                    status = new
                    {
                        code = "400",
                        description = "Invalid Permission: Permission not found"
                    },
                    data = (object?)null
                });
            }

            // Update permission properties
            permission.IsReadable = request.Permission.IsReadable;
            permission.IsWritable = request.Permission.IsWriteable;
            permission.IsDeletable = request.Permission.IsDeletable;

            user.PermissionId = permissionId;
            user.Permission = permission;
        }

        // Handle password
        if (!string.IsNullOrEmpty(request.Password))
        {
            // Using BCrypt.Net-Next for password hashing
            user.Password = BCrypt.Net.BCrypt.HashPassword(request.Password, BCrypt.Net.BCrypt.GenerateSalt());
        }

        db.Users.Add(user);
        await db.SaveChangesAsync();

        // Prepare response
        var response = new
        {
            status = new
            {
                code = "201",
                description = "User created successfully"
            },
            data = new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Phone = user.Phone,
                Username = user.Username,
                CreatedAt = user.CreatedAt,
                Role = user.Role != null ? new RoleDto
                {
                    Id = user.Role.Id,
                    Name = user.Role.Name
                } : null,
                Permission = user.Permission != null ? new PermissionDto
                {
                    Id = user.Permission.Id,
                    Name = user.Permission.Name
                } : null
            }
        };

        return Results.Created($"/api/user/{user.Id}", response);
    }
    catch (Exception ex)
    {
        var errorResponse = new
        {
            status = new
            {
                code = "500",
                description = $"Database error: {ex.Message}"
            },
            data = (object?)null
        };

        return Results.Json(errorResponse, statusCode: 500);
    }
})
.WithName("CreateUser")
.WithOpenApi();


app.MapPost("/api/users/DataTable", async (ApplicationDbContext db, UserListRequest request) =>
{
    try
    {
        // Validate request
        if (request == null)
        {
            return Results.BadRequest(new
            {
                status = new { code = "400", description = "Invalid request parameters" },
                data = (object?)null
            });
        }

        // Ensure valid pagination parameters
        request.PageNumber = Math.Max(1, request.PageNumber);
        request.PageSize = Math.Max(1, request.PageSize);

        var query = db.Users
            .Include(u => u.Role)
            .Include(u => u.Permission)
            .AsQueryable();

        // Filter by search term with null checks
        if (!string.IsNullOrEmpty(request.Search))
        {
            var searchTerm = request.Search.Trim();
            query = query.Where(u =>
                (u.FirstName != null && u.FirstName.Contains(searchTerm)) ||
                (u.LastName != null && u.LastName.Contains(searchTerm)) ||
                (u.Email != null && u.Email.Contains(searchTerm)) ||
                (u.Phone != null && u.Phone.Contains(searchTerm)) ||
                (u.Username != null && u.Username.Contains(searchTerm)) ||
                (u.Role != null && u.Role.Name != null && u.Role.Name.Contains(searchTerm)) ||
                (u.Permission != null && u.Permission.Name != null && u.Permission.Name.Contains(searchTerm)));
        }

        // Sort by column with null safety
        if (!string.IsNullOrEmpty(request.OrderBy))
        {
            var propertyInfo = typeof(User).GetProperty(request.OrderBy, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
            if (propertyInfo != null)
            {
                var parameter = Expression.Parameter(typeof(User), "x");
                var property = Expression.Property(parameter, propertyInfo);

                // Handle nullable properties
                var propertyType = propertyInfo.PropertyType;
                var isNullable = propertyType.IsGenericType && propertyType.GetGenericTypeDefinition() == typeof(Nullable<>);

                Expression convertedProperty;
                if (propertyType.IsValueType && !isNullable)
                {
                    convertedProperty = Expression.Convert(property, typeof(object));
                }
                else
                {
                    // For reference types and nullable value types, coalesce with a default value
                    var defaultValue = Expression.Constant(propertyType.IsValueType ?
                        Activator.CreateInstance(propertyType.GetGenericArguments()[0]) :
                        null,
                        typeof(object));
                    convertedProperty = Expression.Convert(
                        Expression.Coalesce(property, Expression.Convert(defaultValue, propertyType)),
                        typeof(object));
                }

                var lambda = Expression.Lambda<Func<User, object>>(convertedProperty, parameter);

                query = request.OrderDirection?.ToLower() == "desc"
                    ? query.OrderByDescending(lambda)
                    : query.OrderBy(lambda);
            }
        }

        // Calculate pagination values
        var skip = (request.PageNumber - 1) * request.PageSize;
        var totalRecords = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalRecords / (double)request.PageSize);

        // Get paginated results with null-safe projections
        var users = await query
            .Skip(skip)
            .Take(request.PageSize)
            .Select(u => new UserDto
            {
                Id = u.Id,
                CreatedAt = u.CreatedAt,
                FirstName = u.FirstName ?? string.Empty,
                LastName = u.LastName ?? string.Empty,
                Email = u.Email ?? string.Empty,
                Phone = u.Phone ?? string.Empty,
                Username = u.Username ?? string.Empty,
                Role = u.Role != null ? new RoleDto
                {
                    Id = u.Role.Id,
                    Name = u.Role.Name ?? string.Empty
                } : null,
                Permission = u.Permission != null ? new PermissionDto
                {
                    Id = u.Permission.Id,
                    Name = u.Permission.Name ?? string.Empty
                } : null
            })
            .ToListAsync();

        var response = new
        {
            status = new
            {
                code = "200",
                description = "Success"
            },
            data = new
            {
                items = users,
                pageNumber = request.PageNumber,
                pageSize = request.PageSize,
                totalPages = totalPages,
                totalRecords = totalRecords,
                hasNextPage = request.PageNumber < totalPages,
                hasPreviousPage = request.PageNumber > 1
            }
        };

        return Results.Ok(response);
    }
    catch (Exception ex)
    {
        // Log the exception here
        var errorResponse = new
        {
            status = new
            {
                code = "500",
                description = "An error occurred while processing your request.",
                details = ex.Message // Only include in development environment
            },
            data = (object?)null
        };

        return Results.Json(errorResponse, statusCode: 500);
    }
})
.WithName("GetUsersDataTable")
.WithOpenApi();

// PUT endpoint
app.MapPut("/api/user/{id}", async (ApplicationDbContext db, int id, UpdateUserRequest request) =>
{
    try
    {
        var user = await db.Users
            .Include(u => u.Role)
            .Include(u => u.Permission)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            return Results.NotFound(new
            {
                status = new { code = "404", description = "User not found" },
                data = (object?)null
            });
        }


        // Update basic user properties
        user.FirstName = request.FirstName ?? user.FirstName;
        user.LastName = request.LastName ?? user.LastName;
        user.Email = request.Email ?? user.Email;
        user.Phone = request.Phone ?? user.Phone;
        user.Username = request.Username ?? user.Username;

        if (!string.IsNullOrEmpty(request.Password))
        {
            // Add password hashing here if needed
            user.Password = request.Password;
        }

        // Update Role
        if (!string.IsNullOrEmpty(request.RoleId))
        {
            if (!int.TryParse(request.RoleId, out int roleId))
            {
                return Results.BadRequest(new
                {
                    status = new { code = "400", description = $"Invalid RoleId format: {request.RoleId}" },
                    data = (object?)null
                });
            }

            var role = await db.Roles.FindAsync(roleId);
            if (role == null)
            {
                return Results.BadRequest(new
                {
                    status = new { code = "400", description = $"Role with ID {roleId} not found" },
                    data = (object?)null
                });
            }

            user.RoleId = roleId;
            user.Role = role;
        }

        // Update or Create Permission
        if (request.Permission != null)
        {
            var permission = user.Permission;

            // If no existing permission, create new one
            if (permission == null)
            {
                permission = new Permission
                {
                    Name = $"Permission_{user.Username}", // Or any other naming convention
                    IsReadable = request.Permission.IsReadable,
                    IsWritable = request.Permission.IsWriteable,
                    IsDeletable = request.Permission.IsDeletable
                };
                db.Permissions.Add(permission);
                await db.SaveChangesAsync(); // Save to generate ID
                user.PermissionId = permission.Id;
            }
            else
            {
                // Update existing permission
                permission.IsReadable = request.Permission.IsReadable;
                permission.IsWritable = request.Permission.IsWriteable;
                permission.IsDeletable = request.Permission.IsDeletable;
            }

            user.Permission = permission;
        }

        await db.SaveChangesAsync();

        // Refresh the user object with latest data
        await db.Entry(user)
            .Reference(u => u.Role)
            .LoadAsync();
        await db.Entry(user)
            .Reference(u => u.Permission)
            .LoadAsync();

        var updatedUser = new UserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Phone = user.Phone,
            Username = user.Username,
            Role = user.Role != null ? new RoleDto
            {
                Id = user.Role.Id,
                Name = user.Role.Name
            } : null,
            Permission = user.Permission != null ? new PermissionDto
            {
                Id = user.Permission.Id,
                Name = user.Permission.Name,
                IsReadable = user.Permission.IsReadable,
                IsWritable = user.Permission.IsWritable,
                IsDeletable = user.Permission.IsDeletable
            } : null
        };

        return Results.Ok(new
        {
            status = new { code = "200", description = "User updated successfully" },
            data = updatedUser
        });
    }
    catch (Exception ex)
    {
        return Results.Json(new
        {
            status = new { code = "500", description = $"Database error: {ex.Message}" },
            data = (object?)null
        }, statusCode: 500);
    }
})
.WithName("UpdateUserById")
.WithOpenApi();

// DELETE endpoint
app.MapDelete("/api/user/{id}", async (ApplicationDbContext db, int id) =>
{
    try
    {
        var user = await db.Users.FindAsync(id);

        if (user == null)
        {
            return Results.NotFound(new
            {
                status = new
                {
                    code = "404",
                    description = "User not found"
                },
                data = new
                {
                    result = false,
                    message = "User does not exist."
                }
            });
        }

        db.Users.Remove(user);
        await db.SaveChangesAsync();

        var response = new
        {
            status = new
            {
                code = "200",
                description = "User deleted successfully"
            },
            data = new
            {
                result = true,
                message = "User has been deleted."
            }
        };

        return Results.Ok(response);
    }
    catch (Exception ex)
    {
        var errorResponse = new
        {
            status = new
            {
                code = "500",
                description = $"Database error: {ex.Message}"
            },
            data = new
            {
                result = false,
                message = "An error occurred while deleting the user."
            }
        };

        return Results.Json(errorResponse, statusCode: 500);
    }
})
.WithName("DeleteUserById")
.WithOpenApi();

app.Run();

// Request DTOs
public class UpdateUserRequest
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Username { get; set; }
    public string? Password { get; set; }
    public string? RoleId { get; set; }  // This will receive the numeric ID as a string
    public UpdatePermissionRequest? Permission { get; set; }
}

public class UpdatePermissionRequest
{
    public string? PermissionId { get; set; }
    public bool IsReadable { get; set; }
    public bool IsWriteable { get; set; }
    public bool IsDeletable { get; set; }
}

// Response DTOs
public class UserDto
{
    public int Id { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Username { get; set; }
    public RoleDto? Role { get; set; }
    public PermissionDto? Permission { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class RoleDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class PermissionDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public bool IsReadable { get; set; }
    public bool IsWritable { get; set; }
    public bool IsDeletable { get; set; }
}

// Entity models
public class User
{
    public int Id { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Username { get; set; }
    public string? Password { get; set; }
    public int? RoleId { get; set; }
    public Role? Role { get; set; }
    public int? PermissionId { get; set; }
    public Permission? Permission { get; set; }
    public DateTime CreatedAt { get; set; }
}
public class Role
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public ICollection<User>? Users { get; set; }
}

public class Permission
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public bool IsReadable { get; set; }
    public bool IsWritable { get; set; }
    public bool IsDeletable { get; set; }
    public ICollection<User>? Users { get; set; }
}

public class UserListRequest
{
    public string? OrderBy { get; set; }
    public string? OrderDirection { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Search { get; set; }
}


public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<Permission> Permissions { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().ToTable("Users");
        modelBuilder.Entity<Role>().ToTable("Role");
        modelBuilder.Entity<Permission>().ToTable("Permission");

        modelBuilder.Entity<User>()
            .HasOne(u => u.Role)
            .WithMany(r => r.Users)
            .HasForeignKey(u => u.RoleId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<User>()
            .HasOne(u => u.Permission)
            .WithMany(p => p.Users)
            .HasForeignKey(u => u.PermissionId)
            .OnDelete(DeleteBehavior.SetNull);

        // Configure default value for CreatedAt
        modelBuilder.Entity<User>()
            .Property(u => u.CreatedAt)
            .HasDefaultValueSql("GETDATE()");
    }
}