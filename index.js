'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var studentGrades = require('./grades.json');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.listen((process.env.PORT || 3000));

var PAGE_ACCESS_TOKEN = 'EAAQbPpi609YBACbKFgsjVDOnk8ubGUs24UQGlFS7ldXrevkYRZCTHlk4SG7VNYF4iBFMnR9yKIOtB3rvc6suhqS7Nwrjb2Tr1KsRJVzPRgEFqNTq3kRzT2jtGOS7G4ZCKM3PWR20BRgZAHn9rkM8kpkdSz5ZAd260uBZBTXVwSQZDZD';

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

// handler for receiving messages
app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging, i = 0, event, recipientID;

    // Iterate over each entry
    // There may be multiple if batched
    for (i = 0; i < events.length; i += 1) {
        event = events[i];
        recipientID = event.sender.id;

        // Verify that the event has message data
        if (event.message) {

            if (event.message.is_echo) {
                // Do not do anything if the message received is just an echo
            } else {
                // Do something with the text sent to the chatbot
                processMessageText(recipientID, event.message.text);
            }
        } else if (event.postback) {
            receivedPostback(event);
        }
    }

    // Assume all went well.
    // You must send back a 200 status, within 20 seconds, to let facebook know you've
    // successfully received the callback. Otherwise, the request will time out.
    res.sendStatus(200);
});

function processMessageText(recipientID, text) {
    // Define a regex pattern here to match grades inquiry
    var gradePattern = /^\d{8}$/;

    if (text === 'greetings'){
        sendTextMessage(recipientID, 'Stay a while and listen');
    } else if (text == 'generic') {
        sendGenericMessage(recipientID);
    } else if (text.match(gradePattern)) {
        var studentID = text;
        var studentGrade = loadGrade(studentID);

        if (studentGrade != null) {
            sendTextMessage(recipientID, studentGrade)
        } else {
            sendTextMessage(recipientID, 'No record found.');
        }

    }
    else {
        sendTextMessage(recipientID, 'Can\'t understand you');
    }
};

function sendTextMessage(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    };

    callSendAPI(messageData);
}

function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData

    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;

            console.log("Successfully sent generic message with id %s to recipient %s",
                messageId, recipientId);
        } else {
            console.error("Unable to send message.");
            console.error(response);
            console.error(error);
        }
    });
}

function sendGenericMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",
            image_url: "http://messengerdemo.parseapp.com/img/rift.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",
            image_url: "http://messengerdemo.parseapp.com/img/touch.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}

function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback
  // button for Structured Messages.
  var payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " +
    "at %d", senderID, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to
  // let them know it was successful
  sendTextMessage(senderID, "Postback called");
}

function loadGrade(studentID) {
    var i = 0;
    // Just loop through the grades json
    for (i=0;i<studentGrades.grades.length;i++) {
        if (studentGrades.grades[i].id === studentID) {
            return studentGrades.grades[i].grade;
        }
    }

    // Return null if none found
    return null;
}
