// Dependencies
const mysql = require('mysql');
const Table = require('cli-table');
const colors = require('colors');
const inquirer = require('inquirer');

// Variables
const DB = 'bamazon';
let table;

//config mysql db connection
let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: DB
});

//establish a connection and initialize
connection.connect(function (err) {
    if (err) throw err;
    console.log(colors.bgYellow.black('\nWelcome to bamazon Manager-View! Your session id: #' + connection.threadId + '\n'));
    init();
});

//init new table view and the user prompt (inquirer)
function init() {
    //config a new custom table to be used
    table = new Table({
        chars: {
            'top': '═',
            'top-mid': '╤',
            'top-left': '╔',
            'top-right': '╗',
            'bottom': '═',
            'bottom-mid': '╧',
            'bottom-left': '╚',
            'bottom-right': '╝',
            'left': '║',
            'left-mid': '╟',
            'mid': '─',
            'mid-mid': '┼',
            'right': '║',
            'right-mid': '╢',
            'middle': '│'
        }
    });

    inquirer.prompt([{
        type: 'list',
        name: 'userPick',
        message: 'Please select an option:',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', colors.bgRed.white('EXIT')]
    }]).then(function (answer) {
        switch (answer.userPick) {
            case 'View Products for Sale':
                console.log('\n');
                productsForSale();
                break;
            case 'View Low Inventory':
                console.log('\n');
                viewLowInventory();
                break;
            case 'Add to Inventory':
                inquirer.prompt([{
                    type: 'input',
                    name: 'item',
                    message: 'Please enter the ' + colors.yellow.bold('item ID') + ':'
                }, {
                    type: 'input',
                    name: 'amount',
                    message: 'Please enter the ' + colors.underline('amount') + ' of units you want to add:'

                }]).then(function (answers) {
                    addToInventory(answers.item, answers.amount);
                });
                break;
            case 'Add New Product':
                inquirer.prompt([{
                        type: 'input',
                        name: 'id',
                        message: 'Please enter the new item ' + colors.yellow.bold('ID') + ':'
                    }, {
                        type: 'input',
                        name: 'name',
                        message: 'Please enter the new item ' + colors.yellow.bold('name') + ':'
                    },
                    {
                        type: 'input',
                        name: 'dep',
                        message: 'Please enter the new item ' + colors.yellow.bold('department') + ':'
                    }, {
                        type: 'input',
                        name: 'p',
                        message: 'Please enter the new item ' + colors.yellow.bold('price') + ':'
                    }, {
                        type: 'input',
                        name: 'amount',
                        message: 'Please enter the new item ' + colors.yellow.bold('stock quantity') + ':'
                    }
                ]).then(function (answers) {
                    addNewProduct(answers.id, answers.name, answers.dep, answers.p, answers.amount);
                });
                break;
            case colors.bgRed.white('EXIT'):
                connection.end();
                break;
            default:
                break;
        }
    });
}

//list every available item: the item ID, name, price, and quantity.
function productsForSale() {
    connection.query('SELECT item_id, product_name, price, stock_quantity FROM products', function (err, res) {
        if (err) throw err;
        let tHeader = [colors.bgRed('Product ID'), colors.bgRed('Product Name'), colors.bgRed('Product Price'), colors.bgRed('Stock Quantity')];
        table.push(tHeader);
        for (let item of res) {
            let row = [colors.gray(item.item_id), colors.white(item.product_name), colors.white('$' + item.price), colors.yellow(item.stock_quantity)];
            table.push(row);
        }
        console.log(table.toString());
        init();
    });
}

//list all items with an inventory count lower than five.
function viewLowInventory() {
    connection.query('SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity<5', function (err, res) {
        if (err) throw err;
        let tHeader = [colors.bgRed('Product ID'), colors.bgRed('Product Name'), colors.bgRed('Product Price'), colors.bgRed('Stock Quantity')];
        table.push(tHeader);
        for (let item of res) {
            let row = [colors.gray(item.item_id), colors.white(item.product_name), colors.white('$' + item.price), colors.yellow(item.stock_quantity)];
            table.push(row);
        }
        console.log(table.toString());
        init();
    });
}

//adds the passed amount to the item with the corresponding id
function addToInventory(item, amount) {
    if (amount > 0) {
        connection.query('UPDATE products SET stock_quantity = stock_quantity+? WHERE item_id = ?', [amount, item], function (err, res) {
            if (err) throw err;
            if (res.changedRows > 0) {
                console.log(colors.bgGreen.bold("\nStock Quantity UPDATED!\n"));
            } else
                console.log(colors.bgRed("\nItem not found! try again...\n"));
            init();
        });
    } else {
        console.log(colors.bgRed("\nWrong Amount! try again...\n"));
        init();
    }
}

//add a completely new product to the store.
function addNewProduct(id, name, dep, p, amount) {
    let itemToAdd = {
        item_id: id,
        product_name: name,
        department_name: dep,
        price: p,
        stock_quantity: amount
    };
    connection.query('INSERT INTO products SET ?', itemToAdd, function (err, res) {
        if (err) {
            console.log(colors.bgRed("\nPlease try again...\n"));
        } else {
            let tHeader = [colors.bgRed('Product ID'), colors.bgRed('Product Name'), colors.bgRed('Department'), colors.bgRed('Product Price'), colors.bgRed('Stock Quantity')];
            table.push(tHeader);
            let row = [colors.gray(id), colors.white(name), colors.white(dep), colors.white('$' + p), colors.yellow(amount)];
            table.push(row);
            console.log(colors.bgGreen.bold('\nThe following item has been added:'));
            console.log(table.toString());
        }
        init();
    });
}