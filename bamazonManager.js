const sql = require('mysql');
const columnify = require('columnify');
const inquire = require('inquirer');

var choices = ['View Products for Sale','View Low Inventory','Add to Inventory','Add New Product'];

var green = '\x1b[32m',
	red = '\x1b[31m',
	blue = '\x1b[34m',
	yellow = "\x1b[33m",
	underscore = "\x1b[4m",
	reset = "\x1b[0m"


var db = sql.createConnection({

	host: '127.0.0.1',
	port: 3306,

	user: 'root',
	password: 'violet',

	database: 'bamazon'
});

db.connect(function(err) {

	if(err) {
	
		console.log('Error at sql connection:', err);
		process.exit();	
	
	}
		else {
		
			console.log('connected to SQL as Id:', sql.threadId);
			process.stdout.write('\033c');
			managerView();
		}
})

var managerView = function() {

    inquire.prompt([{

				type: 'list',
				name: 'response',
				message: 'Menu options:',
				choices: choices
			}]).then(function(answers) {

				if(answers.response === 'View Products for Sale') {

					db.query("SELECT id, item_id, product_name, department_name, product_sales, stock_quantity, price FROM products",  function(err, data, fields) {

						data.forEach(function(element) {

							element.product_name = yellow + element.product_name + reset;
							element.stock_quantity = red + element.stock_quantity + reset;
							element.price = green + '$' + element.price + reset;
						});

						console.log('\n' + columnify(data) + '\n');
						managerView();

					});
				};

				if(answers.response === 'View Low Inventory') {

					db.query("SELECT id, item_id, product_name, department_name, product_sales, stock_quantity, price FROM products WHERE stock_quantity < 5",  function(err, data, fields) {

						data.forEach(function(element) {

							element.product_name = yellow + element.product_name + reset;
							element.stock_quantity = red + element.stock_quantity + reset;
							element.price = green + '$' + element.price + reset;
						});

						console.log('\n' + columnify(data) + '\n');
						managerView();

					});
				};

				if(answers.response === 'Add to Inventory') {

					db.query("SELECT item_id, product_name, stock_quantity FROM products", function(err, data, fields) {

						data.forEach(function(element) {

							element.product_name = yellow + element.product_name + reset;
							element.stock_quantity = red + element.stock_quantity + reset;
						});

						console.log('\n' + columnify(data) + '\n');
					
					inquire.prompt([{

						type: 'input',
						name: 'id',
						message: 'ID of item to increase: ',
						validate: function(input) {
							if(input >= 1 && input <= 99) return true;
								else 
								return('Not a valid ID. Try again sucka.');
						}
					},
					{
						type: 'input',
						name: 'num',
						message: 'Change stock qunatity to: ',
						validate: function(input) {
							if(input >= 1 && input <= 99) return true;
								else 
								return('Not a valid amount. 99 is the max!');
						}
					}
					]).then(function(answers) {

							db.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [answers.num, answers.id], function(err, res, fields) {

								if(err) { 
									console.log(err); 
								}
									
									else {
										console.log('updated');

										managerView();
									}
							});
						});

					});
				};
	});
}

