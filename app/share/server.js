var livedb = require('livedb');
var sharejs = require('share');
var browserChannel = require('browserchannel').server
var Duplex = require('stream').Duplex;
// var db = require('livedb-mongo')('mongodb://localhost:27017/test', {safe:true});
// var backend = livedb.client(db);
var backend = livedb.client(livedb.memory());
var share = require('share').server.createClient({backend: backend});


var express = require('express');
var app = express();
app.use(express.static(__dirname + '/../../public/'));
console.log(__dirname + '/../../public/');

app.use(browserChannel(function(client) {
  var stream = new Duplex({objectMode: true});

  stream._read = function() {};
  stream._write = function(chunk, encoding, callback) {
    if (client.state !== 'closed') {
      client.send(chunk);
    }
    callback();//write to stream
  };

  client.on('message', function(data) {
    console.log(data);
    stream.push(data);
  });

  client.on('close', function(reason) {
    console.log('clinet closed for reason: ' + reason);
    stream.push(null);
    stream.emit('close');
  });

  stream.on('end', function() {
    client.close();
  });

  // Give the stream to sharejs
  return share.listen(stream);
}));


app.listen(8888);