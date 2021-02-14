const mysql = require('mysql');
const config = require('./osuConfig');

let pool = mysql.createPool({
    host     : config.HOST,
    user     : config.USER,
    password : config.AUTH,
    database : config.DATABASE
});

module.exports = pool;