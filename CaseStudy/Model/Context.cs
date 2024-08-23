using Microsoft.EntityFrameworkCore;
namespace CaseStudy.Model
{
    public class Context:DbContext
    {
        public Context(DbContextOptions options):base(options)
        {
        
        }
        public DbSet<Employee> Employees { get; set; }  
    }
}
