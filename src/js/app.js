/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var io = require('socket.io');
var socket = io.connect("http://node.infra.link/");
var user = "pebble";
socket.emit("user", {"username": user});

var main = new UI.Card({
  title: 'bkmchat',
  icon: 'images/icon.png',
  subtitle: 'Welcome to BKMCHAT',
  body: 'Initialising...',
  subtitleColor: 'blue', // Named colors
  bodyColor: 'black' // Hex colors
});

main.show();

socket.on("connected", function (data) {
	main.body("Connected!");
	main.bodyColor("green");
});

socket.on("disconnect", function () {
	main.body("Disconnected!");
	main.bodyColor("red");
});

socket.on("usernamereject", function () {
	main.body("Username rejected!");
	main.bodyColor("red");
});

socket.on("message", function (data){
	console.log(data.message);
	if (data.dataTransfer) {
		return false;
	}
	
	main.subtitle(data.username);
	main.body(data.message);
	main.bodyColor("blue");
});