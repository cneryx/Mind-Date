// Load the SDK for JavaScript
var AWS = require('aws-sdk');
// Set the Region 
AWS.config.loadFromPath('./config.json');
AWS.config.update({region: 'us-east-1'});

// Create DynamoDB document client
var docClient = new AWS.DynamoDB();


var params = {
    TableName: 'Users',
    
    Item: {
        'id':   {N: '2'},
        'email':    {S: 'sdo@gmail.com'},
        'name':     {S: 'Shrek'},
        'password': {S: 'abcde'},
        'status':   {S: 'smash head'}
    }
   };
   
docClient.putItem(params, function(err, data) {
    if (err) {
    console.log("Error", err);
    } else {
    console.log("Success", data.Item);
    }
});