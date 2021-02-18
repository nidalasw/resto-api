const mysql = require("mysql");

var mysqlConnection = mysql.createConnection({
    host:"localhost",
    user:"admin",
    password:"password",
    database:"dbresto",
    multipleStatements:true
});

mysqlConnection.connect((err)=>{
    if(!err)
    {
        console.log("Connected to database!");
    }
    else
    {
        console.log("Connection FAILED :(" + err.message);
    }
});

module.exports = mysqlConnection;

