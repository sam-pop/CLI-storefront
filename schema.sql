DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
item_id INT NOT NULL,
product_name VARCHAR(255) NOT NULL,
department_name VARCHAR(255) NOT NULL,
price FLOAT(9,2) NOT NULL,
stock_quantity INT default 0,
PRIMARY KEY (item_id)
);

INSERT INTO products (item_id,product_name,department_name,price,stock_quantity) 
VALUES (654968, 'IMI Desert Eagle', 'Hunting', 1725.95, 100),
(987723, 'Galil ACE', 'Hunting', 3012.99, 60), 
(368465, 'Tavor', 'Hunting', 6950.00, 20), 
(993231, 'Negev', 'Hunting', 7398.56, 45),
(852555, 'Homeland','Movies & TV', 29.99, 209), 
(15561, 'Bamba', 'Grocery & Food', 1.67, 10058), 
(15563, 'Falafel', 'Grocery & Food', 12.99, 636), 
(978321, 'Merkava Mark IV', 'Vehicles', 4500000.99, 3),
(258985,'Sapiens: a brief history of humankind','Books',57.58,978),
(755698, 'SanDisk Disk-on-Key', 'Electronics', 38.83, 565);