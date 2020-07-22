UI.AddLabel("          -- Multi KillVoice --");
UI.AddLabel("              Made by Zeki");
UI.AddLabel("");
UI.AddCheckbox("Enable KillVoice");
UI.AddSliderInt("Amount", 1, 5);
UI.AddDropdown("Selected", [1, 2, 3, 4, 5]);
UI.AddCheckbox("Loopback");

UI.AddSliderFloat("Length", 0.0, 10.0);

/*
Under Development
Probably released some time after you see this.

UI.AddCheckbox("Random KillVoice");*/

// textboxes create
UI.AddTextbox("KillVoice 1");
UI.AddTextbox("KillVoice 2");
UI.AddTextbox("KillVoice 3");
UI.AddTextbox("KillVoice 4");
UI.AddTextbox("KillVoice 5");
UI.AddLabel("");

// textboxes hide
UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", "KillVoice 1", false);
UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", "KillVoice 2", false);
UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", "KillVoice 3", false);
UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", "KillVoice 4", false);
UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", "KillVoice 5", false);

UI.AddCheckbox("Set Amount");
UI.AddCheckbox("Reset Amount");
UI.AddLabel("");

var playing = false;
var started = 0.0;


function getValue(name){
	return UI.GetValue("Misc", "JAVASCRIPT", "Script items", name);
}
function setValue(name, val){
	UI.SetValue("Misc", "JAVASCRIPT", "Script items", name, val);
}

function getString(name){
	UI.GetString("Misc", "JAVASCRIPT", "Script items", name);
}

function setEnabled(name, val){
	UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", name, val);
}

function onFSN(){
	var selectedVal = getValue("Amount");
	if(getValue("Set Amount")){
		for(i=0; i < selectedVal; i++){
			UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", "KillVoice " + (i+1), true);
		}
		setValue("Set Amount", false);
	}
	if(getValue("Reset Amount")) reset();
	if(getValue("Loopback")) {
		UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", "Length", true);
		if(playing && Math.abs(started + getValue("Length") - Globals.Realtime()) < 0.05){
			playing = false; Sound.StopMicrophone();
			Cheat.ExecuteCommand("voice_loopback 0");
		}
	}
}

function playSound(){
	if(!getValue("Enable KillVoice")) return;
	Cheat.PrintChat(" \x02[Zeki] \x01- Parsed playSound()");
	if(!(Entity.GetEntityFromUserID(Event.GetInt("userid")) == Entity.GetLocalPlayer()) && Entity.GetEntityFromUserID(Event.GetInt("attacker")) == Entity.GetLocalPlayer()){
		Cheat.PrintChat(" \x02[Zeki] \x01- Parsed Player is The Killer");
		playing = true; started = Globals.Realtime();
		if(getValue("Loopback")){
			Cheat.PrintChat(" \x02[Zeki] \x01- Parsed if(loopback)");
			Cheat.ExecuteCommand("voice_loopback 1");
		}
		var parsedName = "KillVoice " + (getValue("Selected")+1).toString();
		Cheat.PrintChat(" \x02[Zeki] \x01- Parsed this selectedName \x04" + parsedName + " and " + UI.GetString("Misc", "JAVASCRIPT", "Script items", parsedName));
		Sound.PlayMicrophone('C:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike Global Offensive\\' + UI.GetString("Misc", "JAVASCRIPT", "Script items", parsedName));
	}
}

function reset(){
	UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", "KillVoice 1", false);
	UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", "KillVoice 2", false);
	UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", "KillVoice 3", false);
	UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", "KillVoice 4", false);
	UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", "KillVoice 5", false);
	setValue("Amount", 1);
	setValue("Reset Amount", false);
}

Cheat.RegisterCallback("FrameStageNotify", "onFSN");
Cheat.RegisterCallback("Unload", "reset");
Cheat.RegisterCallback("player_death", "playSound");