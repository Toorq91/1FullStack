using SimpleTodoApp.Model;
using Microsoft.Data.SqlClient;
using Dapper;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("AllowAll");

const string connStr =
    @"Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=Todo;integrated Security=True;Connect Timeout=30;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False";

app.MapGet("/todo", async () =>
{
    var conn = new SqlConnection(connStr);
    const string sql = "SELECT Id, Text, Done FROM Todo";
    var todoItems = await conn.QueryAsync<TodoItem>(sql);
    return todoItems;
});
app.MapPost("/todo", async (TodoItem todoItem) =>
{
    var conn = new SqlConnection(connStr);
    const string sql = "INSERT Todo (Id, Text) VALUES(@Id, @Text)";
    var rowsAffected = await conn.ExecuteAsync(sql, todoItem);
    return rowsAffected;
});
app.MapPut("/todo", async (TodoItem todoItem) =>
{
    todoItem.Done = DateTime.Today;
    var conn = new SqlConnection(connStr);
    const string sql = "UPDATE Todo SET Done = @Done WHERE Id = @Id";
    var rowsAffected = await conn.ExecuteAsync(sql, todoItem);
    return rowsAffected;
});
app.MapDelete("/todo/{id}", async (Guid id) =>
{
    var conn = new SqlConnection(connStr);
    const string sql = "DELETE FROM Todo WHERE Id = @Id";
    var rowsAffected = await conn.ExecuteAsync(sql, new {Id=id});
    return rowsAffected;
});

app.UseStaticFiles();
app.Run();