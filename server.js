const mysql = require("mysql");
const express = require("express");
const bodyParser =require ("body-parser");

var app = express();

app.use(bodyParser.json());

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
        console.log("Connected to data base !!");
    }
    else
    {
        console.log("Connection FAILED :(" + err.message);
    }
});

app.listen(3002);