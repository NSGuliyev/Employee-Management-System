var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",
  password: "Nn18101988",

  database: "management_db"
});


connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "options",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "View All Roles",
        "Add Role",
        "Remove Role",
        "Exit"
      ]
    })
    .then(function (answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.options === 'View All Employees') {
        allEmployees();
      }
      else if (answer.options === 'View All Employees by Department') {
        employeesByDepartment();
      }
      else if (answer.options === 'View All Employees by Manager') {
        employeesByManager();
      }
      else if (answer.options === 'Add Employee') {
        addEmployee();
      }
      else if (answer.options === 'Remove Employee') {
        removeEmployee();
      }
      else if (answer.options === 'Update Employee Role') {
        updateEmployeeRole();
      }
      else if (answer.options === 'Update Employee Manager') {
        updateEmployeeManager();
      }
      else if (answer.options === 'View All Roles') {
        viewAllRoles();
      }
      else if (answer.options === 'Add Role') {
        addRole();
      }
      else if (answer.options === 'Remove Role') {
        removeRole();
      }
      else {
        connection.end();
      }
    });
};

// update res[i] with manager's name
function allEmployees() {
  connection.query(`SELECT employee.id, first_name, last_name, title, Department, salary, manager_id 
                      FROM ((employee  join role on employee.role_id = role.id) 
                      inner join department on role.department_id = department.id);`, function (err, res) {
    if (err) throw err;
    // loop through all employees
    for (let i = 0; i < res.length; i++) {
      // if they have a manager_id
      if (res[i].manager_id) {
        // find the manager
        var found = res.find(function (employee) {
          return res[i].manager_id === employee.id
        })
        // console.log(found);
        // update res[i] with manager's name
        res[i].manager_id = found.first_name + " " + found.last_name
      }
    }
    console.table(res);
    start();
  });
};

function employeesByDepartment() {
  connection.query(`SELECT Department, employee.id, first_name, last_name, title 
  FROM ((employee 
    inner join role on employee.role_id = role.id) 
    inner join department on role.department_id = department.id);`, function (err, res) {
    if (err) throw err
    console.table(res);
    start();
  });
};

function employeesByManager() {
  connection.query(`SELECT employee.id, first_name, last_name, manager_id 
  FROM ((employee  join role on employee.role_id = role.id) 
  inner join department on role.department_id = department.id);`, function (err, res) {
    if (err) throw err;
    // loop through all employees
    for (let i = 0; i < res.length; i++) {
      // if they have a manager_id
      if (res[i].manager_id) {
        // find the manager
        var found = res.find(function (employee) {
          return res[i].manager_id === employee.id
        })
        // console.log(found);
        // update res[i] with manager's name
        res[i].manager_id = found.first_name + " " + found.last_name
      }
    }
    console.table(res);
    start();
  });
};

function addEmployee() {
  connection.query("SELECT * FROM role", function (err, results) {
    connection.query("SELECT * FROM employee WHERE manager_id is NULL", function (err, manager) {
      if (err) throw err;
      var managerArray = [];
      var choiceArray = [];
      for (var i = 0; i < manager.length; i++) {

        managerArray.push(`${manager[i].id}`);
      }

      for (var i = 0; i < results.length; i++) {
        choiceArray.push(`${results[i].id}`);
      }

      inquirer
        .prompt([
          {
            name: "firstName",
            type: "input",
            message: "What is the employee's fist name ?"
          },
          {
            name: "lastName",
            type: "input",
            message: "What is the employee's last name ?"
          },
          {
            name: "role",
            type: "list",
            message: "What is the employee's role ?",
            choices: choiceArray
          },
          {
            name: "manager",
            type: "list",
            message: "Who is the employee's manager ? ",
            choices: managerArray
          }
        ])
        .then(function (answer) {
          // when finished prompting, insert a new item into the db with that info
          console.log(answer);
          console.log("INSERT INTO employee SET ?",
            {
              first_name: answer.firstName,
              last_name: answer.lastName,
              role_id: answer.role,
              manager_id: answer.manager
            })
          connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: answer.firstName,
              last_name: answer.lastName,
              role_id: answer.role,
              manager_id: answer.manager
            },
            function (err) {
              if (err) throw err;
              console.log("New employee was created successfully!");
              start();
            }
          );
        });
    });
  });
};

function removeEmployee() {
  connection.query("SELECT * FROM employee", function (err, employeeId) {
    if (err) throw err;
    var employeeIdArray = [];
    for (var i = 0; i < employeeId.length; i++) {
      employeeIdArray.push(`${employeeId[i].id}`);
    }

    inquirer.prompt([
      {
        name: "id",
        type: "list",
        message: "Select the id of employee to remove !",
        choices: employeeIdArray
      }
    ])
      .then(function (answer) {
        console.log(answer);
        console.log("DELETE * FROM employee where = ? ",
          {
            id: answer.id,
          })

        connection.query("Delete from employee Where ?",
          {
            id: answer.id
          },
          function (err) {
            if (err) throw err;
            console.log("Employee was deleted successfully!");
            start();
          }
        );
      });
  });
};

function updateEmployeeRole() {
  connection.query("select * from employee", function (err, employee_Id) {
    connection.query("select * from role", function (err, roleId) {
      if (err) throw err;
      var employeeArray = [];
      var roleArray = [];

      for (var i = 0; i < employee_Id.length; i++) {
        employeeArray.push(`${employee_Id[i].id}`);
      };

      for (var i = 0; i < roleId.length; i++) {
        roleArray.push(`${roleId[i].id}`);
      }

      inquirer.prompt([
        {
          name: "employeeId",
          type: "list",
          message: "Which employee's role do you want to update ?",
          choices: employeeArray
        },
        {
          name: "roleId",
          type: "list",
          message: "What role do you want to assign to selected employee ? ",
          choices: roleArray
        }
      ]).then(function (answer) {
        console.log(answer);
        connection.query("update employee set ? where ?",
          [{
            role_id: answer.roleId

          },
          {
            id: answer.employeeId
          }],
          function (err) {
            if (err) throw err;
            console.log("Employee's role was updated successfully !");
            start();
          });
      });
    });
  });
};

function updateEmployeeManager() {
  connection.query("select * from employee", function (err, employeeId) {
    if (err) throw err;
    var employeeIdArray = [];
    for (var i = 0; i < employeeId.length; i++) {
      employeeIdArray.push(`${employeeId[i].id}`);
    }

    inquirer.prompt([
      {
        name: "employeeId",
        type: "list",
        message: "Which employee's manager do you want to update ?",
        choices: employeeIdArray
      },
      {
        name: "managerId",
        type: "list",
        message: "Which employee do you want to set as manager for the selected employee ? ",
        choices: employeeIdArray
      }
    ]).then(function (answer) {
      console.log(answer);
      connection.query("update employee set ? where ?",
        [{
          manager_id: answer.managerId
        },
        {
          id: answer.employeeId
        }
        ],
        function (err) {
          if (err) throw err;
          console.log("Employee manager was updated successfully !");
          start();
        }
      );
    });
  });
};

function viewAllRoles() {
  connection.query("select role.id, title, salary, Department from role inner join department on role.department_id = department.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      start();
    });
};

function addRole() {
  connection.query("SELECT * FROM department", function (err, result) {
    if (err) throw err;
    var departmentId = [];
    for (var i = 0; i < result.length; i++) {
      departmentId.push(`${result[i].id}`)
    }
    inquirer.prompt([
      {
        name: "position",
        type: "input",
        message: "Add the title please: "
      },
      {
        name: "wages",
        type: "input",
        message: "Add the salary please: "

      },
      {
        name: "department",
        type: "list",
        message: "Choose the Department ID from the list: ",
        choices: departmentId
      }
    ])
      .then(function (answer) {
        console.log(answer);
        connection.query("INSERT INTO role SET ?",
          {
            title: answer.position,
            salary: answer.wages,
            department_id: answer.department
          },
          function (err) {
            if (err) throw err;
            console.log("New role was created successfully!");
            start();
          }
        );
      });
  });
};

function removeRole() {
  connection.query("SELECT * FROM role", function (err, roleTable) {
    if (err) throw err;
    var roleIdArray = [];
    for (var i = 0; i < roleTable.length; i++) {
      roleIdArray.push(`${roleTable[i].id}`);
    }

    inquirer
      .prompt([
        {
          name: "id",
          type: "list",
          message: "Select the id of Role to remove !",
          choices: roleIdArray

        }
      ])
      .then(function (answer) {
        console.log(answer);
        connection.query("Delete from role Where ?",
          {
            id: answer.id
          },
          function (err) {
            if (err) throw err;
            console.log("Role was deleted successfully!");
            start();
          }
        );
      });
  });
};