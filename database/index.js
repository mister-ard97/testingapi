const mysql = require('mysql');

// Untuk di komputer
/*  const mysqldb_conn = mysql.createConnection({
    host: 'localhost',
     user: 'reza_admin',
     password: 'reza_admin10071997',
     database: 'testingapi',
     port: 3306,
     multipleStatements: true
 }) */ 

// Untuk di laptop
 const mysqldb_conn = mysql.createConnection({
     host: 'localhost',
     user: 'enverd',
     password: '123123123',
     database: 'testingapi',
     port: 3306,
     multipleStatements: true
    })
    
module.exports = mysqldb_conn;