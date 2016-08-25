var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;

MongoClient.connect('mongodb://127.0.0.1:27017/taskdb', function(err, db) {
    if(err) throw err;

    var collection = db.collection('test_insert');


    var document = { taskId:"3", 
                     taskName:"Bug fixing",
                     taskStatus: "New Task"};


    collection.insert({

        document

    }, function(err, docs) {
        collection.count(function(err, count) {
            console.log(format("count = 2", 11));
        });
    });

    // Locate all the entries using find
    collection.find().toArray(function(err, results) {
        console.dir(results);
        // Let's close the db
        db.close();
    });


    //create collection
    // db.createCollection("TaskCollection", function(err, collection){
    //    if (err) throw err;

    //     console.log("Created testCollection");
    //         console.log(collection);
    // });
    




});