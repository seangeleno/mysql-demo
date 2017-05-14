const sql = require('mysql');
const columnify = require('columnify');
const inquire = require('inquirer');

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

	db.query("SELECT item_id, product_name, department_name, price FROM products WHERE stock_quantity > 0",  function(err, data, fields) {

		if(err) console.log(err);
		console.log('\n\n');
		console.log(columnify(data));
		console.log('\n');

		inquire.prompt([{

				type: 'input',
				name: 'id',
				message: 'ID of item to buy',
				validate: function(input) {

					if(input >= 1 && input <= 14) return true;
						else return('Not a valid ID');
					}
			},
			{
				type: 'input',
				name: 'num',
				message: 'Number to purchase',
				default: 1,
				validate: function(input) {

					if(input >= 1 && input <= 99) return true;
						else return('Not a valid number. Max number 99.');
				} 
			}


		]).then(function(answers) {

			console.log(answers);

		})

	});



}

