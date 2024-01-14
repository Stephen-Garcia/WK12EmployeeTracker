const connection = require("./connection");

class EmployeeDB {
  constructor(connection) {
    this.connection = connection;
  }

  async findEmployees() {
    const query = `
      SELECT 
        e.id, e.first_name, e.last_name, 
        r.title, d.name AS department, r.salary, 
        CONCAT(m.first_name, ' ', m.last_name) AS manager 
      FROM 
        employee e
        LEFT JOIN role r ON e.role_id = r.id
        LEFT JOIN department d ON r.department_id = d.id
        LEFT JOIN employee m ON m.id = e.manager_id;
    `;

    return this.connection.promise().query(query);
  }

  async findManagers(employeeId) {
    const query =
      "SELECT id, first_name, last_name FROM employee WHERE id != ?";
    return this.connection.promise().query(query, employeeId);
  }

  async createEmployee(employee) {
    const query = "INSERT INTO employee SET ?";
    return this.connection.promise().query(query, employee);
  }

  async removeEmployee(employeeId) {
    const query = "DELETE FROM employee WHERE id = ?";
    return this.connection.promise().query(query, employeeId);
  }

  async updateEmployeeRole(employeeId, roleId) {
    const query = "UPDATE employee SET role_id = ? WHERE id = ?";
    return this.connection.promise().query(query, [roleId, employeeId]);
  }

  async updateEmployeeManager(employeeId, managerId) {
    const query = "UPDATE employee SET manager_id = ? WHERE id = ?";
    return this.connection.promise().query(query, [managerId, employeeId]);
  }

  async findRoles() {
    const query = `
      SELECT 
        r.id, r.title, d.name AS department, r.salary 
      FROM 
        role r
        LEFT JOIN department d ON r.department_id = d.id;
    `;

    return this.connection.promise().query(query);
  }

  async createRole(role) {
    const query = "INSERT INTO role SET ?";
    return this.connection.promise().query(query, role);
  }

  async removeRole(roleId) {
    const query = "DELETE FROM role WHERE id = ?";
    return this.connection.promise().query(query, roleId);
  }

  async findDepartments() {
    const query = "SELECT id, name FROM department;";
    return this.connection.promise().query(query);
  }

  async viewBudgets() {
    const query = `
      SELECT 
        d.id, d.name, SUM(r.salary) AS utilized_budget 
      FROM 
        employee e
        LEFT JOIN role r ON e.role_id = r.id
        LEFT JOIN department d ON r.department_id = d.id
      GROUP BY 
        d.id, d.name;
    `;

    return this.connection.promise().query(query);
  }

  async createDepartment(department) {
    const query = "INSERT INTO department SET ?";
    return this.connection.promise().query(query, department);
  }

  async removeDepartment(departmentId) {
    const query = "DELETE FROM department WHERE id = ?";
    return this.connection.promise().query(query, departmentId);
  }

  async findEmployeesByDepartment(departmentId) {
    const query = `
      SELECT 
        e.id, e.first_name, e.last_name, r.title 
      FROM 
        employee e
        LEFT JOIN role r ON e.role_id = r.id
        LEFT JOIN department d ON r.department_id = d.id
      WHERE 
        d.id = ?;
    `;

    return this.connection.promise().query(query, departmentId);
  }

  async findEmployeesManager(managerId) {
    const query = `
      SELECT 
        e.id, e.first_name, e.last_name, d.name AS department, r.title 
      FROM 
        employee e
        LEFT JOIN role r ON r.id = e.role_id
        LEFT JOIN department d ON d.id = r.department_id
      WHERE 
        e.manager_id = ?;
    `;

    return this.connection.promise().query(query, managerId);
  }
}

module.exports = new EmployeeDB(connection);