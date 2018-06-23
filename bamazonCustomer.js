const mysql = require('mysql');
const Table = require('cli-table');
const colors = require('colors');
const inquirer = require('inquirer');


const DB = 'bamazon';
const TAX = 1.0; //to add TAX to the total price calc
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
});


//prints all the items in the DB with their info (table)
function printAllItems() {
    let query = connection.query('SELECT item_id, product_name, price FROM products', function (err, res) {
        if (err) throw err;
        table.push([colors.bgRed('Item ID'), colors.bgRed('Item Name'), colors.bgRed('Price')]);
        for (let item of res) {
            let row = [];
            row.push(colors.gray(item.item_id));
            row.push(colors.white(item.product_name));
            row.push(colors.yellow(item.price));
            table.push(row);
        }
        console.log(table.toString());
    });
}

//prompts the user for the item id and quantity or the product he's interested in
function promptUser() {
    inquirer.prompt([{
            type: 'input',
            name: 'question1',
            message: 'Please enter the' + colors.yellow(' Item ID') + ' of the product you would like to buy:',
        },
        {
            type: 'input',
            name: 'question2',
            message: 'How many units of the product would you like to buy?',
        },
        //promise: mysql queries (SELECT & UPDATE)
    ]).then(function (answers) {
        //SELECT query
        let query = connection.query('SELECT stock_quantity, price FROM products WHERE item_id=?', answers.question1, function (err, res) {
            if (err) throw err;
            //error msg if id doesn't exist
            if (res.length == 0) {
                console.log(colors.bgRed("Item ID doesn't exists! Please try again..."));
                promptUser();
            } else
                //UPDATE query
                if (res[0].stock_quantity >= answers.question2) {
                    let query2 = connection.query('UPDATE products SET stock_quantity = stock_quantity-? WHERE item_id=?', [answers.question2, answers.question1], function (err2, res2) {
                        if (err2) throw err2;
                        console.log(colors.inverse('Order confirmed!'));
                        console.log(colors.bgBlue('Total order: $' + parseFloat(res[0].price * answers.question2).toFixed(2) * TAX));
                        connection.end();
                    });
                } else {
                    //error msg if requested quantity is bigger than stock quantity
                    console.log(colors.bgRed("Insufficient quantity! Please try again..."));
                    promptUser();
                }
        });
    });
}
