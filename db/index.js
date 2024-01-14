const connection = require("./connection");

class EmployeeDatabase {
  constructor(dbConnection) {
    this.dbConnection = dbConnection;
  }

  async fetchAllEmployees() {
    const query = `
      SELECT 
        emp.id, emp.first_name, emp.last_name, 
        role.title, dept.name AS department, role.salary, 
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
      FROM 
        employee emp
        LEFT JOIN role ON emp.role_id = role.id
        LEFT JOIN department dept ON role.department_id = dept.id
        LEFT JOIN employee manager ON manager.id = emp.manager_id;
    `;

    return this.dbConnection.promise().query(query);
  }

  async fetchManagers(employeeId) {
    const query =
      "SELECT id, first_name, last_name FROM employee WHERE id != ?";
    return this.dbConnection.promise().query(query, employeeId);
  }

  async addNewEmployee(employeeData) {
    const query = "INSERT INTO employee SET ?";
    return this.dbConnection.promise().query(query, employeeData);
  }

  async removeStaffMember(employeeId) {
    const query = "DELETE FROM employee WHERE id = ?";
    return this.dbConnection.promise().query(query, employeeId);
  }

  async modifyEmployeeRole(employeeId, roleId) {
    const query = "UPDATE employee SET role_id = ? WHERE id = ?";
    return this.dbConnection.promise().query(query, [roleId, employeeId]);
  }

  async changeManager(employeeId, newManagerId) {
    const query = "UPDATE employee SET manager_id = ? WHERE id = ?";
    return this.dbConnection.promise().query(query, [newManagerId, employeeId]);
  }

  async getAllRoles() {
    const query = `
      SELECT 
        r.id, r.title, dept.name AS department, r.salary 
      FROM 
        role r
        LEFT JOIN department dept ON r.department_id = dept.id;
    `;

    return this.dbConnection.promise().query(query);
  }

  async createNewRole(roleData) {
    const query = "INSERT INTO role SET ?";
    return this.dbConnection.promise().query(query, roleData);
  }

  async deleteRole(roleId) {
    const query = "DELETE FROM role WHERE id = ?";
    return this.dbConnection.promise().query(query, roleId);
  }

  async getDepartments() {
    const query = "SELECT id, name FROM department;";
    return this.dbConnection.promise().query(query);
  }

  async checkBudgets() {
    const query = `
      SELECT 
        dept.id, dept.name, SUM(r.salary) AS utilized_budget 
      FROM 
        employee emp
        LEFT JOIN role r ON emp.role_id = r.id
        LEFT JOIN department dept ON r.department_id = dept.id
      GROUP BY 
        dept.id, dept.name;
    `;

    return this.dbConnection.promise().query(query);
  }

  async createNewDepartment(departmentData) {
    const query = "INSERT INTO department SET ?";
    return this.dbConnection.promise().query(query, departmentData);
  }

  async eliminateDepartment(departmentId) {
    const query = "DELETE FROM department WHERE id = ?";
    return this.dbConnection.promise().query(query, departmentId);
  }

  async getEmployeesByDepartment(departmentId) {
    const query = `
      SELECT 
        emp.id, emp.first_name, emp.last_name, r.title 
      FROM 
        employee emp
        LEFT JOIN role r ON emp.role_id = r.id
        LEFT JOIN department dept ON r.department_id = dept.id
      WHERE 
        dept.id = ?;
    `;

    return this.dbConnection.promise().query(query, departmentId);
  }

  async getEmployeesBySupervisor(supervisorId) {
    const query = `
      SELECT 
        emp.id, emp.first_name, emp.last_name, dept.name AS department, r.title 
      FROM 
        employee emp
        LEFT JOIN role r ON r.id = emp.role_id
        LEFT JOIN department dept ON dept.id = r.department_id
      WHERE 
        emp.manager_id = ?;
    `;

    return this.dbConnection.promise().query(query, supervisorId);
  }
}

module.exports = new EmployeeDatabase(connection);
