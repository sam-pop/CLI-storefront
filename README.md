# bamazon

bamazon is a command line [Node.js](https://nodejs.org/en/) / [mySQL](https://www.mysql.com/) "Amazon-like" storefront app.

This CLI app will take in orders from customers and deplete stock from the store's inventory, track product sales across the store's departments and provide a summary of the sales, over-head expenses and profits of each of the store's departments.

The app uses a node.js driver for mysql to establish a connection to the database and utilize SQL queries to perform CRUD operations in the database.
## How to use

**Prerequisites:**

* mySQL server
* Node.js and NPM _(package manager)_

Before running the app, you will have to use the `npm install` command from the command-line to install the required packages (using the _package.json_ file).

Make sure your MySQL server is up and running in the background -> from the mysql console (`mysql -uroot`), run the command `source schema.sql` to build our SQL schema.

---

Run the following commands:

`node bamazonCustomer.js` - for the Customer view.

`node bamazonManager.js` - for the Manager view.

`node bamazonSupervisor.js` - for the Supervisor view.

---

## What I used

This app was built using [Node.js](https://nodejs.org/en/), [mySQL](https://www.mysql.com/) (database) and the following NPM packages:
[inquirer](https://www.npmjs.com/package/inquirer), [mysql](https://www.npmjs.com/package/mysql), [cli-table](https://www.npmjs.com/package/cli-table),[colors](https://www.npmjs.com/package/colors).

## Examples

**Below are examples of the different store views:** _(click on the image for the full video)_

### Customer View:

[![bamazon_Customer.gif](https://s8.postimg.cc/c38ci1rlx/bamazon_Customer.gif)](https://youtu.be/cKullh4pPqQ)

### Manager View:

[![bamazon_Manager.gif](https://s8.postimg.cc/gcd2kb2lx/bamazon_Manager.gif)](https://youtu.be/o5I7rBO1v5k)

### Supervisor View:

[![bamazon_Supervisor.gif](https://s8.postimg.cc/cfzqocchh/bamazon_Supervisor.gif)](https://youtu.be/Q20lfLzt8ig)

## Note

The **Deprecation Warnings** in the examples are from the current mysql module (_v2.15.0_) deprecated methods in node _v10.5.0_.
