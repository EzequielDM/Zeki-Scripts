/*
	This project is entirely based off of Shifto's StatTrak Kill Counter. (https://www.onetap.com/threads/release-stattrak-kill-counter.12964)
	I just added the ability to save the value to a config that will be loaded every time the script is started so the counter will actually keep track of your kills between servers.

	Author: Zeki
	Version: 1.0.0
	Description: StatTrak now counts your kills and changes the StatTrak value in your weapons. The value will be saved in a config.
*/

var kill_count = 0;

// UI Save and Load button
UI.AddLabel("---------------------------------");
const savecfg = UI.AddCheckbox("StatTrak | Save config");
const loadcfg = UI.AddCheckbox("StatTrak | Load config");

// Base 64
var Base64 = {
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	encode: function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = Base64._utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output +
				this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
				this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}
		return output;
	},
	decode: function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}
		output = Base64._utf8_decode(output);
		return output;
	},
	_utf8_encode: function (string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	},
	_utf8_decode: function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while (i < utftext.length) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
}

// Config handler
var config = {
	save: function (json) {
		Cheat.ExecuteCommand("r_eyemove " + Base64.encode(json));
	},
	load: function () {
		return Base64.decode(Convar.GetString("r_eyemove"));
	}
}

// SetValue safe concat
function set(element, val) {
	const safe_concat = function (a, b) {
		// Create a new array.
		const arr = [];

		for (var i = 0; i < a.length; i++)
			arr.push(a[i]);

		arr.push(b);

		return arr;
	}
	UI.SetValue.apply(null, safe_concat(element, val));
}

// GetValue
function get(val) {
	return UI.GetValue.apply(null, val);
}

//  StatTrak KillCounter
function main() {
	var e = Entity.GetEntityFromUserID(Event.GetInt("userid"));
	var k = Entity.GetEntityFromUserID(Event.GetInt("attacker"));
	var weapon = Entity.GetWeapon(k);
	if (Entity.IsEnemy(e) && Entity.IsLocalPlayer(k)) {
		kill_count++
		Entity.SetProp(weapon, "CBaseAttributableItem", "m_iItemIDHigh", -1);
		//Entity.SetProp(weapon, "CBaseAttributableItem", "m_szCustomName", "What? I can change names?");
		Entity.SetProp(weapon, "CBaseAttributableItem", "m_nFallbackStatTrak", kill_count);
	}
}

// Draw Function
function draw() {
	if (get(savecfg)) {
		cfg = '{ "kill_count": ' + kill_count + '}';
		config.save(cfg);
		set(savecfg, false);
	}
	if (get(loadcfg)) {
		onLoad();
		set(loadcfg, false);
	}
}

// 

function onLoad() {
	try {
		cfg = JSON.parse(config.load());
	} catch (e) {
		Cheat.PrintColor([50, 50, 50, 255], "[STATTRAK] - ");
		Cheat.PrintColor([125, 0, 0, 255], "No config file found or invalid config.");
		return;
	}
	kill_count = cfg.kill_count;
}

Cheat.RegisterCallback("player_death", "main");
Cheat.RegisterCallback("FrameStageNotify", "draw");
onLoad();