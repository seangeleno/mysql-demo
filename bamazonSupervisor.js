const sql = require('mysql');
const columnify = require('columnify');
const inquire = require('inquirer');

var choices = ['View Products for Sale','View Low Inventory','Add to Inventory','Add New Product'];

var green = '\x1b[32m',
	red = '\x1b[31m',
	blue = '\x1b[34m',
	yellow = "\x1b[33m",
	underscore = "\x1b[4m",
	reset = "\x1b[0m";


var db = sql.createConnection({

	host: '127.0.0.1',
	port: 3306,

	user: 'root',
    password: process.env.MYSQL,

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
			superView();
		}
});

var superView = function() {

	db.query("SELECT id, department_id, department_name, over_head_costs, product_sales FROM departments", function(err, data) {

		data[0].profit = (data[0].product_sales - data[0].over_head_costs).toFixed(2);
		data[1].profit = (data[1].product_sales - data[1].over_head_costs).toFixed(2);

		data.forEach(function(element) {

			//noinspection JSUndefinedPropertyAssignment
            element.department_name = blue + element.department_name + reset;
			//noinspection JSUndefinedPropertyAssignment
            element.over_head_costs = yellow + element.over_head_costs + reset;
			//noinspection JSUndefinedPropertyAssignment
            element.product_sales = yellow + '$' + element.product_sales + reset;

			if(element.profit > 0) element.profit = green + element.profit + reset;

			if(element.profit < 0) element.profit = red + element.profit + reset;

		});

		console.log('\n' + columnify(data) + '\n');

		process.exit();

	})

};