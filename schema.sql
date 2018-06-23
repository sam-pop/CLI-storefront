DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
item_id INT NOT NULL,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price FLOAT(7,2) NOT NULL,
stock_quantity INT default 0,
PRIMARY KEY (item_id)
);