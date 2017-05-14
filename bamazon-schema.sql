
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (

	id INTEGER AUTO_INCREMENT NOT NULL,
	item_id INTEGER(6),
    product_name VARCHAR(128),
	department_name VARCHAR(128),
    product_sales DECIMAL(6,2),
    price DECIMAL(6,2),
    stock_quantity INTEGER(4),
	PRIMARY KEY(id)
);

CREATE TABLE departments (

	id INTEGER AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(128),
    over_head_costs INTEGER(4),
    total_sales DECIMAL(7,2),
    PRIMARY KEY(id)
);