var express = require('express');
var app = express();

var http = require("http");
var fs = require("fs");
var path = require("path");
var mime = require("mime");

var bodyParser = require('body-parser');


// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));


// // This responds a DELETE request for the /del_user page.
// app.delete('/del_user', function (req, res) {
//    console.log("Got a DELETE request for /del_user");
//    res.send('Hello DELETE');
// })

// This get method users
app.get('/list_user', function (req, res) {
   console.log("Got a GET request for /list_user");

 var obj = {

                "Status": "200",
                "Message": "Data successfully received",
                "Data": {
                  "username": "trish",
                  "password": "12345",
                  "email": "trish@yahoo.com",
                  "uid": 1100
                }
         }

   res.send(obj);
})


//get method todo
app.get('/allTasks', function (req,res){
  console.log("Get method for all allTasks");


  res.setHeader('Content-Type', 'application/json');

  var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;


MongoClient.connect('mongodb://127.0.0.1:27017/taskdb', function(err, db) {
    if(err) throw err;

     var collection = db.collection('test_insert');


    //  collection.col.aggregate(
    // [
    //   { "$project": {
    //     "Status": 0,
    //     "ObjectID": "$_id",
    //     "DisplayText": "$text"
    //   }}
    // ],

    // Locate all the entries using find

    collection.find().toArray(function(err, results) {
        console.dir(JSON.stringify(results));

         var data_from_db = results;

          var jsonData = {

            "Status": "200",
            "Message": "Display all tasks",
            "Data": data_from_db

        }


         res.send(JSON.stringify(jsonData, null, 2));

        db.close();
    });

});




//closing parenthesis 
})

// post delete method
app.post('/deleteTask', urlencodedParser, function(req,res){

var mongodb = require('mongodb');

 var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;
  

      response = {
                    task_id:req.body.task_id        
      }


    //   var someObj = {

    //                "Data":[{
    //                   "one": 123},{
    //                   "two": 345
    //                   }]
    //                 };

    // var key = req.body.task_id;
    // delete someObj[key];



 // db.collection('test_insert', {}, function(err, tasks) {
 //        tasks.remove({_id: req.body.task_id}, function(err, result) {
 //            if (err) {
 //                console.log(err);
 //            }
 //            console.log(result);


 //            res.end(JSON.stringify(result),null,2);

 //            db.close();
 //        });
 //    });




MongoClient.connect('mongodb://127.0.0.1:27017/taskdb', function(err, db) {
    if(err) throw err;

     var collection = db.collection('test_insert');



    collection.remove({_id: new mongodb.ObjectID(req.body.task_id)}, function(err, result) {
            if (err) {
                console.log(err);
            }
            console.log(result);

             var jsonData = {

            "Status": "200",
            "Message": "Successfully deleted record!"

        }


            res.end(JSON.stringify(jsonData),null,2);

            db.close();
        });

});



 

//closing parenthesis
})

// This post login method
app.post('/postLogin', urlencodedParser, function(req, res) {   
   console.log("Got a POST request for /postLogin");
   // res.send('Post user');


   response = {
       
                  user_name:req.body.user_name,
                  password:req.body.password
                

              };

   console.log(response);
   // res.end(JSON.stringify(response));



   var jsonObject = response;
   var inputUsername = jsonObject.user_name;
   var inputPassword = jsonObject.password;

   if (inputUsername == "trish" && inputPassword == "12345") {
      console.log("username true");
      var resultObject = {
                  "Status": "200",
                   "Message": "Login successful",
                    "Data": {
                   "user_name":jsonObject.user_name,
                   "password":jsonObject.password,
                   "email": "trish@yahoo.com",
                  "uid": 1100

                } 
      };

       res.end(JSON.stringify(resultObject));


   } else {
      console.log(inputUsername);

      var resultObject = {
                "Status": "200",
                "Message": "User not registered",
                "Data": {} 
      };

       res.end(JSON.stringify(resultObject));

   }

})


var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})


// function send404(response) {
//   response.writeHead(404, {"Content-type" : "text/plain"});
//   response.write("Error 404: resource not found");
//   response.end();
// }

// function sendPage(response, filePath, fileContents) {
//   response.writeHead(200, {"Content-type" : mime.lookup(path.basename(filePath))});
//   response.end(fileContents);
// }


// function serverWorking(response, absPath) {
//   fs.exists(absPath, function(exists) {
//     if (exists) {
//       fs.readFile(absPath, function(err, data) {
//         if (err) {
//           send404(response)
//         } else {
//           sendPage(response, absPath, data);
//         }
//       });
//     } else {
//       send404(response);
//     }
//   });
// }




