const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sample",
});

app.get("/users", (req, res) => {
    const query = "SELECT * FROM `users`"; // Modify the query as per your database schema
  
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error fetching user data");
      } else {
        res.json(results);
      }
    });
  });
  

db.connect(function (err) {
  if (err) throw err;
  console.log("Database Connected");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
