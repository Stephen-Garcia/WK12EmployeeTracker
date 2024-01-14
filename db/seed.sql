use company_employee_db;

INSERT INTO department (name) VALUES
    ('HR'),
    ('Development'),
    ('Management'),
    ('Social Marketing');

INSERT INTO role (title, salary, department_id) VALUES
    ('HR Manager', 80000, 1),
    ('Compliance Coordinator', 60000, 1),
    ('Senior Developer', 150000, 2),
    ('Software Developer', 120000, 2),
    ('Project Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Marketing Lead', 70000, 4),
    ('Social Media Manager', 60000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ('Mary', 'Smith', 1, NULL),
    ('Kinsley', 'Garcia', 2, 1),
    ('Emma', 'Johnson', 3, NULL),
    ('Liam', 'Martinez', 4, 3),
    ('Noah', 'Anderson', 5, NULL),
    ('Sophia', 'Wilson', 6, 5),
    ('Ethan', 'Taylor', 7, NULL),
    ('Jackson', 'Miller', 8, 7);

