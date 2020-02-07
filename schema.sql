DROP DATABASE IF EXISTS Management_db;
CREATE database Management_db;

USE Management_db;

CREATE TABLE department (  
    id INTEGER AUTO_INCREMENT, 
    name VARCHAR(30) NOT NULL,  
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INTEGER AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL (10,2),
    department_id INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department (id)
);

CREATE TABLE employee (
    id INTEGER AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role (id),
    FOREIGN KEY (manager_id) REFERENCES employee (id)
);

insert into department (name) values ('Sales');
insert into department (name) values ('Finance');
insert into department (name) values ('Legal');
insert into department (name) values ('Engineering');
insert into department (name) values ('Marketing');

insert into role (title, salary, department_id ) values ('Sales Lead', '31520', '1');
insert into role (title, salary, department_id ) values ('Salesperson', '26972', '1');
insert into role (title, salary, department_id ) values ('Chief Finance Officer', '128144', '2');
insert into role (title, salary, department_id ) values ('Auditor', '54783', '2');
insert into role (title, salary, department_id ) values ('Accountant', '63651', '2');
insert into role (title, salary, department_id ) values ('Lawyer', '72000', '3');
insert into role (title, salary, department_id ) values ('Legal Team Leader', '54751', '3');
insert into role (title, salary, department_id ) values ('Full Stack Developer', '111659', '4');
insert into role (title, salary, department_id ) values ('Junior Front end Developer', '56368', '4');
insert into role (title, salary, department_id ) values ('junior Back end Developer', '129734', '4');
insert into role (title, salary, department_id ) values ('Creative Director', '65000', '5');
insert into role (title, salary, department_id ) values ('Advertising Assistant', '38000', '5');

-- First we have to add Managers

insert into employee (first_name, last_name, role_id) values ('Parvin', 'Jahangirova', '1');
insert into employee (first_name, last_name, role_id) values ('Marco', 'Carrillo', '3');
insert into employee (first_name, last_name, role_id) values ('Arron', 'Smith', '6');
insert into employee (first_name, last_name, role_id) values ('Nasimi', 'Guliyev', '8');
insert into employee (first_name, last_name, role_id) values ('Ravil', 'Kutyev', '11');

-- Then we can add Employee

insert into employee (first_name, last_name, role_id, manager_id) values ('Kayla', 'Serene', '2', '1');
insert into employee (first_name, last_name, role_id, manager_id) values ('Maddi', 'Schmidt', '4', '2');
insert into employee (first_name, last_name, role_id, manager_id) values ('Jennifer', 'Plawski', '5', '2');
insert into employee (first_name, last_name, role_id, manager_id) values ('Kyah', 'Lowery', '7', '3');
insert into employee (first_name, last_name, role_id, manager_id) values ('Erin', 'Hollis', '9', '4');
insert into employee (first_name, last_name, role_id, manager_id) values ('Emily', 'Owen', '10', '4');
insert into employee (first_name, last_name, role_id, manager_id) values ('Nicholas', 'Bylsma', '12', '5');