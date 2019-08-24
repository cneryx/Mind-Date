// Load the SDK for JavaScript
var AWS = require('aws-sdk');
const express = require('express')
const app = express()
const port = 3000

app.get('/create',function (req, res) {
    var email = req.query.email;
    var name = req.query.name;
    var password = req.query.password;
    var phone = req.query.phone;
    var params = {
    TableName: 'Profiles',
    
    Item: {
        'email':    {S: email},
        'name':     {S: name},
        'password': {S: password},
        'phone':    {N: phone},
        'status':   {S: 'please enter'}
    }
   };
    docClient.putItem(params, function(err, data) {
        if (err) {
        console.log("Error", err);
        } else {
        console.log("Success", data.Item);
        }
    });
    res.send('Success!');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
// Set the Region 
AWS.config.loadFromPath('./config.json');
AWS.config.update({region: 'us-east-1'});

// Create DynamoDB document client
var docClient = new AWS.DynamoDB();

