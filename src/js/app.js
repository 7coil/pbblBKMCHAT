/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var vibe = require('ui/vibe');
var voice = require('ui/voice');
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
	main.body("Disconnected! Attempting reconnect...");
	main.bodyColor("red");
	socket.socket.reconnect();
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
	vibe.vibrate('long');
});

main.on('click', 'select', function(e) {
	var menu = new UI.Menu({
		sections: [{
			items: [{
				title: 'Hello',
				subtitle: ''
			}, {
				title: 'Yes',
			}, {
				title: 'No',
			}, {
				title: 'The Story of Apache',
				subtitle: 'I sexually Identify as an Attack Helicopter.'
			}, {
				title: 'Shrug',
				subtitle: 'Pebble can\'t display it'
			}, {
				title: 'Flip',
				subtitle: 'Pebble can\'t display it'
			}, {
				title: 'Unflip',
				subtitle: 'Pebble can\'t display it'
			}]
		}]
	});
	menu.on('select', function(e) {
		console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
		console.log('The item is titled "' + e.item.title + '"');
		switch(e.itemIndex) {
			case 0:
				send(user, "Hello", false);
				break;
			case 1:
				send(user, "Yes", false);
				break;
			case 2:
				send(user, "No", false);
				break;
			case 3:
				send(user, "I sexually Identify as an Attack Helicopter. Ever since I was a boy I dreamed of soaring over the oilfields dropping hot sticky loads on disgusting foreigners. People say to me that a person being a helicopter is Impossible and I'm fucking retarded but I don't care, I'm beautiful. I'm having a plastic surgeon install rotary blades, 30 mm cannons and AMG-114 Hellfire missiles on my body. From now on I want you guys to call me \"Apache\" and respect my right to kill from above and kill needlessly. If you can't accept me you're a heliphobe and need to check your vehicle privilege. Thank you for being so understanding.", false);
				break;
			case 4:
				send(user, "¯\\_(ツ)_/¯", false);
				break;
			case 5:
				send(user, "(╯°□°）╯︵ ┻━┻", false);
				break;
			case 6:
				send(user, "┬─┬ ノ( ゜-゜ノ)", false);
				break;
		}

		menu.hide();
	});
	menu.show();
});

main.on('click', 'down', function(e) {
	send(user, "/list", false);
});

main.on('click', 'up', function(e) {
	voice.dictate('start', true, function(e) {
		if (e.err) {
			console.log('Error! ' + e.err);
		}
		
		if (e.transcription.length > 2) {
			send(user, e.transcription, false);
		} else {
			main.subtitle("Pebble");
			main.body("Cancelled voice.");
		}
		
	});
});

function send(user, message, data) {
	console.log(message);
	socket.emit("message", {
		username: user,
		message: message,
		dataTransfer: data
	});
}
