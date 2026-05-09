const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error("MySQLへの接続に失敗しました: " + err.stack);
    return;
  }
  console.log("MySQLに接続されました（ID: " + connection.threadId + "）");
});

module.exports = connection;
