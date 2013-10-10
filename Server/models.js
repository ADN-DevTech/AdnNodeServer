
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
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var process = require('child_process');

exports.getModels = function (callback) {

    var folderPath = path.resolve(__dirname + '/models').toString();
    
    fs.readdir(folderPath, function (err, files) {

        if (err) throw err;

        var models = [];

        for (var i = 0; i < files.length; i++) {

            var fileName = files[i];
            
            if ((path.extname(fileName) == ".ipt") ||
                (path.extname(fileName) == ".iam")) {
                var model = { id: i, name: files[i] };
                models.push(model);  
            }
        }
        
        callback(models);
    });
};

exports.getModelDataByName = function (model, callback) {

    var workerAppPath = path.resolve(
        __dirname + '/../WorkerApp/bin/Release/WorkerApp.exe').toString();

    // generates a temp filename for worker output
    var tempName = 'tmp' + crypto.randomBytes(4).readUInt32LE(0);

    var inputFile = path.resolve(
        __dirname,
        'models/' + model).toString();

    var outputFile = path.resolve(
        __dirname,
        'data/' + tempName + '.json').toString();
 
    var params = [inputFile, outputFile];

    // spawn worker process
    var worker = process.spawn(workerAppPath, params);

    worker.stdout.on('data', function(data) {
        console.log('Worker output: ' + data.toString());
    });

    // worker finished callback
    worker.on('exit', function (code) {

        console.log('Worker finished with code: ' + code.toString());

        // read output file to retrieve model data
        if (code == 0) {

            fs.readFile(outputFile, 'utf8', function (err, data) {

                if (err) {
                    console.log('Error log:' + JSON.stringify(err));
                }
                else {

                    var modelData = JSON.parse(data);

                    callback(modelData);

                    // delete temp file from disk
                    fs.unlink(outputFile, function (err) {
                        if (err) {
                            console.log(JSON.stringify(err));
                        }
                    });
                }
            });
        }
    });
}
