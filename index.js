var querystring = require('querystring');
var https = require('https');

var host = 'www.thegamecrafter.com';
var username = 'JonBob';
var password = '*****';
var apiKey = '*****';
var sessionId = null;
var deckId = '68DC5A20-EE4F-11E2-A00C-0858C0D5C2ED';

var MTGO_host = 'api.magicthegathering.io';


function performRequest(endpoint, method, data, success) {
  var dataString = JSON.stringify(data);
  var headers = {};
  
  if (method == 'GET') {
    endpoint += '?' + querystring.stringify(data);
  }
  else {
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length
    };
  }
  var options = {
    host: host,
    path: endpoint,
    method: method,
    headers: headers
  };

  var req = https.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      console.log(responseString);
      var responseObject = JSON.parse(responseString);
      success(responseObject);
    });
  });

  req.write(dataString);
  req.end();
}


function login() {
  performRequest('/api/session', 'POST', {
    username: username,
    password: password,
    api_key_id: apiKey
  }, function(data) {
    sessionId = data.result.id;
    console.log('Logged in:', sessionId);
    getCards();
  });
}


function getCards() {
  performRequest('/api/pokerdeck/' + deckId + '/cards', 'GET', {
    session_id: sessionId,
    "_items_per_page": 100
  }, function(data) {
    console.log('Fetched ' + data.result.paging.total_items + ' cards');
  });
}


function MTGO_performRequest(endpoint, method, data, success) {
  var dataString = JSON.stringify(data);
  var headers = {};
  
  if (method == 'GET') {
    endpoint += '?' + querystring.stringify(data);
  }
  else {
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length
    };
  }
  var options = {
    host: MTGO_host,
    path: endpoint,
    method: method,
    headers: headers
  };

  var req = https.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      console.log("oh wow got to end event yay");
      console.log(responseString);

      var responseObject = JSON.parse(responseString);
      success(responseObject);
    });
  });

  req.write(dataString);
  req.end();
}



function MTGO_getCards() {
  MTGO_performRequest('/v1/cards', 'GET', {
    name: 'cabal slaver',
  }, function(data) {
    console.log('Fetched MTGO cards');
  });
}


MTGO_getCards();
