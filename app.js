var printer = require("printer");
var util = require('util');

// Print Printer List
console.log("installed printers:\n"+util.inspect(printer.getPrinters(), {colors:true, depth:10}));


console.log("supported job commands:\n"+util.inspect(printer.getSupportedJobCommands(), {colors:true, depth:10}));

// var printer = require("../lib");

var objectT1 = "T1";
var objectB1 = "B1";
var objectQ1 = "Q1";

var value = "PR-AA0100005";

var objectValue = new Buffer(value, "ascii");
var printHeader = new Buffer([
  0x1B, 0x69, 0x61, 0x03,  // p-touch template mode
  0x5E, 0x49, 0x49, // initlaize
  0x5E, 0x54, 0x53, 0x30, 0x30, 0x36, // use template 6
]);
var printCommand = new Buffer([0x5E, 0x46, 0x46]);

var objectT1Command = new Buffer([
  0x5E, 0x4F, 0x4E, 0x54, 0x31, 0x00,
  0x5E, 0x44, 0x49, objectValue.length, 0x00
]);
var objectB1Command = new Buffer([
  0x5E, 0x4F, 0x4E, 0x42, 0x31, 0x00,
  0x5E, 0x44, 0x49, objectValue.length, 0x00
]);
var objectQ1Command = new Buffer([
  0x5E, 0x4F, 0x4E, 0x51, 0x31, 0x00,
  0x5E, 0x44, 0x49, objectValue.length, 0x00
]);


const totallength = printHeader.length + printCommand.length + objectT1Command.length + objectValue.length + objectB1Command.length + objectValue.length;// +  objectQ1Command.length + objectValue.length;
var finalCommand = Buffer.concat([printHeader, objectT1Command, objectValue, objectB1Command, objectValue, printCommand], totallength);

var buffterT1 = Buffer.concat([objectT1Command, objectValue], objectT1Command.length + objectValue.length);
// console.log(rawData.toString('ascii'));
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
