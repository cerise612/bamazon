var mysql = require("mysql");
var inquirer = require("inquirer");

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
// manager prompt
inquirer
  .prompt([
    {
      type: "list",
      name: "doingWhat",
      message: "What Action Would You Like To Perform?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ]
    }
  ])

  .then(function(res) {
    var user = res;
    for (var i = 0; i < user.length; i++) {
      console.log(user);
    }
    switch (user) {
      // if View Products for Sale is selected complete run queryItems()
      case 0:
        queryItems();
        break;
      // if View Low Inventory is selected complete run lowQuantity()
      case 1:
        lowQuantity();
        break;
      // if Add to Inventory is selected complete run queryItems() then prompt user for more info
      case 2:
        queryItems();
        inquirer
          .prompt([
            {
              // item to be updated
              type: "input",
              name: "productId",
              message: "Enter ID of the product you would like to update"
            },
            {
              type: "input",
              name: "productQuantity",
              message: "Enter new quantity of the product"
            }
          ])
          // update database with new item information
          .then(function(uR) {
            connection.query(
              "UPDATE products SET stock_quantity =  ?  WHERE item_id = ? ",
              {
                item_id: uR.productId,
                stock_quantity: uR.quantity
              }
            );
          });
        break;
        // if Add New Product is selected  prompt user for more info
      default:
        inquirer
          .prompt([
            {
              // item to be added
              message: "What is the items name?",
              name: "itemName",
              type: "input"
            },
            {
              message: "What is the department for this item?",
              name: "depertment",
              type: "input"
            },
            {
              message: "What is the price?",
              name: "price",
              type: "input"
            },
            {
              message: "What is the available quantity?",
              name: "quantity",
              type: "input"
            }
          ])
          // update database with new item information
          .then(function(iR) {
            var query = connection.query("INSERT INTO products SET ?", {
              product_name: iR.name,
              department_name: iR.department,
              price: parseFloat(iR.price),
              stock_quantity: iR.quantity
            });
          });
    }
  });

// query all to display database of items
function queryItems() {
  query = connection.query("SELECT * FROM products", function(err, res) {
    results = res;
    for (var i = 0; i < results.length; i++) {
      // show results
      console.log(
        results[i].item_id +
          " | " +
          results[i].product_name +
          " | " +
          results[i].department_name +
          " | " +
          results[i].price +
          " | " +
          results[i].stock_quantity,
          " | " +
          results[i].product_sales
      );
    }
  });
}

// query to display database of low quantity items
function lowQuantity() {
    query = connection.query("SELECT * FROM products", function(err, res) {
      quantity = res;
      for (var i = 0; i < quantity.length; i++) {
        if (quantity[i].stock_quantity < 5){
            // show results
            console.log(
            quantity[i].item_id +
            " | " +
            quantity[i].product_name +
            " | " +
            quantity[i].department_name +
            " | " +
            quantity[i].price +
            " | " +
            quantity[i].stock_quantity
            );
        }
        else if (quantity[i].stock_quantity >= 5) {
            console.log("No product that meets this criteria")
        }
      }
    });
  }
  