const mysql = require('mysql');
const Table = require('cli-table');
const colors = require('colors');
const inquirer = require('inquirer');

const DB = 'bamazon';
const table = new Table({
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

//config mysql db connection
let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: DB
});

//establish a connection --> print all the items
connection.connect(function (err) {
    if (err) throw err;
    console.log('Connection established! id: ' + connection.threadId + '\n');
    printAllItems();
    promptUser();
    //TODO: add user prompt with two messages: (save into vars?)
    //1) ask them the ID of the product they would like to buy.
    //2) ask how many units of the product they would like to buy.
});


//prints all the items in the DB with their info (table)
function printAllItems() {
    let query = connection.query('SELECT item_id, product_name, price FROM products', function (err, res) {
        if (err) throw err;
        table.push([colors.bgRed('Item ID'), colors.bgRed('Item Name'), colors.bgRed('Price')]);
        for (let item of res) {
            let items = [];
            items.push(colors.gray(item.item_id));
            items.push(colors.white(item.product_name));
            items.push(colors.yellow(item.price));
            table.push(items);
        }
        console.log(table.toString());
    });
    // connection.end();

}

function promptUser() {
    inquirer.prompt([{
            type: 'input',
            name: 'question1',
            message: 'Please enter the' + colors.yellow(' Item ID') + ' of the product they would like to buy:',
        },
        {
            type: 'input',
            name: 'question2',
            message: 'How many units of the product would you like to buy?',
        },
    ]).then(function (answers) {
        let query = connection.query('SELECT stock_quantity FROM products WHERE item_id=?', answers.question1, function (err, res) {
            if (err) throw err;
            if (res.length == 0) {
                console.log(colors.bgRed("Item ID doesn't exists! Please try again..."));
                promptUser();
            }
            if (res[0].stock_quantity >= answers.question2) {
                let query2 = connection.query('UPDATE products SET stock_quantity = stock_quantity-? WHERE item_id=?', [answers.question2, answers.question1], function (err, res) {
                    if (err) throw err;
                });
            } else {
                console.log(colors.bgRed("Insufficient quantity! Please try again..."));
                promptUser();
            }
        });
    });
}