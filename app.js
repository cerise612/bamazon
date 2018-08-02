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
    // selected item id from user query
    var selectedProduct = user.productId;
    // item quanity from user query
    var selectedQuantity = parseFloat(user.productQuantity);
    // available quantity based upon selected item id
    var currentQuantity = [user.productId].stock_quantity; // .stock_quantity is undefined****************************************
    // current sales total based upon selected item id
    var currentSales = user.productId.product_sales;
    // total price for transaction based upon selected item id
    var selectedPrice = selectedQuantity * user.productId.price;

    console.log("selected products " + currentQuantity);

    // user selects in excess of available quantity
    if (selectedQuantity > currentQuantity) {
      console.log("Insufficient quantity!");
      connection.end();
      console.log("check " + selectedQuantity);
    } else if (
      // user selects available quantity
      selectedQuantity <= currentQuantity
    ) {
      console.log("Order placed!");
      // reduce the available quantity by the selected amount
      var updatedQuantity = currentQuantity - selectedQuantity;
      console.log(updatedQuantity);
      // add total transaction price to running total for product type
      var updatedSales = currentSales + selectedPrice;
      // update table in database
      connection.query(
        "UPDATE products SET stock_quantity =  ?  and SET product_sales = ? WHERE item_id = ? ",
        [updatedQuantity, updatedSales, selectedProduct]
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
