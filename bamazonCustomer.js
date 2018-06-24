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
    console.log(colors.bgYellow.black('\nWelcome to bamazon! Join the ' + connection.threadId + ' shoppers that already ordered from us today.\n'));
    init();
});

//init view
function init() {
    printAllItems();
}

//prints all the items in the DB with their info (table)
function printAllItems() {
    let query = connection.query('SELECT item_id, product_name, price FROM products', function (err, res) {
        if (err) throw err;
        let tHeader = [colors.bgRed('Item ID'), colors.bgRed('Item Name'), colors.bgRed('Price')];
        table.push(tHeader);
        for (let item of res) {
            let row = [colors.gray(item.item_id), colors.white(item.product_name), colors.yellow('$' + item.price)];
            table.push(row);
        }
        console.log(table.toString());
        promptUser();
    });
}

//prompts the user for the item id and quantity or the product he's interested in
function promptUser() {
    inquirer.prompt([{
            type: 'input',
            name: 'question1',
            message: 'Please enter the' + colors.yellow.bold(' Item ID') + ' of the product you would like to buy:',
        },
        {
            type: 'input',
            name: 'question2',
            message: 'How many units of the product would you like to buy?',
        }
        //promise: mysql queries (SELECT & UPDATE)
    ]).then(function (answers) {
        //SELECT query
        connection.query('SELECT stock_quantity, price FROM products WHERE item_id=?', answers.question1, function (err, res) {
            if (err) throw err;
            //error msg if id doesn't exist
            if (res.length == 0) {
                console.log(colors.bgRed("Item ID doesn't exists! Please try again..."));
                promptUser();
            } else
                //UPDATE query
                if (res[0].stock_quantity >= answers.question2) {
                    let total = parseFloat(res[0].price * answers.question2).toFixed(2) * TAX;
                    connection.query('UPDATE products SET stock_quantity = stock_quantity-? ,product_sales = product_sales+? WHERE item_id=?', [answers.question2, total, answers.question1], function (err2, res2) {
                        if (err2) throw err2;
                        console.log(colors.bold('\nOrder confirmed! '), 'Your total is: ' + colors.bgGreen.bold('$' + total + '\n'));
                        inquirer.prompt([{
                            type: 'confirm',
                            name: 'question3',
                            message: 'Would you like to purchase anything else?'
                        }]).then(function (answers) {
                            if (answers.question3)
                                promptUser();
                            if (!answers.question3) {
                                console.log(colors.bgYellow.black('\nThank you for shopping with us, we hope to see you back soon!'));
                                connection.end();
                            }
                        });
                    });
                } else {
                    //error msg if requested quantity is bigger than stock quantity
                    console.log(colors.bgRed("Insufficient quantity! Please try again..."));
                    promptUser();
                }
        });
    });
}