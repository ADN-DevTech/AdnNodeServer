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

$(document).ready(function () {

    $("#loading-div-background").css({ opacity: 0.5 });

	var socket = io.connect(location.hostname);

    // requests model list from server
	socket.emit('getModels');

    // handles response from model list request
	socket.on('models', function (models) {
	    
	    var combo = document.getElementById("comboModels");

	    //clear combo
	    combo.options.length = 0;

	    for (var i = 0; i < models.length; i++) {

	        var newOption = document.createElement("option");

	        newOption.text = models[i].name;
	        newOption.value = models[i].id;

	        try {
	            combo.add(newOption, null);
	        }
	        catch (error) {
	            combo.add(newOption); // IE only
	        }
	    }
	});

    // requests model data for specific model
	$('#btnGetData').click(function () {

	    ShowWaitDialog();

	    //combo selected value text
	    var model = $("#comboModels option:selected").text();

	    socket.emit('getModelDataByName', model);
	});

    // handles response for model data
	socket.on('modelData', function (modelData) {

	    HideWaitDialog();

	    var table = document.getElementById("propsTable");

	    table.style.visibility = "visible";

	    clearTable(table);

	    addTableRow(table, "Property", "Value", "bold");

	    addTableRow(table, "Model", modelData.Name);
	    addTableRow(table, "Author", modelData.Author);
	    addTableRow(table, "Creation Time", modelData.CreationTime);
	    addTableRow(table, "Material", modelData.Material);

	    var img = document.getElementById("thumbnail");

	    img.style.visibility = "visible";
	    img.src = "data:image/png;base64," + modelData.Thumbnail;
	});

    //////////////////////////////////////////////////////////////////
    // UI Stuff
    //////////////////////////////////////////////////////////////////
	function ShowWaitDialog() {
	    $("#loading-div-background").show();
	}

	function HideWaitDialog() {
	    $("#loading-div-background").hide();
	}

	function addTableRow(table, name, value, fontWeight) {

	    //Set default to 'normal'
	    fontWeight = (typeof fontWeight == 'undefined' ? 'normal' : fontWeight);

	    var rowsCount = table.getElementsByTagName('tr').length;

	    var cell;

	    var row = table.insertRow(rowsCount);

	    cell = row.insertCell(0);
	    cell.innerHTML = name;
	    cell.style.fontWeight = fontWeight;

	    cell = row.insertCell(1);
	    cell.innerHTML = value;
	    cell.style.fontWeight = fontWeight;
	}

	function clearTable(table) {
	    while (table.hasChildNodes()) {
	        table.removeChild(table.firstChild);
	    }
	}
});