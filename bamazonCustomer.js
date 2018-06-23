const mysql = require('mysql');
const Table = require('cli-table');
const colors = require('colors');

const DB = 'bamazon';

//config mysql db connection
let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: DB
});

connection.connect(function (err) {
    if (err) throw err;
    console.log('Connection established! id: ' + connection.threadId + '\n');
    // connection.end();
});