var Duplex = require('stream').Duplex;
var sharejs = require('share');
var livedb = require('livedb');
var db = require('livedb-mongo')('mongodb://localhost:27017/test', {safe:true});
var backend = livedb.client(db);
var share = require('share').server.createClient({backend: backend});

console.log('MongoDB connect test OK!');

function communicate(client) {
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
        stream.push(null);
        stream.emit('close');
    });

    stream.on('end', function() {
        client.close();
    });

    // Give the stream to sharejs
    return share.listen(stream);
};

function getSnapshot(projectID,docID,callback){
    backend.fetch(projectID,docID,function(err,snapshot){
        if(err){
            callback(false);
        }
        else{
            console.log(snapshot);
            callback(snapshot);
        }
    })
}



function deleteDoc(projectID,docID,callback){
    livedb.submit(projectID, docID, {del:true}, function(err) {
        if(err){
            callback(false);
        }
        else{
            callback(true);
        }
    });
}

// getSnapshot('5506757487329c8df8e734ec','55078d38a64aa3d401c894dc',function(result){
//     console.log(result);
// })

exports.communicate = communicate;
exports.share = share;
exports.getSnapshot = getSnapshot;
exports.deleteDoc = deleteDoc;