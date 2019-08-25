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
	   S:"asodij@gmail.com"
    }, 

  }, 
  TableName: "Profiles"
 };
 var input = [];
 docClient.getItem(params, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     input = (data.Item.keyphrases.SS);
	console.log(input);// successful response
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
   var params = {
  ExpressionAttributeNames: {
   "#ed": "email", 
  }, 
  ExpressionAttributeValues: {
   ":e": {
		S: "asodij@gmail.com"
    }
  }, 
  FilterExpression: "#ed <> :e", 
  TableName: "Profiles"
 };
 var db = [[]];
 var database = [];
 docClient.scan(params, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
 else     db = (data);
//	console.log(data);
	
 for(var i = 0; i < db.Items.length; i++){
	database[i] = db.Items[i].keyphrases.SS;
	
 }
 console.log(database);


//No weighting, 1 on 1
var matches = [];
var excess = [];
var findMatches = function(comparator,index) {
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
	matches[index] = matchPower;
	excess[index] = matchExcess;
    return matchPower+ " excess: "+matchExcess;
}

for (var i = 0; i < database.length; i++) {
    console.log("Matches at index " + i + ": " + findMatches(database[i],i));
}
var results = db.Items;
function sort(arr){
	var n = arr.length;
	for(var i = 0; i < n; i++){
		var key = arr[i];
		var temp = results[i];
		var j = i-1;
		while (j >= 0 && arr[j] < key) { 
                arr[j + 1] = arr[j];
				results[j+1] = results[j];
                j = j - 1; 
            } 
            arr[j + 1] = key; 
			results[j+1] = temp;
	}
		console.log(results);
}

	sort(matches);
	//console.log(results);

 });
 
 });

