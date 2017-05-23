var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var printer = require("../lib");
//var printer = require('printer');
var util = require('util');
var Iconv  = require('iconv').Iconv;

// Print Printer List
console.log("installed printers:\n"+util.inspect(printer.getPrinters(), {colors:true, depth:10}));


console.log("supported job commands:\n"+util.inspect(printer.getSupportedJobCommands(), {colors:true, depth:10}));

// var printer = require("../lib");
//
function oneClickPrint(name, intentFormID)
{
  var objectT1 = "T1";
  var objectB1 = "B1";
  var objectQ1 = "Q1";

  var nameInUTF8 = new Buffer(name, 'utf8');
  console.log(nameInUTF8.toString('utf8'));


  // var iconv = new Iconv('UTF-8', 'GBK//TRANSLIT//IGNORE');
  var nameValue = new Buffer(name, "ascii");
  var objectValue = new Buffer(intentFormID, "ascii");

  var printHeader = new Buffer([
    0x1B, 0x69, 0x61, 0x03,  // p-touch template mode
    0x5E, 0x49, 0x49, // initlaize
    0x5E, 0x54, 0x53, 0x30, 0x30, 0x36, // use template 6
  ]);
  var printCommand = new Buffer([0x5E, 0x46, 0x46]);

  var objectT1Command = new Buffer([
    0x5E, 0x4F, 0x4E, 0x54, 0x31, 0x00,
    0x5E, 0x44, 0x49, nameValue.length, 0x00
  ]);
  var objectB1Command = new Buffer([
    0x5E, 0x4F, 0x4E, 0x42, 0x31, 0x00,
    0x5E, 0x44, 0x49, objectValue.length, 0x00
  ]);
  // var objectQ1Command = new Buffer([
  //   0x5E, 0x4F, 0x4E, 0x51, 0x31, 0x00,
  //   0x5E, 0x44, 0x49, objectValue.length, 0x00
  // ]);


  const totallength = printHeader.length + printCommand.length + objectT1Command.length + nameValue.length + objectB1Command.length + objectValue.length;
  var finalCommand = Buffer.concat([printHeader, objectT1Command, nameValue, objectB1Command, objectValue,  printCommand], totallength);

  var buffterT1 = Buffer.concat([objectT1Command, objectValue], objectT1Command.length + objectValue.length);
  // console.log(rawData.toString('ascii'));
  //
  //
  console.log(nameValue);
  console.log(finalCommand.toString('ascii'));
  console.log(objectValue.toString('ascii'));
  console.log(buffterT1.toString('ascii'));
  console.log(buffterT1);
  console.log(objectValue);
  console.log(finalCommand);
  // console.log(rawData);
  // console.log(raw);


  printer.printDirect({
  	 data: finalCommand
  	, printer:'Brother_QL_720NW' // printer name, if missing then will print to default printer
  	, type: 'RAW' // type: RAW, TEXT, PDF, JPEG, .. depends on platform
  	, success:function(jobID){
  		console.log("sent to printer with ID: "+jobID);
  	}
  	, error:function(err){console.log(err);}
  });
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.post('/one_click_print', function (req, res) {
  console.log('/one_click_print');
  console.log(req.body);
  console.log(req.body.intentFromId);
  console.log(req.body.name);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Content-type", "application/json");

  oneClickPrint(req.body.name, req.body.intentFromId);

  var json = {
    success : true
  };
  res.send(JSON.stringify(json));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
