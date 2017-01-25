/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var vibe = require('ui/vibe');
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
				title: 'Navy Seal',
				subtitle: 'What the fuck did you just'
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
				send(user, "What the fuck did you just fucking say about me, you little bitch? I’ll have you know I graduated top of my class in the Navy Seals, and I’ve been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I’m the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You’re fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that’s just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your little “clever” comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn’t, you didn’t, and now you’re paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You’re fucking dead, kiddo.", false);
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
	socket.emit("user", {"username": user});
});

function send(user, message, data) {
	console.log(message);
	socket.emit("message", {
		username: user,
		message: message,
		dataTransfer: data
	});
}
