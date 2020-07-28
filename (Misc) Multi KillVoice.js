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


		}

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
					', "custom_dir":' + custom_directory +
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
			}
		}

		if(credits.getTabVisibility()){
			var fonte = Render.AddFont("Tahoma", 7, 700);
			Render.StringCustom(sx, sy, 0, "Developed by: Zeki", [255, 255, 255, 150], fonte);
			Render.StringCustom(sx, sy + 20, 0, "GUI Library: ", [255, 255, 255, 150], fonte);
			Render.StringCustom(sx + 65, sy + 20, 0, "Landry <3", [255, 0, 0, 150], fonte);
		}
		
	}

	if(custom_directory){
		setEnabled("Directory", true);
	} else {
		setEnabled("Directory", false);
	}
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
		var parsedName = "KillVoice " + dropdownopts[chosenopt];
		filenames = [file1, file2, file3, file4, file5];
		if(!custom_directory) Sound.PlayMicrophone('C:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike Global Offensive\\' + filenames[chosenopt] + '.wav');
		else Sound.PlayMicrophone(UI.GetString("Misc", "JAVASCRIPT", "Script items", "Directory") + "\\" + filenames[chosenopt] + '.wav');
	}
}

Cheat.RegisterCallback("FrameStageNotify", "onFSN");
Cheat.RegisterCallback("player_death", "playSound");
Cheat.RegisterCallback("Draw", "draw");