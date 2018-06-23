const mysql = require('mysql');
const Table = require('cli-table');
const colors = require('colors');

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
    connection.end();
}