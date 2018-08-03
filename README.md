# bamazon
upon loading application a request is sent via mysql npm package to mysql database to retrieve products table from bamazon database. Table is then displayed in the console.

inquirer npm package then prompts user to select the id of an item to purchase and a requested quantity.

if the requested quantity is greater than the available quantity a message is "insufficient quantity" is displayed in the console and the function ends.

if the quantity is available the requested quantity is subtracted from the available quantity and a message "prder booked" is diplayed in the console. The databse is then updated with the new stock quantity.

screencast: https://drive.google.com/file/d/1jjz0hLQrsKQlu0tYT-8cYGiqhId1YKBq/view?usp=sharing