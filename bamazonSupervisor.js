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
    console.log(colors.bgYellow.black('\nWelcome to bamazon Supervisor-View! Your session id: #' + connection.threadId + '\n'));
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
        choices: ['View Product Sales by Department', 'Create New Department', colors.bgRed.white('EXIT')]
    }]).then(function (answer) {
        switch (answer.userPick) {
            case 'View Product Sales by Department':
                console.log('\n');
                viewProductSalesByDept();
                break;
            case 'Create New Department':
                inquirer.prompt([{
                        type: 'input',
                        name: 'id',
                        message: 'Please enter the new department ' + colors.yellow.bold('ID') + ':'
                    }, {
                        type: 'input',
                        name: 'name',
                        message: 'Please enter the new department ' + colors.yellow.bold('name') + ':'
                    },
                    {
                        type: 'input',
                        name: 'ohc',
                        message: 'Please enter the new department ' + colors.yellow.bold('over head costs') + ':'
                    }
                ]).then(function (answers) {
                    createNewDepartment(answers.id, answers.name, answers.ohc);
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

function viewProductSalesByDept() {
    let q = connection.query('SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales FROM departments INNER JOIN products ON departments.department_name = products.department_name GROUP BY department_name;', function (err, res) {
        if (err) throw err;
        let tHeader = [colors.bgRed('Department ID'), colors.bgRed('Department Name'), colors.bgRed('Over Head Costs'), colors.bgRed('Product Sales'), colors.bgRed('Total Profit')];
        table.push(tHeader);
        console.log(q.sql);
        console.log(res);
        // for (let i of res) {
        //     let row = [colors.gray(item.item_id), colors.white(item.product_name), colors.white('$' + item.price), colors.yellow(item.stock_quantity)];
        //     table.push(row);
        // }
        // console.log(table.toString());
        init();
    });
}

//add a completely new department to the store.
function createNewDepartment(id, name, ohc) {
    let departmentToAdd = {
        department_id: id,
        department_name: name,
        over_head_costs: ohc
    };
    connection.query('INSERT INTO departments SET ?', departmentToAdd, function (err, res) {
        if (err) {
            console.log(colors.bgRed("\nPlease try again...\n"));
        } else {
            let tHeader = [colors.bgRed('Department ID'), colors.bgRed('Department Name'), colors.bgRed('Over Head Costs')];
            table.push(tHeader);
            let row = [colors.gray(id), colors.white(name), colors.white('$' + ohc)];
            table.push(row);
            console.log(colors.bgGreen.bold('\nThe following department has been added:'));
            console.log(table.toString());
        }
        init();
    });
}