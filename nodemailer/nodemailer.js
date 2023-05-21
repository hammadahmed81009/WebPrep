var express = require("express");

var app = express();

var mysql = require("mysql");

var bodyParser = require("body-parser");
var ee;
var currentId;
var currentCode;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "demo",
});

conn.connect(function (err) {
    if (err) throw err;

    console.log("Connection Sucessful");
});

app.get("/", function (req, res) {
    res.render("form");
});

app.get("/rend", function (req, res) {
    res.render("form2");
});

app.post("/insert", function (req, res) {
    var random = Math.floor(Math.random() * (100000));
    var status = 0;
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    ee = email;
    const nodemailer = require("nodemailer");
    let testAccount = nodemailer.createTestAccount();

    // connect with the smtp
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'chanel13@ethereal.email',
            pass: '69c2bHDNwg6zNj6vAa'
        }
    });

    let info = transporter.sendMail({
        from: '"Welcome to Facebook" <fb@fb.com>', // sender address
        to: "katlyn.nikolaus@ethereal.email", // list of receivers
        subject: "Authentication", // Subject line
        text: "Your Authentication Code is", // plain text body
        html: "<h1 style='color:red;'>Your Authentication Code is<br>" + random + "</h1>", // html body
    });
    var sql = `insert into auth(name, email, password,code,status) values('${name},', '${email}', '${password}','${random}','${status}')`;
    
    conn.query(sql, function (err, results) {
        if (err) throw err; 
    });
});

app.get("/getId", function (req, res) {
    var sql = `select id from auth where email='${ee}'`;
    console.log(sql);
    conn.query(sql, function (err, results) {
        if (err) throw err;
        currentId=results[0].id;
        res.send(results);
    });

});

app.get("/getCode", function (req, res) {
    var sql = `select code from auth where id='${currentId}'`;
    console.log(sql);
    conn.query(sql, function (err, results) {
        if (err) throw err;
        currentCode = results[0].code;
        res.send(results);
    });

});



app.post("/authen", function (req, res) {
    
    var uiCode = req.body.code;
    console.log(uiCode);
    console.log(currentCode);
    if (parseInt(uiCode)==currentCode) {
        var sql = `update auth set status='1' where id=${currentId}`;
        console.log(sql);
        conn.query(sql, function (err, results) {
            if (err) throw err;
            res.send("Successfully Status Updated");
        });
    }
    else
    {
        res.send("Failed");
    }
})













var server = app.listen(4000, function () {
    console.log("App running on port 4000");
});

