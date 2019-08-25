/*
    Keywords:
    {Text: ""}

    Entities:
    {Type:"",
    Text: ""}
 */
 
 var AWS = require('aws-sdk');
 AWS.config.loadFromPath('./config.json');
AWS.config.update({region: 'us-east-1'});
var docClient = new AWS.DynamoDB();


var params = {
  Key: {
   "email": {
	   S:"a@gmail.com"
    }, 

  }, 
  TableName: "Profiles"
 };
 var input = [];
 docClient.getItem(params, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     input = (data.Item.keyphrases.SS);           // successful response
   /*
   data = {
    Item: {
     "AlbumTitle": {
       S: "Songs About Life"
      }, 
     "Artist": {
       S: "Acme Band"
      }, 
     "SongTitle": {
       S: "Happy Day"
      }
    }
   }
   */
 });

database = [
    ["d"],
    ["a", "a"],
    ["b", "b", "c", "c", "d"],
    ["a"],
    [],
    ["a", "b", "c", "a", "a"]
];

//No weighting, 1 on 1

var findMatches = function(comparator) {
//Loop for main input
    var matchPower = 0;
	var matchExcess = 0;
    for (var i = 0; i < input.length; i++) {
        //Loop for comparator
        input[i] = input[i].toLowerCase();
        for (var j = 0; j < comparator.length; j++) {
            comparator[j] = comparator[j].toLowerCase();
            if (input[i] === comparator[j]) {
                matchPower++;
                comparator.splice(j, 1);
                break;
            }
        }
    }
	matchExcess = comparator.length;
    return matchPower;
	return matchExcess;
}

for (var i = 0; i < database.length; i++) {
    console.log("Matches at index " + i + ": " + findMatches(database[i]));
}

