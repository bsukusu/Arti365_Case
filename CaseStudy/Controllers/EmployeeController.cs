using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CaseStudy.Model;
using Microsoft.EntityFrameworkCore;

namespace CaseStudy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly Context _context;

        public EmployeeController(Context context)
        {
            _context = context;
        }
        [HttpGet]
        public List<Employee> GetEmployees()
        {
            return _context.Employees.ToList();
        }

        [HttpGet("{id}")]
        public Employee GetEmployeebyId(int id)
        {
            return _context.Employees.SingleOrDefault(e => e.Id == id);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var emp = _context.Employees.SingleOrDefault(x => x.Id == id);
            if (emp == null)
            {
                return NotFound("Böyle bir Id'de:" + id + " kullanıcı bulunamadı.");
            }

            _context.Employees.Remove(emp);
            _context.SaveChanges();
            return Ok("Id'si:" + id + " olan personel silindi.");
        }

        [HttpPost]
        public IActionResult AddEmployee(Employee employee)
        {
            _context.Employees.Add(employee);
            _context.SaveChanges();
            return Created("/api/employees/" + employee.Id, employee);
        }
        [HttpPut("{id}")]
        public IActionResult Update(int id, Employee employee)
        {
            var emp = _context.Employees.SingleOrDefault(x => x.Id == id);
            if (emp == null) 
            {
                return NotFound("Böyle bir Id'de: " + id + " kullanıcı bulunamadı.");
            }

            if (!string.IsNullOrEmpty(employee.Name))
            {
                emp.Name = employee.Name;
            }
            if (!string.IsNullOrEmpty(employee.Gender))
            {
                emp.Gender = employee.Gender;
            }
            if (employee.Age > 0)
            {
                emp.Age = employee.Age;
            }
            if (employee.Salary > 0)
            {
                emp.Salary = employee.Salary;
            }
            if (!string.IsNullOrEmpty(employee.Departman))
            {
                emp.Departman = employee.Departman;
            }

            _context.Update(emp);
            _context.SaveChanges();
            return Ok("id'si: " + id + " olan çalışan güncellendi.");
        }


    }
}
