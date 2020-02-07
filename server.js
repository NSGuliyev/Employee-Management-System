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

function viewAllRoles() {
  connection.query("select title, salary, Department from role inner join department on role.department_id = department.id;", function(err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}

// function postAuction() {
//   // prompt for info about the item being put up for auction
//   inquirer
//     .prompt([
//       {
//         name: "item",
//         type: "input",
//         message: "What is the item you would like to submit?"
//       },
//       {
//         name: "category",
//         type: "input",
//         message: "What category would you like to place your auction in?"
//       },
//       {
//         name: "startingBid",
//         type: "input",
//         message: "What would you like your starting bid to be?",
//         validate: function (value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       }
//     ])
//     .then(function (answer) {
//       // when finished prompting, insert a new item into the db with that info
//       connection.query(
//         "INSERT INTO auctions SET ?",
//         {
//           item_name: answer.item,
//           category: answer.category,
//           starting_bid: answer.startingBid || 0,
//           highest_bid: answer.startingBid || 0
//         },
//         function (err) {
//           if (err) throw err;
//           console.log("Your auction was created successfully!");
//           // re-prompt the user for if they want to bid or post
//           start();
//         }
//       );
//     });
// }




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