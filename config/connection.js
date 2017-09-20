//Sets up and exports connection to Burgers_DB SQL database

var mysql = require('mysql');

var connection;

if (process.env.JAWSDB_URL) {
	connection = mysql.createConnection(process.env.JAWSDB_URL);
}
else {
	connection = mysql.createConnection({
	    host: 'localhost',
	    user: 'root',
	    password: '',
	    database: 'bingo_db'
	});
};

connection.connect(function(err){
	if(err) throw err;
});

module.exports = connection;