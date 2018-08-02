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

// call queryItems function
queryItems();

// user prompt
inquirer
  .prompt([
    {
      // product selection
      type: "input",
      name: "productId",
      message: "Enter ID of the product you would like to purchase"
    },
    {
      // quantity selection
      type: "input",
      name: "productQuantity",
      message: "Enter quantity of the product you would like to purchase"
    }
  ])
  .then(function(user) {
    console.log(results);
    var selectedProduct = user.productId;
    var selectedQuantity = parseFloat(user.productQuantity);
    var currentQuantity = [user.productId].stock_quantity; // .stock_quantity is undefined****************************************
    console.log("selected products " + currentQuantity);
    // user selects incorrect quantity
    if (selectedQuantity > currentQuantity) {
      console.log("Insufficient quantity!");
      connection.end();
      console.log("check " + selectedQuantity);
    } else if (
      // user selects correct quantity
      selectedQuantity <= currentQuantity
    ) {
      console.log("Order placed!");
      // reduce the available quantity by the selected amount
      var updatedQuantity = currentQuantity - selectedQuantity;
      console.log(updatedQuantity);
      // update table in database
      connection.query(
        "UPDATE products SET stock_quantity =  ?  WHERE item_id = ? ",
        [updatedQuantity, selectedProduct]
      );
    }
  })
  .catch(function(err) {
    console.log(err);
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
          results[i].stock_quantity
      );
    }
  });
}
