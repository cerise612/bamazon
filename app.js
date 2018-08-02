var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");

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
    // console.log(results);
    // selected item id from user query
    var selectedProduct = user.productId - 1;
    // item quanity from user query
    var selectedQuantity = parseFloat(user.productQuantity);
    // available quantity based upon selected item id
    var currentQuantity = results[selectedProduct].stock_quantity;
    // current sales total based upon selected item id
    var currentSales = results[selectedProduct].product_sales;
    // total price for transaction based upon selected item id
    var selectedPrice = selectedQuantity * results[selectedProduct].price;

    console.log("check " + selectedPrice);

    // user selects in excess of available quantity
    if (selectedQuantity > currentQuantity) {
      console.log("Insufficient quantity!");
      connection.end();
    } else if ( selectedQuantity <= currentQuantity) { // user selects available quantity
      console.log("Order placed!");
      // reduce the available quantity by the selected amount
      var updatedQuantity = parseInt(currentQuantity) - parseInt(selectedQuantity);
      console.log("working " + updatedQuantity);
      // add total transaction price to running total for product type
      var updatedSales = parseInt(currentSales) + parseInt(selectedPrice);
      console.log("update " + updatedSales);
      var query = connection.query(
          "UPDATE products SET ?, ? WHERE ? ",
          [
            {
              stock_quantity: updatedQuantity
            },{
              product_sales: updatedSales
            },{
              item_id: user.productId
            }
          ],function(err, data){
              if (err) {
                return console.log("error ocurred", err);
              }
            console.log(data);
            console.log(query.sql);
          }
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
