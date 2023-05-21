const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sample",
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Database Connected");
});

// EJS FILE
app.get("/users", (req, res) => {
  const query = "SELECT * FROM `users`"; // Modify the query as per your database schema

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching user data");
    } else {
      res.render("users", { users: results });
    }
  });
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

app.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password1, 10);

    var username = req.body.username1;
    var email = req.body.email1;
    var password = hashedPassword;

    db.query(
      "INSERT INTO users(name, email, number) VALUES (?,?, ?)",
      [username, email, password],
      (err, results) => {
        if (err) throw err;

        res.send("Data Inserted");
      }
    );
  } catch (e) {
    res.status(200).send("Error");
  }
});

app.post("/login", async (req, res) => {
  try {
    var username = req.body.username;
    var password = req.body.password;

    db.query(
      "SELECT * FROM users WHERE name = ?",
      [username],
      async (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
          res.status(401).send("Invalid credentials");
        } else {
          const hashedPassword = results[0].number;

          const passwordMatch = await bcrypt.compare(password, hashedPassword);

          if (passwordMatch) {
            res.json(hashedPassword);
          } else {
            res.status(401).send("Invalid credentials");
          }
        }
      }
    );
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination folder for storing the uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Use unique filenames to avoid conflicts
  },
});

const upload = multer({ storage: storage });
const corsOptions = {
  origin: "http://127.0.0.1:5500", // Replace with the actual origin of your HTML file
  methods: "GET, POST",
  allowedHeaders: "Content-Type",
};

app.options("/uploadimage", cors(corsOptions));

app.post(
  "/uploadimage",
  cors(corsOptions),
  upload.single("image"),
  function (req, res) {
    // Here, you can access the uploaded image using req.file
    const imagePath = req.file.path;

    console.log("Enter");

    // Store the image in the XAMPP database using your preferred method (e.g., using a database driver)
    const sql = "INSERT INTO pic (imagePath) VALUES (?)";
    db.query(sql, [imagePath], function (err, result) {
      if (err) {
        console.error("Error storing image in the database: " + err);
        return res.status(500).send("Error storing image in the database");
      }

      console.log("Image stored in the database");
      // Send a response to the client
      res.send("Image uploaded successfully!");
    });
  }
);

app.get("/getimage", cors(corsOptions), function (req, res) {
  const sql = "SELECT * FROM pic"; // Modify the query as per your database schema
  db.query(sql, function (err, result) {
    if (err) {
      console.error("Error fetching image path from the database: " + err);
      return res
        .status(500)
        .send("Error fetching image path from the database");
    }

    if (result.length === 0) {
      return res.status(404).send("Image path not found");
    }

    const imagePath = result[0].imagePath;
    res.json({ imagePath });
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
