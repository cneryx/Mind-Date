var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
AWS.config.update({region: 'us-east-1'});
var comprehend = new AWS.Comprehend();

var getComprehendArrays = function(textData) {
    var params = {
        LanguageCode: 'en',/* required */
        TextList: [ /* required */
            textData/* more items */
        ]
    };
    var output = {
        keyPhraseList: [],
        entityList: []
    }

    /*
    comprehend.batchDetectDominantLanguage(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data.ResultList[0].Languages);           // successful response
    });*/
    comprehend.batchDetectKeyPhrases(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log('KeyPhrases Detected:');

            var rawKeySet = data.ResultList[0].KeyPhrases;
            console.log(rawKeySet);

            for (var i = 0; i < rawKeySet.length; i++) {
                output.keyPhraseList.push(rawKeySet[i].Text);
            }
        }	  // successful response
    });
    comprehend.batchDetectEntities(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log('Entities Detected:');

            var rawEntitySet = data.ResultList[0].Entities;
            console.log(rawEntitySet);

            for (var i = 0; i < rawEntitySet.length; i++) {
                output.entityList.push(rawEntitySet[i]);
            }
        }	  // successful response
    });

    console.log("OO: " + output);
    return output;
}

getComprehendArrays('Amazon.com, Inc. is located in Seattle, WA and was founded July 5th, 1994 by Jeff Bezos, allowing customers to buy everything from books to blenders. Seattle is north of Portland and south of Vancouver, BC. Other notable Seattle - based companies are Starbucks and Boeing.');