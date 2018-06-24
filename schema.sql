DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(255) NOT NULL,
    price FLOAT(9 , 2 ) NOT NULL,
    stock_quantity INT DEFAULT 0,
    product_sales FLOAT(9 , 2 ) DEFAULT 0,
    PRIMARY KEY (item_id)
);

CREATE TABLE departments (
    department_id INT NOT NULL,
    department_name VARCHAR(255) NOT NULL,
    over_head_costs FLOAT(9 , 2 ) NOT NULL,
    PRIMARY KEY (department_id)
);


INSERT INTO products 
VALUES (654968, 'IMI Desert Eagle', 'Hunting', 1725.95, 100, 0),
(987723, 'Galil ACE', 'Hunting', 3012.99, 60, 0), 
(368465, 'Tavor', 'Hunting', 6950.00, 20, 0), 
(993231, 'Negev', 'Hunting', 7398.56, 45, 0),
(852555, 'Homeland','Movies & TV', 29.99, 209, 0), 
(15561, 'Bamba', 'Grocery & Food', 1.67, 10058, 0), 
(15563, 'Falafel', 'Grocery & Food', 12.99, 636, 0), 
(978321, 'Merkava Mark IV', 'Vehicles', 4500000.99, 3, 0),
(258985, 'Sapiens: a brief history of humankind', 'Books', 57.58, 978, 0),
(755698, 'SanDisk Disk-on-Key', 'Electronics', 38.83, 565, 0);

INSERT INTO departments 
VALUES (1,'Hunting', 108421.12),
(2,'Movies & TV', 142165.29),
(3,'Grocery & Food', 86422.66),
(4,'Vehicles', 393257.58),
(5, 'Books', 98721.69),
(6, 'Electronics', 658796.47);
