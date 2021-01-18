UI.AddSliderInt("",0,0);
UI.AddSliderInt(">>> Zeki's Private Script <<<",0,0);
const legitbot = UI.AddHotkey("Enable Legitbot");
const semirage = UI.AddHotkey("Enable Semirage");
UI.AddLabel("");
const lagsync = UI.AddCheckbox("Lagsync");
const dev = (Cheat.GetUsername() == "NinjaOficial") ? true : false;
const setmatch = (dev) ? UI.AddCheckbox("Setup match") : null;
UI.AddLabel("");

// clantag
var tag = ["|", "Z|", "Ze|", "Zek|", "Zeki|", "Zeki |", "Zeki H|", "Zeki Hv|", "Zeki HvH|", "Zeki HvH ", "Zeki HvH|", "Zeki HvH ", "Zeki HvH|", "*eki HvH", "**ki HvH|", "***i HvH|", "**** HvH|", "**** *vH|", "**** **H|", "**** ***|", "**** **|", "**** *|", "****|", "***|", "**|", "*|", "|", ""];
var lastUpdate = 0;
var tagIndex = 0;
const usetag = UI.AddCheckbox("Clantag");

// clantag function
function updateTag(){
	if(tagIndex == tag.length) tagIndex = 0;
	lastUpdate = Globals.Curtime();
	Local.SetClanTag(tag[tagIndex]);
	tagIndex++;
}

const shift = UI.AddSliderInt("DT Shift", 0, 14);
const tolerance = UI.AddSliderInt("DT Tolerance", 0, 8);

function getVal(name){
    if(name == null) return;
    return UI.GetValue.apply(null, name);
}

function isHotkey(name){
    return UI.IsHotkeyActive.apply(null, name);
}

// Ultranites Text Effects
/**
* @param {int} x - x position of the bolded text
* @param {int} y - y position of the bolded text
* @param {int} align - true/false (1/0)
* @param {string[]} text - text to be displayed
* @param {bool} custom - use custom text (optional)
* @param {font} font - if custom, use this font
* @param {array} color - color of text
* @param {int} size - size of text
**/
function bold(x,y,align,text,custom,font,color,size) {
    if(custom) {
        Render.StringCustom(x,y,align,text,color,font);
        Render.StringCustom(x+((size/28)),y+((size/28)),align,text,color,font);
    } else {
        Render.String(x,y,align,text,color,size);
        Render.String(x+((size/28)),y+((size/28)),align,text,color,size);
    }
}

/**
* @param {int} x - x position of the underlined text
* @param {int} y - y position of the underlined text
* @param {int} align - true/false (1/0)
* @param {string[]} text - text to be displayed
* @param {bool} custom - use custom text (optional)
* @param {font} font - if custom, use this font
* @param {array} color - color of text
* @param {array} underline_color - color of underline
* @param {int} size - size of text
**/
function underline(x,y,align,text,custom,font,color,underline_color,size) {
    length = [];
    if(custom) {
        length = Render.TextSizeCustom(text, font);
        Render.StringCustom(x,y,align,text,color,font);
    } else {
        length = Render.TextSize(text,size);
        Render.String(x,y,align,text,color,size);
    }
    Render.Line(x,y+length[1],x+length[0],y+length[1],underline_color);
    Render.Line(x,y+length[1]-.15,x+length[0],y+length[1]-.15,underline_color);
    Render.Line(x,y+length[1]-.25,x+length[0],y+length[1]-.25,underline_color);
}


/**
* @param {int} x - x position of the striked text
* @param {int} y - y position of the striked text
* @param {int} align - true/false (1/0)
* @param {string[]} text - text to be displayed
* @param {bool} custom - use custom text (optional)
* @param {font} font - if custom, use this font
* @param {array} color - color of text
* @param {array} strikethrough_color - color of strikethrough
* @param {int} size - size of text
**/
function strikethrough(x,y,align,text,custom,font,color,strikethrough_color,size) {
    length = [];
    if(custom) {
        length = Render.TextSizeCustom(text, font);
        Render.StringCustom(x,y,align,text,color,font);
    } else {
        length = Render.TextSize(text,size);
        Render.String(x,y,align,text,color,size);
    }
    Render.Line(x,y+length[1]/2,x+length[0],y+length[1]/2,strikethrough_color);
    Render.Line(x,y+length[1]/1.9,x+length[0],y+length[1]/1.9,strikethrough_color);
    Render.Line(x,y+length[1]/1.8,x+length[0],y+length[1]/1.8,strikethrough_color);
}

/**
* @note - ALWAYS RENDER/CALL SHADOW BEFORE OTHER EFFECTS
* @param {int} x - x position of the shadowed text
* @param {int} y - y position of the shadowed text
* @param {int} align - true/false (1/0)
* @param {string[]} text - text to be displayed
* @param {bool} custom - use custom text (optional)
* @param {font} font - if custom, use this font
* @param {array} color - color of text
* @param {int} size - size of text
**/
function shadow(x,y,align,text,custom,font,color,size) {
    if(custom) {
        Render.StringCustom(x+((size/7.17)),y+((size/7.17)),align,text,[0,0,0,255],font);
        Render.StringCustom(x,y,align,text,color,font);
    } else {
        Render.String(x+((size/7.17)),y+((size/7.17)),align,text,[0,0,0,255],size);
        Render.String(x,y,align,text,color,size);
    }
}

// April's UI Namespace Set <3
function Set(element, value) {
    const safe_concat = function(a, b) {
        const arr = [];
       
        for (var i = 0; i < a.length; i++)
            arr.push(a[i]);

        arr.push(b);

        return arr;
    }

    UI.SetValue.apply(null, safe_concat(element, value));
}

function logChat(text){
    return Cheat.PrintChat(" \x02[ZAA] \x01- " + text);
}

function draw(){
    var screenSize = Render.GetScreenSize();
    fonte = Render.AddFont("Arial Black", 32, 100);
    if(dev){
        shadow(10, 10, 0, "DEVELOPER", false, fonte, [0, 255, 0, 255], 10);
        shadow(10, 25, 0, "ZEKI#0001", false, fonte, [100, 0, 100, 255], 10);
    }
    if(UI.IsHotkeyActive("Anti-Aim", "Fake angles", "Inverter")){
        Render.String( (screenSize[0] / 2) - 40, (screenSize[1] / 2), 1, "<<<", [255, 150, 0, 255], 16 );
        Render.String( (screenSize[0] / 2) + 40, (screenSize[1] / 2), 1, ">>>", [50, 50, 50, 255], 16 );
    }
    else{
        Render.String( (screenSize[0] / 2) - 40, (screenSize[1] / 2), 1, "<<<", [50, 50, 50, 255], 16 );
        Render.String( (screenSize[0] / 2) + 40, (screenSize[1] / 2), 1, ">>>", [255, 150, 0, 255], 16 );
    }
    if(UI.IsHotkeyActive("Rage", "GENERAL", "Doubletap")){
        shadow(screenSize[0] / 2, screenSize[1] / 2 + 20, 1, "DOUBLETAP", false, fonte, [0, 255, 255, 255], 10);
    }
    if(getVal(lagsync)){
        shadow(screenSize[0] / 2, screenSize[1] / 2 + 35, 1, "ZSYNC", false, fonte, [150, 0, 190, 255], 10);
        shadow(10, screenSize[1] / 2 + 30, 0, "YAW:", false, fonte, [0, 255, 0, 255], 8);
        shadow(45, screenSize[1] / 2 + 30, 0, (Local.GetRealYaw()) ? Local.GetRealYaw().toString() : "N/A", false, fonte, (Local.GetRealYaw() > 25) ? [0, 255, 0, 255] : [50, 155, 50, 255], 8);
    }
}

var last_yaw = 90;

function random(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function cm(){

    Exploit.OverrideShift(UI.GetValue.apply(null, shift));
    Exploit.OverrideTolerance(UI.GetValue.apply(null, tolerance));

    // setup match
    if(getVal(setmatch)){
        var commands = ["sv_cheats 1", "mp_ignore_round_win_conditions 1", "mp_limitteams 0", "mp_autoteambalance 0", "mp_respawn_on_death_ct 1", "mp_respawn_on_death_t 1", "mp_buytime 999999", "mp_buy_anywhere 1", "sv_infinite_ammo 1", "bot_stop 1", "bot_add_ct", "bot_add_ct", "bot_add_ct", "bot_add_ct", "mp_freezetime 1", "mp_maxmoney 65000", "mp_startmoney 65000", "mp_maxrounds 200"];
        for(i=0; i < commands.length; i++){
            Cheat.ExecuteCommand(commands[i]);
        }
        Set(setmatch, false);
    }
    // Tags
    if(getVal(usetag)){
		if(lastUpdate == 0) lastUpdate = Globals.Curtime();
		if((lastUpdate - Globals.Curtime()) < -0.5){
			updateTag();
		}
    }
    // lag sync
    if(getVal(lagsync)){
        if(UI.IsHotkeyActive("Anti-Aim", "Fake angles", "Inverter")){
            UserCMD.Choke();
            AntiAim.SetOverride(1);
            AntiAim.SetFakeOffset(30);
            AntiAim.SetRealOffset(-30);
            AntiAim.SetLBYOffset(90);
            
            //AntiAim.SetFakeOffset(Math.random() * (-30 - 1) - -15);
            UserCMD.Send();
        }
        else{
            UserCMD.Choke();
            AntiAim.SetOverride(1);
            AntiAim.SetFakeOffset(-30);
            AntiAim.SetRealOffset(30);
            AntiAim.SetLBYOffset(-90);
            //AntiAim.SetFakeOffset(Math.random() * (1 - 30) - 1);
            UserCMD.Send();
        }
    }
    else{
        AntiAim.SetOverride(0);
    }

}

function onFSN(){
	
}

Cheat.RegisterCallback("onFrameStageNotify", "onFSN");
Cheat.RegisterCallback("Draw", "draw");
Cheat.RegisterCallback("CreateMove", "cm");