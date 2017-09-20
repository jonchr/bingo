// Imports MySQL connection
var connection = require("./connection.js");

// Object Relational Mapper (ORM)
var ORM = {
	//returns a user's board
	getUser: function(id, cb) {
		
		connection.query("SELECT * FROM bingo WHERE id=" + id, function(err, result) {
			if (err) throw err;
			cb(result);
		});
	},

	//registers a new user with their ID, name, board, and time created
	newUser: function (id, name, board, cb) {
		//The columns for each of the squares' question number
		var squares = ["s0","s1","s2","s3","s4","s5","s6","s7","s8","s9","s10","s11","s12","s13","s14","s15","s16","s17","s18","s19","s20","s21","s22","s23","s24"];

		var queryString = "INSERT INTO bingo (id, name," + squares.join() + ", createdAt) "
		queryString += "VALUES (" + id + "," + name;
		for (var i in board) {
			queryString += ", " + board[i];
		}
		queryString += ", null);"
		
		console.log(queryString);

		connection.query(queryString, function(err, result) {
			if (err) throw err;
			cb(result);
		});
	},

};

module.exports = ORM;