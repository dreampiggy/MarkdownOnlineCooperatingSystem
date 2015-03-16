var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/markdown');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connect ERROR!'));
db.once('open', function (callback) {
	console.log('MongoDB connect OK!');
});
exports.db = db;
exports.mongoose = mongoose;