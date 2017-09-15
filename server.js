
// Sets up Dependencies
var express = require("express");
var bodyParser = require("body-parser");

// Sets up the Express App
var PORT = process.env.PORT || 3000;
var app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

// Set Handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
var router = require("./controller/bingo_controller.js");

app.use("/", router);

app.listen(PORT);

console.log("Listening on port", PORT);
