// Load the SDK for JavaScript
var AWS = require('aws-sdk');
const express = require('express');
const app = express();
const port = 3000;


const session = require('express-session');
const cookieParser = require('cookie-parser');
const mustacheExpress = require('mustache-express');

app.engine('html', mustacheExpress());
app.use('/css', express.static('css'));
app.use('/images', express.static('images'));
app.use('/js', express.static('js'));
app.use('/fonts', express.static('fonts'));
app.use('/img', express.static('img'));
app.set('view engine', 'html');
app.set('views', '');

app.use(cookieParser());
app.use(session({secret: "hackthe8minus2ix"}));
app.use(express.json());// for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//app.get('/', (req, res) => res.send('Hello World!'));

//app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.get('/', function(req, res) {
    console.log(req.session.user);
    res.render('index', {"logged_in": req.session.user})
});

app.get('/index', function(req, res) {
    console.log(req.session);
    res.render('index', {"logged_in": req.session.user})
});

app.get('/index.html', function(req, res) {
    console.log(req.session.user);
    res.render('index', {"logged_in": req.session.user})
});

app.get('/user-profile.html', function(req, res) {
    res.render('user-profile', {"logged_in": req.session.user, "username": req.session.name})
})

app.get('/sessionTest', function(req, res) {
    var out = "";
    if (req.session.page_views) {
        req.session.page_views++;
        out += "Visited " + req.session.page_views + " times";
    } else {
        req.session.page_views = 1;
        out += "Welcome to this page for the first time!";
    }

    if (req.session.user) {
        out += "<br> Welcome " + req.session.user + "!";
    } else {
        out += "<br>You are currently unregistered";
    }

    res.send(out);
});

app.post('/login', function(req, res) {
    //if (req.query.success) {
    if (req.body.email) {
        req.session.user = req.body.email;

        //Set rest of client info
        var params = {
            Key: {
                "email": {
                    S: req.session.user
                },

            },
            TableName: "Profiles"
        };
        docClient.getItem(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
            } else {
                req.session.name = data.Item.name.S;
                res.redirect('/index');
            }
        });
    }



    //} else {
    //res.send("Unsuccessful Login.");
    //}
});



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
            req.session.name = req.query.name;
            req.session.user = req.query.email;
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

app.get('/:wildcard', function(req, res) {
    console.log(req.session);
    res.render(req.params.wildcard, {"logged_in": req.session.user})
});