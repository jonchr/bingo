// Imports express and sets up the app
var express = require("express");
var app = express();

var squares = require("../public/squares.js");
var players = require("../public/players.js");

// Imports ORM to use its database functions
var ORM = require("../config/orm.js");

//Imports the bingo squares
var squares = require("../public/squares.js");

var numSquares = 25;

//Sets up routes
//Returns the default page with a blank board
app.get("/", function(req, res) {
	res.render("index", { 
		board: "",
		message: "Welcome to GW Bingo!!!"
	});	
});

//Loads the page with a user's board
app.get("/:player", function(req, res){

	//Parces the player ID and pName from req.params
	var temp = req.params.player;
	console.log(temp);

	var id = temp.substring(0, temp.search("_"));
	var pName = temp.substring(temp.search("_") + 1);
	pName = "'" + pName.replace("_"," ") + "'";
	
	//Pulls data for the player ID
	ORM.getUser(id, function(data) {
		
		var mySquares;
		
		//If user does not exist in database, generates and saves their squares in the db
		if(data.length === 0) {
			console.log("New player; generating squares");
			mySquares = generateSquares(id);
			ORM.newUser(id, pName, mySquares, function() {
				//Do nothing
			});
			//Converts the array to an object to match how it is when returned by a query
			mySquares = convertToObject(mySquares);
		} else {
			console.log("Retrieving previous squares");
			mySquares = data[0];
		}

		//Converts mySquares to the actual words
		mySquares = convertToEvent(mySquares);
		console.log(mySquares);

		res.render("index", { 
			board: mySquares.join(","),
			message: id,
			name: pName.replace("'", "")
		});
	});
}); 

//Randomly generates a player's squares from the squares array
//Squares are generated as the event number, not the text
function generateSquares(playerID) {

	//Creates a temp array of numbers 0 to squares.length -1
	var tempArray = [];
	for (var i = 0; i < squares.length; i++) {
		tempArray.push(i);
	}

	//If Kieran or Christin, removes the event numbers specific to them
	if(parseInt(playerID) === 22) tempArray.splice(1, 1);
	if(parseInt(playerID) === 10) tempArray.splice(2, 1);

	//Since we will be setting event 0 to the center of bingo, we are removing the 0 entry from temp array and will manually add it afterward
	tempArray.splice(0, 1);

	//The array that will hold the number questions for that player
	var randomSquares = [];
	
	//Fills randomSquares randomly with numbers from tempArray, and removes those entries so you don't get the same one twice
	for (var i = 0; i < numSquares; i++) {
		var random = Math.floor(Math.random() * tempArray.length);
		randomSquares.push(tempArray.splice(random, 1)[0]);
	}

	//Manuially replaces position 12 with event 0
	randomSquares.splice(12, 1, 0);

	return randomSquares;
}

//Converts the object to an array of text events
function convertToEvent(playerData) {

	var text = [];
	
	for (var i = 0; i < numSquares; i++) {
		text.push(squares[playerData["s" + i]]);
	}
	
	return text;
}

//Converts the array to an object to match how it is when returned by a query
function convertToObject(array) {
	
	var tempObj = {};
	
	for (var i in array) {
		tempObj[`s${i}`] = array[i];
	}
	return tempObj;
}

//Exports routes for the server to use
module.exports = app;