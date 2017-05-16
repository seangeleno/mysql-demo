const sql = require('mysql');
const columnify = require('columnify');
const inquire = require('inquirer');

var choices = [];

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
			displayForSale();
		}
})

var displayForSale = function() {

	process.stdout.write('\033c');

	db.query("SELECT item_id, product_name, department_name, stock_quantity, price FROM products WHERE stock_quantity > 0",  function(err, data, fields) {

		if(err) console.log(err);

		data.forEach(function(element) {

			element.product_name = yellow + element.product_name + reset;
			element.stock_quantity = red + element.stock_quantity + reset;
			element.price = green + '$' + element.price + reset;

		});

		console.log(columnify(data));
		console.log('\n');

		inquire.prompt([{

				type: 'input',
				name: 'id',
				message: 'ID of item to buy',
				validate: function(input) {

					if(input >= 1 && input <= 99) return true;
						else 
							return('Not a valid ID. Try again sucka.');
					}
			},
			{
				type: 'input',
				name: 'toPurchase',
				message: 'Number to purchase',
				default: 1,
				validate: function(input) {

					if(input >= 1 && input <= 99) return true;

						else return('Come on man, thats not a valid number. Max number is 99.');
				} 
			}

		]).then(function(answers) {

			db.query("SELECT stock_quantity, price, product_name, department_name FROM products WHERE item_id = ?", [answers.id], function(err, data, fields) {

				var available = data[0].stock_quantity;
				var toPurchase = answers.toPurchase;
				var price = data[0].price;
				var title = data[0].product_name;
				var department_name = data[0].department_name;

				if(toPurchase <= available) {

					db.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [available-toPurchase, answers.id], function(err, res, fields) {

						if(!err) {

							var total = toPurchase * price;
							console.log('\n' + toPurchase + ' copy(ies) of ' + underscore + yellow + title + reset + ' purchased. Your total is ' + green + '$' + total + reset + '\n');
					
							db.query("SELECT product_sales FROM departments WHERE department_name = ?", [department_name], function(err, data) {

								if(err) console.log(err);

								var newTotal = data[0].product_sales + total;

								db.query("UPDATE departments SET product_sales = ? WHERE department_name = ?", [newTotal, department_name], function(err) {

									if(err) console.log(err);

								})

							})


							// if(department_name === 'Books') var d_id = 1;
							// if(department_name === 'Music') var d_id = 2;

							// var record = {

							// 	department_id: d_id,
							// 	department_name: department_name,
							// 	product_sales: total

							// }

							// db.query("UPDATE departments SET ?", [record], function(err, data, fields) {
							
							// 	if(err) console.log(err);
							
							// })


							inquire.prompt([{
							
								type: 'list',
								name: 'again',
								message: 'Make another purchase?',
								choices: ['Sure', 'Nope']
							
							}]).then(function(answer) {

								if(answer.again === 'Sure') displayForSale();

									else {

										console.log('\nNice doing business with you! Goodbye.\n');
										
										process.exit();

									}
							})
						}
					})
				} else {

					displayForSale();

					console.log(red + '\nNot enough in stock! Try again punk!\n' + reset);

				}

			})



		})

	});

}







