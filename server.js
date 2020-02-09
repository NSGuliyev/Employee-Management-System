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
}




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
}

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
  })
};

function employeesByDepartment() {
  connection.query(`SELECT Department, employee.id, first_name, last_name, title 
  FROM ((employee 
    inner join role on employee.role_id = role.id) 
    inner join department on role.department_id = department.id);`, function (err, res) {
    if (err) throw err
    console.table(res);
    start();
  })
}

function viewAllRoles() {
  connection.query("select role.id, title, salary, Department from role inner join department on role.department_id = department.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      start();
    });
}


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
          console.log( "INSERT INTO employee SET ?",
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
}



// function removeEmployee() {
//   inquirer
//     .prompt([
//       {
//         choices: function showRole() {
//           connection.query("SELECT * FROM employee", function (err, results) {
//             if (err) throw err;
//             var choiceArray = [];
//             for (var i = 0; i < results.length; i++) {
//               choiceArray.push(results[i].id);
//             }
//             return choiceArray;
//           });
//           console.log(choiceArray);
//         },
//       },
//     ])
//     .then(function (answer) {
//       connection.query(
//         "Delete from people Where ?",
//         {
//           name: 'Nasimi'
//         },
//         function (err) {
//           if (err) throw err;
//           console.log("Employee was deleted successfully!");
//           start();
//         });
//     });
// };





//   // logs the actual query being run
//   console.table(query.sql);
//   connection.end();
// }

// // Functions example for CREATing, UPDATing, READing AND DELETing information

// connection.connect(function(err) {
//   if (err) throw err;
//   console.log("connected as id " + connection.threadId);
//   createNewPet ();
// });


// function updatePet () {
//     console.log("Updating a Pet for Nikotini...\n");
//     var query = connection.query (
//         "Update people SET ? Where ?",
//         [{pet_name:'Rasulito',pet_age: 6},
//          {name: 'Xaydar'}],

//         function (err,res) {
//             if (err) throw err;
//             console.log(res.affectedRows + ' Pet updated! \n');
//             deletePet();
//         }
//     );
//     console.log(query.sql);
// };  

// function deletePet () {
//     console.log("Deleting a Pet...\n");
//     var query = connection.query (
//         "Delete from people Where ?",
//         {name: 'Nasimi'},

//         function (err,res) {
//             if (err) throw err;
//             console.log(res.affectedRows + ' Pet deleted from people!\n');
//             readPet();
//         }
//     );
//     console.log(query.sql);
// };  

// function readPet () {
//     console.log('Selecting all pets from people table... \n');
//     connection.query('Select * from people', function (err, res) {
//         if (err) throw err;
//         console.table(res);
//         connection.end();
//     })
// 
