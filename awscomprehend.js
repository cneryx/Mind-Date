var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
AWS.config.update({region: 'us-east-1'});
var comprehend = new AWS.Comprehend();
var params = {
	LanguageCode: 'en',/* required */
  TextList: [ /* required */
    'Amazon.com, Inc. is located in Seattle, WA and was founded July 5th, 1994 by Jeff Bezos, allowing customers to buy everything from books to blenders. Seattle is north of Portland and south of Vancouver, BC. Other notable Seattle - based companies are Starbucks and Boeing.'
    /* more items */
  ]
};
/*
comprehend.batchDetectDominantLanguage(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data.ResultList[0].Languages);           // successful response
});*/
comprehend.batchDetectKeyPhrases(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else    {
	  console.log('KeyPhrases Detected:');
	  console.log(data.ResultList[0].KeyPhrases);   
  }	  // successful response
});
comprehend.batchDetectEntities(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     {
	  console.log('Entities Detected:');

	  console.log(data.ResultList[0].Entities);       

  }	  // successful response
});