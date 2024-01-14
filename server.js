const { prompt } = require("inquirer");
const DB = require("./db");

async function loadMainPrompts() {
  const { choice } = await prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        { name: "View All Employees", value: "VIEW_EMPLOYEES" },
        {
          name: "View All Employees By Department",
          value: "VIEW_EMPLOYEES_BY_DEPARTMENT",
        },
        {
          name: "View All Employees By Manager",
          value: "VIEW_EMPLOYEES_BY_MANAGER",
        },
        { name: "Add Employee", value: "ADD_EMPLOYEE" },
        { name: "Remove Employee", value: "REMOVE_EMPLOYEE" },
        { name: "Update Employee Role", value: "UPDATE_EMPLOYEE_ROLE" },
        { name: "Update Employee Manager", value: "UPDATE_EMPLOYEE_MANAGER" },
        { name: "View All Roles", value: "VIEW_ROLES" },
        { name: "Add Role", value: "ADD_ROLE" },
        { name: "Remove Role", value: "REMOVE_ROLE" },
        { name: "View All Departments", value: "VIEW_DEPARTMENTS" },
        { name: "Add Department", value: "ADD_DEPARTMENT" },
        { name: "Remove Department", value: "REMOVE_DEPARTMENT" },
        {
          name: "View Total Utilized Budget By Department",
          value: "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT",
        },
        { name: "Quit", value: "QUIT" },
      ],
    },
  ]);

  switch (choice) {
    case "VIEW_EMPLOYEES":
      await viewEmployees();
      break;
    case "VIEW_EMPLOYEES_BY_DEPARTMENT":
      await viewEmployeesByDepartment();
      break;
    case "VIEW_EMPLOYEES_BY_MANAGER":
      await viewEmployeesByManager();
      break;
    case "ADD_EMPLOYEE":
      await addEmployee();
      break;
    case "REMOVE_EMPLOYEE":
      await removeEmployee();
      break;
    case "UPDATE_EMPLOYEE_ROLE":
      await updateEmployeeRole();
      break;
    case "UPDATE_EMPLOYEE_MANAGER":
      await updateEmployeeManager();
      break;
    case "VIEW_ROLES":
      await viewRoles();
      break;
    case "ADD_ROLE":
      await addRole();
      break;
    case "REMOVE_ROLE":
      await removeRole();
      break;
    case "VIEW_DEPARTMENTS":
      await viewDepartments();
      break;
    case "ADD_DEPARTMENT":
      await addDepartment();
      break;
    case "REMOVE_DEPARTMENT":
      await removeDepartment();
      break;
    case "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT":
      await viewUtilizedBudgetByDepartment();
      break;
    case "QUIT":
      quit();
      break;
    default:
      break;
  }
}

async function viewEmployees() {
  const [rows] = await DB.findEmployees();
  const employees = rows;
  console.log("\n");
  console.table(employees);
  await loadMainPrompts();
}

async function viewEmployeesByDepartment() {
  const [rows] = await DB.findDepartments();
  const departments = rows;
  const departmentChoices = departments.map(({ id, name }) => ({
    name,
    value: id,
  }));

  const { departmentId } = await prompt([
    {
      type: "list",
      name: "departmentId",
      message: "Which department would you like to see employees for?",
      choices: departmentChoices,
    },
  ]);

  const [employeesRows] = await DB.findEmployeesByDepartment(departmentId);
  const employees = employeesRows;
  console.log("\n");
  console.table(employees);
  await loadMainPrompts();
}

async function viewEmployeesByManager() {
  const [rows] = await DB.findEmployees();
  const managers = rows;
  const managerChoices = managers.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));

  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message: "Which employee do you want to see direct reports for?",
      choices: managerChoices,
    },
  ]);

  const [employeesRows] = await DB.findEmployeesManager(managerId);
  const employees = employeesRows;
  console.log("\n");
  if (employees.length === 0) {
    console.log("The selected employee has no direct reports");
  } else {
    console.table(employees);
  }
  await loadMainPrompts();
}

async function removeEmployee() {
  const [rows] = await DB.findEmployees();
  const employees = rows;
  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee do you want to remove?",
      choices: employeeChoices,
    },
  ]);

  await DB.removeEmployee(employeeId);
  console.log("Removed employee from the database");
  await loadMainPrompts();
}

async function updateEmployeeRole() {
  const [rows] = await DB.findEmployees();
  const employees = rows;
  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee's role do you want to update?",
      choices: employeeChoices,
    },
  ]);

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "Which role do you want to assign the selected employee?",
      choices: (
        await DB.findRoles()
      )[0].map(({ id, title }) => ({
        name: title,
        value: id,
      })),
    },
  ]);

  await DB.updateEmployeeRole(employeeId, roleId);
  console.log("Updated employee's role");
  await loadMainPrompts();
}

async function updateEmployeeManager() {
  const [rows] = await DB.findEmployees();
  const employees = rows;
  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee's manager do you want to update?",
      choices: employeeChoices,
    },
  ]);

  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message:
        "Which employee do you want to set as manager for the selected employee?",
      choices: (
        await DB.findManagers(employeeId)
      )[0].map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      })),
    },
  ]);

  await DB.updateEmployeeManager(employeeId, managerId);
  console.log("Updated employee's manager");
  await loadMainPrompts();
}

async function viewRoles() {
  const [rows] = await DB.findRoles();
  const roles = rows;
  console.log("\n");
  console.table(roles);
  await loadMainPrompts();
}

async function addRole() {
  const departments = (await DB.findDepartments())[0];
  const departmentChoices = departments.map(({ id, name }) => ({
    name,
    value: id,
  }));

  const role = await prompt([
    {
      name: "title",
      message: "What is the name of the role?",
    },
    {
      name: "salary",
      message: "What is the salary of the role?",
    },
    {
      type: "list",
      name: "department_id",
      message: "Which department does the role belong to?",
      choices: departmentChoices,
    },
  ]);

  await DB.createRole(role);
  console.log(`Added ${role.title} to the database`);
  await loadMainPrompts();
}

async function removeRole() {
  const [rows] = await DB.findRoles();
  const roles = rows;
  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }));

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message:
        "Which role do you want to remove? (Warning: This will also remove employees)",
      choices: roleChoices,
    },
  ]);

  await DB.removeRole(roleId);
  console.log("Removed role from the database");
  await loadMainPrompts();
}

async function viewDepartments() {
  const [rows] = await DB.findDepartments();
  const departments = rows;
  console.log("\n");
  console.table(departments);
  await loadMainPrompts();
}

async function addDepartment() {
  const { name } = await prompt([
    {
      name: "name",
      message: "What is the name of the department?",
    },
  ]);

  await DB.createDepartment({ name });
  console.log(`Added ${name} to the database`);
  await loadMainPrompts();
}

async function removeDepartment() {
  const [rows] = await DB.findDepartments();
  const departments = rows;
  const departmentChoices = departments.map(({ id, name }) => ({
    name,
    value: id,
  }));

  const { departmentId } = await prompt([
    {
      type: "list",
      name: "departmentId",
      message:
        "Which department would you like to remove? (Warning: This will also remove associated roles and employees)",
      choices: departmentChoices,
    },
  ]);

  await DB.removeDepartment(departmentId);
  console.log("Removed department from the database");
  await loadMainPrompts();
}

async function viewUtilizedBudgetByDepartment() {
  const [rows] = await DB.viewBudgets();
  const departments = rows;
  console.log("\n");
  console.table(departments);
  await loadMainPrompts();
}

async function addEmployee() {
  const { first_name, last_name } = await prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?",
    },
    {
      name: "last_name",
      message: "What is the employee's last name?",
    },
  ]);

  const roles = (await DB.findRoles())[0];
  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }));

  const employees = (await DB.findEmployees())[0];
  const managerChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  managerChoices.unshift({ name: "None", value: null });

  const { roleId, managerId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "What is the employee's role?",
      choices: roleChoices,
    },
    {
      type: "list",
      name: "managerId",
      message: "Who is the employee's manager?",
      choices: managerChoices,
    },
  ]);

  const employee = {
    manager_id: managerId,
    role_id: roleId,
    first_name,
    last_name,
  };
  await DB.createEmployee(employee);
  console.log(`Added ${first_name} ${last_name} to the database`);
  await loadMainPrompts();
}

function quit() {
  console.log("Goodbye!");
  process.exit();
}

loadMainPrompts();