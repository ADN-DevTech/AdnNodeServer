/////////////////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved 
// Written by Philippe Leefsma 2013 - ADN/Developer Technical Services
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted, 
// provided that the above copyright notice appears in all copies and 
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting 
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS. 
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC. 
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////////////////

// Requested Modules
var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');
var urlparser = require('url');
var models = require('./models');

//MIME table
var mimes = {
	'css': 'text/css',
	'js': 'text/javascript',
	'html': 'text/html'
};

// Create server object and process http requests
var server = http.createServer(function (request, response) {

    var parsedURL = urlparser.parse(request.url).pathname;

    console.log('parsedURL:' + parsedURL);

    var requestURL = __dirname + '/../Client';

	if (parsedURL == '/nodesrv')
		requestURL += '/client.html';
	else
		requestURL += parsedURL;

	fs.readFile(requestURL, function (err, content) {

		var ext = requestURL.substring((requestURL.lastIndexOf(".") + 1));
		var mime = mimes[ext] || 'text/plain';

		if (err) {
			response.writeHead(404);
			response.end('404 File not found! ');
			return;
		}

		response.writeHead(200, { 'Content-Type': mime });
		response.end(content);
	});
});

// connects socket to server
var io = socketio.listen(server, { log: false });

// socket connection callback
io.sockets.on('connection', function (socket) {

	console.log('Incoming socket connection: ' + socket.id);

    // new socket client connected
	socket.on('connect', function () {
		
	});

    // socket client disconnected
	socket.on('disconnect', function () {
		
	});

    // list of models requested from client
	socket.on('getModels', function () {

	    console.log('socket.on \'getModels\'');

	    models.getModels(function (models) {
	        socket.emit('models', models);
	    });
	});

    // data for specific model requested from client
	socket.on('getModelDataByName', function (model) {

	    console.log('socket.on \'getModelDataByName\': ' + model);

	    models.getModelDataByName(model, function (data) {
	        socket.emit('modelData', data);
	    });
	});
});

// set up server on port 3000 
var port = process.env.PORT || 3000;

// starts server
server.listen(port, function () {
    console.log('Server Listening on Port: ' + port);
});
