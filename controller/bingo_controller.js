// Imports express and sets up the router
var express = require("express");
var router = express.Router();

var squares = require("../public/squares.js");
var players = require("../public/players.js");

// Imports ORM to use its database functions
var ORM = require("../config/orm.js");

//Imports the bingo squares
var squares = require("../public/squares.js");

var numSquares = 25;

//Sets up routes

	//Returns the default page with a blank board
	router.get("/", function(req, res) {
		res.render("index", { 
			board: "",
			message: "Welcome to GW Bingo!!!"
		});	
	});

	//Loads the page with a user's board
	router.get("/:idplayer", function(req, res){

		//Parces the player ID and name from req.params
		var temp = req.params.idplayer;
		var id = temp.substring(0, temp.search("_"));
		var name = '"' + temp.substring(temp.search("_") + 1) + '"';
		name = name.replace("_"," ");

		//Runs a check if the user is in the database
		//If they are not, randomly generates questions and submits the user
		ORM.getUser(id, function(data) {
			if(data.length === 0) {
				ORM.newUser(id, name, mySquares(id), function() {
					//do nothing
				});
			}
		});

		ORM.getUser(id, function(data) {
			
			var mySquares = convertToEvent(data[0]);
			console.log(mySquares);
			res.render("index", { 
				board: mySquares.join(),
				message: id
			});
		});
	});

	//Allows for a page to generate a new user's random board
	// router.post("/:id", function(req, res) {

	// 	ORM.newUser(req.params.id, req.body.name, req.body.array, function(){
	// 		res.redirect("/" + req.params.id);
	// 	});
	// });

//Exports routes for the server to use
module.exports = router;

function mySquares(playerID) {

	//Creates a temp array of numbers 0 to squares.length -1
	var tempArray = [];
	for (var i = 0; i < squares.length; i++) {
		tempArray.push(i);
	}

	//If Kieran or Christin, removes the events specific to them
	if(parseInt(playerID) === 22) tempArray.splice(1, 1);
	if(parseInt(playerID) === 10) tempArray.splice(2, 1);

	//Since we will be setting event 0 to the center of bingo, we are removing the 0 entry from temp array and will manually add it afterward
	tempArray.splice(0, 1);

	//The array that will hold the number questions for that player
	var randomSquares = [];
	
	//Fills randomSquares randomly with numbers from tempArray, and removes those entries so you don't get the same one twice
	for (var i = 0; i < numSquares; i++) {
		
		var random = Math.floor(Math.random() * tempArray.length);
		randomSquares.push(tempArray.splice(random, 1));
		
	}

	//Manuially replaces position 12 with event 0
	randomSquares.splice(12, 1, 0);

	return randomSquares;
}

function convertToEvent(playerData) {

	var text = [];
	//starts at 1 and is <= because 
	for (var i = 0; i < numSquares; i++) {
		text.push(squares[playerData["s" + i]]);
	}
	return text;

}