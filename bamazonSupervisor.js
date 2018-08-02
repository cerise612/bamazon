var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "root",
    database: "bamazon"
  });
  connection.connect();

// supervisor prompt
  inquirer
  .prompt([
    {
      type: "list",
      name: "doingWhat",
      message: "What Action Would You Like To Perform?",
      choices: [
        "View Product Sales by Department",
        "Create New Department"
      ]
    }
// determine user selection
  ]).then(function(res) {
    var user = res;
    for (var i = 0; i < user.length; i++) {
      console.log(user);
    }
    switch (user) {
        // if View Product Sales by Department is selected complete run queryDepartments()
      case 0:
        queryDepartments();
        break;
        // if Create New Department is selected prompt user for more information
        default:
        inquirer
          .prompt([
            // new department information
            {
              message: "What is the departments name?",
              name: "name",
              type: "input"
            },
            {
              message: "What are the over head costs for this department?",
              name: "costs",
              type: "input"
            },
            // intert new department info into department table
          ]).then(function(iR) {
            var query = connection.query("INSERT INTO departments SET ?", {
              department_name: iR.name,
              over_head_costs: iR.costs,
            });
          });
    }
  });

// show departments
  function queryDepartments() {
    query = connection.query("SELECT * FROM departments", function(err, res) {
      results = res;
      for (var i = 0; i < results.length; i++) {
        // show results in console table
        console.table([
            {department_id: results[i].department_id,
            
            department_name: results[i].department_name,
            
            over_head_costs: results[i].over_head_costs,
           
            product_sales: results[i].product_sales,
            
            total_sales: results[i].total_sales}
        ]);
      }
    });
  }