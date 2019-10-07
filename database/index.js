const mysql = require('mysql');

// Untuk di komputer
  const mysqldb_conn = mysql.createConnection({
    host: 'localhost',
     user: 'dino9611',
     password: 'tungkal01',
     database: 'testingapi',
     port: 3306,
     multipleStatements: true
 }) 

// Untuk di laptop
// const mysqldb_conn = mysql.createConnection({
//     host: 'localhost',
//     user: 'rezadb',
//     password: 'rezadb10071997',
//     database: 'testingapi',
//     port: 3306,
//     multipleStatements: true
// })

module.exports = mysqldb_conn;