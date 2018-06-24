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
    console.log(colors.bgYellow.black('\nWelcome to bamazon Manager-View! Your session id: #' + connection.threadId + '\n'));
    productsForSale();
    connection.end();
});

function productsForSale() {
    let query = connection.query('SELECT item_id, product_name, price, stock_quantity FROM products', function (err, res) {
        if (err) throw err;
        let tHeader = [colors.bgRed('Product ID'), colors.bgRed('Product Name'), colors.bgRed('Product Price'), colors.bgRed('Stock Quantity')];
        table.push(tHeader);
        for (let item of res) {
            let row = [colors.gray(item.item_id), colors.white(item.product_name), colors.white('$' + item.price), colors.yellow(item.stock_quantity)];
            table.push(row);
        }
        console.log(table.toString());
        // promptUser();
    });
}