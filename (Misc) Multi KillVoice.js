var MDX = require("mdxlib.js");

var playing = false;
var started = 0.0;

// Set Enabled
function setEnabled(name, val){
	UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", name, val);
}

// Function variables
var enabled = false;
var arrayopened = false;
var dropdownopts = ["1", "2", "3", "4", "5"];
var chosenopt = 0;
var loopback = false;
var file1 = ""; var file2 = ""; var file3 = ""; var file4 = ""; var file5 = "";
var filenames = [];
var length = [0, 10];
var custom_directory = false;
const directory = UI.AddTextbox("Directory");
setEnabled("Directory", false);
var random = false;
var cycle = [false, 0];

// Get random audio fuction
function getRandomAudio(){
	var randint;
	var filename;
	for(i=1; i > 0; i++){
		// Random number between 0 and 4
		randint = Math.floor( (Math.random() * 5));
		filename = filenames[randint];
		if(filename.length > 0) break;
	}
	return filename;
}

// Cycle audio function
function cycleAudio(){
	var file = filenames[cycle[1]];
	if(file && file.length > 0){
		cycle[1]++;
		return file;
	} else {
		cycle[1] = 1;
		return filenames[0];
	}
}

// Draw
function draw(){

	var sx = MDX.agx + 150;
	var sy = MDX.agy + 30;

	r = 251;
	g = 160;
	b = 38;

	if(UI.IsMenuOpen()){

		MDX.menu("Multi Killvoice", " by Zeki#0001", MDX.agx, MDX.agy, 500, 300, r, g, b);

		if(MDX.drag(MDX.agx, MDX.agy).x != 200 || MDX.drag(MDX.agx, MDX.agy).y != 200){
			MDX.agx = MDX.drag(MDX.agx, MDX.agy).x - 150;
			MDX.agy = MDX.drag(MDX.agx, MDX.agy).y - 10;
		}

		var settings = new MDX.MDXTab("Settings", true, MDX.agx + 10, MDX.agy + 30);
		var files = new MDX.MDXTab("Files", false, MDX.agx + 10, MDX.agy + 50);
		var configtab = new MDX.MDXTab("Config", false, MDX.agx + 10, MDX.agy + 70);
		var credits = new MDX.MDXTab("Credits", false, MDX.agx + 10, MDX.agy + 90);
		MDX.tab(settings);
		MDX.tab(files);
		MDX.tab(configtab);
		MDX.tab(credits);

		// Version
		/*
			Remember to always check if you have the latest version.
			Current version: 1.3.0
			Check the latest version at: https://github.com/EzequielDM/Zeki-Scripts/releases
		*/
		var fonte = Render.AddFont("Tahoma", 7, 700);
		Render.StringCustom(sx + 321, sy + 255, 0, "v1.3", [255, 255, 255, 50], fonte);

		// Settings tab
		if(settings.getTabVisibility()){
			// Enable checkbox
			if(MDX.checkbox("Enable", sx, sy, enabled))
				enabled = !enabled;

			// Loopback
			if(MDX.checkbox("Loopback", sx, sy + 20, loopback))
				loopback = !loopback;
			
			// Select dropdown
			var dropdown = MDX.dropdown("Selected", sx, sy + 40, dropdownopts, arrayopened, dropdownopts[chosenopt]);
			if(dropdown != undefined){
				if(dropdown == "closed"){
					arrayopened = !arrayopened;
				} else {
					chosenopt = dropdown;
					arrayopened = !arrayopened;
				}
			}

			// Length slider
			length = MDX.slider("Length", sx + 80, sy + 40, length[1], 0, 10, true);

			// Random Killvoice
			if(MDX.checkbox("Random", sx + 110, sy, random)){
				random = !random;
				cycle[0] = false;
			}
			
			// Cycle killvoice
			if(MDX.checkbox("Cycle", sx + 110, sy + 20, cycle[0])){
				cycle[0] = !cycle[0];
				random = false;
			}
		}

		// Files tab
		if(files.getTabVisibility()){
			// Files
			file1 = MDX.textbox("KillVoice 1", sx, sy, file1);
			file2 = MDX.textbox("KillVoice 2", sx, sy + 35, file2);
			file3 = MDX.textbox("KillVoice 3", sx, sy + 70, file3);
			file4 = MDX.textbox("KillVoice 4", sx, sy + 105, file4);
			file5 = MDX.textbox("KillVoice 5", sx, sy + 140, file5);

			if(MDX.checkbox("Custom directory", sx, sy + 190, custom_directory)){
				custom_directory = !custom_directory;
			}
		}

		// Config tab
		if(configtab.getTabVisibility()){
			// Save config button
			if(MDX.button("Save config", sx, sy)){
				var filenames = [file1, file2, file3, file4, file5];
				var files = JSON.stringify(filenames);
				//                 key:        t/f            key           t/f            key          {int}             key        {array}
				var config = 
				'{' + 
					' "enabled":'+ enabled + 
					', "loopback":' + loopback + 
					', "selected":' + chosenopt + 
					', "filenames":' + files + 
					', "length":' + JSON.stringify(length) + 
					', "custom_dir":' + JSON.stringify(custom_directory) +
					', "random":' + random +
				'}';
				MDX.saveconfig(config);
				Cheat.Print(config);
			}

			// Load config button
			if(MDX.button("Load config", sx, sy + 30)){
				var config = JSON.parse(MDX.loadconfig());
				enabled  = config.enabled;
				loopback = config.loopback;
				chosenopt = config.selected;
				file1 = config.filenames[0];
				file2 = config.filenames[1];
				file3 = config.filenames[2];
				file4 = config.filenames[3];
				file5 = config.filenames[4];
				length[0] = config.length[0];
				length[1] = config.length[1];
				custom_directory = config.custom_dir;
				random = config.random;
			}
		}

		// Credits tab
		if(credits.getTabVisibility()){
			Render.StringCustom(sx, sy, 0, "Developed by: Zeki", [255, 255, 255, 150], fonte);
			Render.StringCustom(sx, sy + 20, 0, "GUI Library: ", [255, 255, 255, 150], fonte);
			Render.StringCustom(sx + 65, sy + 20, 0, "Landry <3", [255, 0, 0, 150], fonte);
		}
		
	}

	if(custom_directory)
		setEnabled("Directory", true);
	else
		setEnabled("Directory", false);
}

// Frame Stage Notify
function onFSN(){
	if(loopback) {
		if(playing && Math.abs(started + length[0] + 0.11 - Globals.Realtime()) < 0.05){
			playing = false; Sound.StopMicrophone();
			Cheat.ExecuteCommand("voice_loopback 0");
		}
	}
}

// Play Sound Function
function playSound(){
	if(!enabled) return;
	if(!(Entity.GetEntityFromUserID(Event.GetInt("userid")) == Entity.GetLocalPlayer()) && Entity.GetEntityFromUserID(Event.GetInt("attacker")) == Entity.GetLocalPlayer()){
		playing = true; started = Globals.Realtime();
		if(loopback){
			Cheat.ExecuteCommand("voice_loopback 1");
		}

		// Variable definition
		var parsedName = "KillVoice " + dropdownopts[chosenopt];
		filenames = [file1, file2, file3, file4, file5];
		randomaudio = getRandomAudio(filenames);
		csdir = (custom_directory) ? UI.GetString("Misc", "JAVASCRIPT", "Script items", "Directory") + "\\" : 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike Global Offensive\\';

		// Cycle
		if(cycle[0]){
			Cheat.Print("parsed cycle \n");
			Sound.PlayMicrophone(csdir + cycleAudio() + '.wav');
			return;
		}
		// Random
		if(random){
			Cheat.Print("parsed random \n");
			Sound.PlayMicrophone(csdir + randomaudio + '.wav');
			return;
		} else
		// Default
		Sound.PlayMicrophone(csdir + filenames[chosenopt] + '.wav');
	}
}

Cheat.RegisterCallback("FrameStageNotify", "onFSN");
Cheat.RegisterCallback("player_death", "playSound");
Cheat.RegisterCallback("Draw", "draw");