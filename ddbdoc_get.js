// Load the SDK for JavaScript
var AWS = require('aws-sdk');
const express = require('express')
const app = express()
const port = 3000

app.get('/create', function (req, res) {
    var email = req.query.email;
    var name = req.query.name;
    var password = req.query.password;
    var phone = req.query.phone;
    var params = {
        TableName: 'Profiles',

        Item: {
            'email': { S: email },
            'name': { S: name },
            'password': { S: password },
            'phone': { N: phone },
            'status': { S: 'please enter' }
        }
    };
    docClient.putItem(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.Item);
        }
    });
    res.send('Success!');
});

app.get('/status', function (req, res) {
    var comprehend = new AWS.Comprehend();
    keyPhraseList = [];
    entityList = [];
    var status = req.query.status;
    var email = req.query.email;
    var params = {
        LanguageCode: 'en',/* required */
        TextList: [ /* required */
            status
            /* more items */
        ]
    };
    comprehend.batchDetectKeyPhrases(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log('KeyPhrases Detected:');
			function onlyUnique(val, index, self) { 
				return self.indexOf(val) === index;
			}
            var rawKeySet = data.ResultList[0].KeyPhrases;
            //console.log(rawKeySet);
			var keySetText = [];
			
            for (var i = 0; i < rawKeySet.length; i++) {
                keySetText.push(rawKeySet[i].Text);
            }
			
			
			keyPhraseList = keySetText.filter(onlyUnique);
            console.log(keyPhraseList);
            var params2 = {
                TableName: 'Profiles',
                Key: {
                    'email': {S: email}
                },
                ExpressionAttributeNames: {
                    '#s': 'status',
                    '#kp': 'keyphrases'
                },
                ExpressionAttributeValues: {
                    ':s': {S: status},
                    ':kp': {SS: keyPhraseList}
                },
                ReturnValues: "ALL_NEW",
                UpdateExpression: "SET #s = :s, #kp = :kp"
            };
            docClient.updateItem(params2, function(err, data) {
                if(err) console.log(err, err.stack);
                else    console.log(data);
            })
        }	  // successful response
    });
    comprehend.batchDetectEntities(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log('Entities Detected:');
            entityList = [];
			function onlyUnique(value, index, self) { 
			return self.indexOf(value) === index;
			}
            var rawEntitySet = data.ResultList[0].Entities;
            //console.log(rawEntitySet);
			var entitySetText = [];
            for (var i = 0; i < rawEntitySet.length; i++) {
                entitySetText.push(rawEntitySet[i].Text);
            }
			entityList = entitySetText.filter(onlyUnique);
            console.log(entityList);
            var params2 = {
                TableName: 'Profiles',
                Key: {
                    'email': {S: email}
                },
                ExpressionAttributeNames: {
                    '#s': 'status',
                    '#e': 'entities'
                },
                ExpressionAttributeValues: {
                    ':s': {S: status},
                    ':e': {SS: entityList}
                },
                ReturnValues: "ALL_NEW",
                UpdateExpression: "SET #s = :s, #e = :e"
            };
            docClient.updateItem(params2, function(err, data) {
                if(err) console.log(err, err.stack);
                else    console.log(data);
            })
        }
    });

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
// Set the Region 
AWS.config.loadFromPath('./config.json');
AWS.config.update({ region: 'us-east-1' });

// Create DynamoDB document client
var docClient = new AWS.DynamoDB();

