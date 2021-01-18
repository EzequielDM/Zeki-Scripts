//#region UI Items

//#region Indicators Tab
UI.AddSubTab(["Visuals", "SUBTAB_MGR"], "ZSense Indicators");
UI.AddSubTab(["Misc.", "SUBTAB_MGR"], "Debug");
UI.AddSubTab(["Rage", "SUBTAB_MGR"], "Debug");
UI.AddSubTab(["Misc.", "SUBTAB_MGR"], "ZSense");

// Visuals tab
const bIndicators = UI.AddCheckbox(["Visuals", "ZSense Indicators", "ZSense Indicators"], "Enable indicators");
const bWatermark = UI.AddCheckbox(["Visuals", "ZSense Indicators", "ZSense Indicators"], "Enable watermark");

// Misc. debug tab
const bKillAllies = UI.AddCheckbox(["Misc.", "Debug", "Debug"], "Kill allies");
const bDebug = UI.AddCheckbox(["Misc.", "Debug", "Debug"], "Debug mode");
const bHitsay = UI.AddCheckbox(["Misc.", "Debug", "Debug"], "Hitsay");
const bServerside = UI.AddCheckbox(["Misc.", "Debug", "Debug"], "Serverside");
const bInvertedServerside = UI.AddCheckbox(["Misc.", "Debug", "Debug"], "Inverted Serverside");
const sServersideDamage = UI.AddSliderFloat(["Misc.", "Debug", "Debug"], "Serverside damage factor", 0, 1);

// Misc. tab
const bChatFilter = UI.AddCheckbox(["Misc.", "ZSense", "ZSense"], "Chat filter");
const bClantag = UI.AddDropdown(["Misc.", "ZSense", "ZSense"], "Clantag", ["none", "GROßERNAME\'", "nyaahook!", "skeetchen"], 1);
const bRanks = UI.AddCheckbox(["Misc.", "ZSense", "ZSense"], "Rank spam");

// Rage tab
const bRageLogs = UI.AddCheckbox(["Rage", "Debug", "Debug"], "Ragebot logs");

// Default anti aim tab
const bLegSpam = UI.AddCheckbox(["Rage", "Anti Aim", "Directions"], "Leg Spammer");

//#endregion

//#endregion

//#region Global Variables
const colors = {
	RED: [255, 0, 0, 255],
	GREEN: [0, 255, 0, 255],
	BLUE: [0, 0, 255, 255],
	PURPLE: [128, 0, 128, 255],
	MAIN_GRAY: [64, 64, 64, 255],
	MAIN_ACCENT: [33, 194, 76, 255]
};

// Welcome message variables
const welcome_draw = false;
const welcome_last = 0;
const welcome_alpha = 255;

// Ragebot logs
const rb_hit = false;
const hitinfo = {};

// Server side variables
const serverside_active = false;
const serverside_scale = 0;
const serverside_inverted = false;

// ChatFilter System
const cf_last = 2;

// Leg spam counter
const ls_counter = 0;

// Clantag last
const clantag_last = 0;

const rank_message = "";


const hitsays = [
    "aimjunkies?!", "astonishing gaming chair", "u shoot, u miss", "nice uid issue", "nice brain issue", "skeet resolver sucks, turn it off",
    "try to shoot my head", "astonishing uid issue", "astonishing negative iq", "nice gaming chair", "astonishing gaming chair",
    "crazy config", "nice resolver, u sell?", "do u sell that brain?", "nice iq, u sell?", "awesome gaming carpet", "nice fucking death", "good vip hack", "u sell that vip hack?",
    "refund please", "u pay for that vip hack?!", "nice copy paste", "nice paste, u sell?", "plz give gamesense", "plz give vip hack", "nice fucking osiris", "xDDDDDDD that osiris",
    "xDDDDDDD that gamesense", "xDDDDDDD that screen capture", "send me download link for that awesome skin changer", "xDDDDDDD that mother", "shit pasta", "pls give negative iq",
    "astonishing imaginary girlfriend", "u pay for that config?", "u sell that playstyle", "plz give settings", "xaNe movements", "xDDDDDDD that imaginary girlfriend",
    "daered config?!", "imagine being so bad", "is it u lucky?", "omg how are you so good?", "please send dll for that skin changer", "send dll for that vip hack", "crazy visuals"
];

const headsay = [
    "beautiful head of yours", "hide your head", "vip antiaim", "refund that antiaim", "nice vip antiaim", "nice antiaim, u sell?"
];

const toesay = [
    "hmmm those nails", "those toes look yummy", "jump bitch, jump"
];
//#endregion

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1));
}

function getHitboxName(int) {
    const hitboxes = [
        "HEAD", "NECK", "PELVIS", "BODY", "THORAX", "LEFT THIGH", "RIGHT THIGH", "LEFT CALF", "RIGHT CALF", "LEFT FOOT", "RIGHT FOOT", "LEFT HAND", "RIGHT HAND",
        "LEFT UPPER ARM", "LEFT FOREARM", "RIGHT UPPER ARM", "RIGHT FOREARM"
    ];

    if (int > (hitboxes.length - 1))
        return "GENERIC";
    
    return hitboxes[int];
}

function cheatsOn() {
    const element = ["Misc.", "Helpers", "Client", "Force sv_cheats"];

    if (UI.GetValue(element)) {
        return true;
    } else {
        return false;
    }
}

//#region - Callbacks -

function cm() {

    const localplayer = Entity.GetLocalPlayer();

    if (UI.GetValue(bRanks)) {
        Cheat.ExecuteCommand("say " + rank_message);
        UI.SetValue(bRanks, 0);
    }

    //#region Server side system
    if (UI.GetValue(bServerside)) {
        if (Entity.GetProp(localplayer, "CBasePlayer", "m_iHealth") < 60) {
            const team = Entity.GetProp(localplayer, "CBasePlayer", "m_iTeamNum");
            const command = "";
            const command2 = "";

            if (serverside_scale != UI.GetValue(sServersideDamage).toFixed(2)) {
                serverside_active = false;
            }

            if (serverside_inverted != UI.GetValue(bInvertedServerside)) {
                serverside_active = false;
            }

            if (UI.GetValue(bInvertedServerside)) {
                serverside_scale = UI.GetValue(sServersideDamage).toFixed(2);
                serverside_inverted = true;
                command = "mp_damage_scale_" + (team == 2 ? "ct" : "t") + "_body " + serverside_scale;
                command2 = "mp_damage_scale_" + (team == 2 ? "ct" : "t") + "_head " + serverside_scale;
            } else {
                serverside_scale = UI.GetValue(sServersideDamage).toFixed(2);
                serverside_inverted = false;
                command = "mp_damage_scale_" + (team == 2 ? "t" : "ct") + "_body " + serverside_scale;
                command2 = "mp_damage_scale_" + (team == 2 ? "t" : "ct") + "_head " + serverside_scale;
            }
            if (!serverside_active) {
                Cheat.ExecuteCommand(command);
                Cheat.ExecuteCommand(command2);
                serverside_active = true;
            }
        } else {
            if (serverside_active) {
                const commands = ["mp_damage_scale_ct_body 1", "mp_damage_scale_ct_head 1", "mp_damage_scale_t_body 1", "mp_damage_scale_t_head 1"];
                for (e in commands) {
                    Cheat.ExecuteCommand(commands[e]);
                }
                serverside_active = false;
            }
            
        }
    } else {
        if (serverside_active) {
            const commands = ["mp_damage_scale_ct_body 1", "mp_damage_scale_ct_head 1", "mp_damage_scale_t_body 1", "mp_damage_scale_t_head 1"];
                for (e in commands) {
                    Cheat.ExecuteCommand(commands[e]);
                }
                serverside_active = false;
        }
    }
    //#endregion

    //#region Chat filter system
    if (UI.GetValue(bChatFilter) != cf_last || cf_last == 2) {
        cf_last = UI.GetValue(bChatFilter);
        if (UI.GetValue(bChatFilter)) {
            Cheat.ExecuteCommand("cl_chatfilters 0");
        }
        else {
            Cheat.ExecuteCommand("cl_chatfilters 63");
        }
    }
    //#endregion

    //#region Leg Spammer
    if (UI.GetValue(bLegSpam)) {
        const current = UI.GetValue(["Misc.", "Movement", "General", "Leg movement"]);
        if (ls_counter == 0 || Globals.Curtime() > ls_counter + 0.05) {
            if (current == 0 || current == 1) {
                UI.SetValue(["Misc.", "Movement", "General", "Leg movement"], 2);
            } else {
                UI.SetValue(["Misc.", "Movement", "General", "Leg movement"], 1);
            }
            ls_counter = Globals.Curtime();
        }
    }
    //#endregion

    
}

function draw() {
	// Welcome message
	if (welcome_draw) {
		const font = Render.AddFont("Verdana.ttf", 12, 500);
		if (welcome_last == 0) {
			Render.String(5, 5, 0, "Welcome, " + Cheat.GetUsername(), [35, 217, 208, welcome_alpha], font);
			welcome_last = Globals.Curtime();
		} else { 
			if (welcome_alpha <= 0) {
				welcome_draw = false;
			} else if (Globals.Curtime() > welcome_last + 0.2) {
				welcome_alpha -= 25;
				welcome_last = Globals.Curtime();
			}
			if (welcome_alpha > 0) {
				Render.String(5, 5, 0, "Welcome, " + Cheat.GetUsername(), [35, 217, 208, welcome_alpha], font);
			}
		}
	}

	// Watermark
	if (UI.GetValue(bWatermark)) {
		UI.SetValue(["Misc.", "Helpers", "SHEET_MGR", "General", "Watermark"], 0);
        const date_obj = new Date();
		const font = Render.AddFont("Verdana.ttf", 12, 500);
		const date = (date_obj.getHours() < 10) ? "0" : "" + date_obj.getHours() + ":" + (date_obj.getMinutes() < 10) ? "0" : "" + date_obj.getMinutes();
		const text = "ZSense [DEV] | " + Cheat.GetUsername() + " | " +  date;
		const text_size = Render.TextSize(text, font);
		const screen = {
			x: Render.GetScreenSize()[0],
			y: Render.GetScreenSize()[1]
		};
		Render.String(screen.x - text_size[0] - 5, 5, 0, text, colors.MAIN_ACCENT, font);
    }
    
    if (serverside_active) {
        const font = Render.AddFont("Verdana.ttf", 20, 800);
        Render.String(5, 450, 0, "SERVERSIDE (" + serverside_scale + ")", colors.RED, font);
    }

}

function round_freeze_end() {
    if (UI.GetValue(bKillAllies)) {
        const team = Entity.GetTeammates();
        for (e in team) {
            const name = Entity.GetName(team[e]);
            if (Entity.IsLocalPlayer(team[e]))
                continue;
            if (!Entity.IsAlive(team[e]))
                continue;
            Cheat.ExecuteCommand("kill " + name);
        }
    }
}

function player_hurt() {
    if (!UI.GetValue(bHitsay))
        return;
    const user = Entity.GetEntityFromUserID(Event.GetInt("userid"));
    const atk = Entity.GetEntityFromUserID(Event.GetInt("attacker"));
    const hitgroup = Event.GetString("hitgroup");
    if (Entity.IsLocalPlayer(user) || !Entity.IsLocalPlayer(atk))
        return;
    const message = getRandomInt(0, hitsays.length - 1);
    Cheat.ExecuteCommand("say " + hitsays[message]);
    if (UI.GetValue(bDebug)) {
        Cheat.PrintColor(colors.PURPLE, "[ZSense Debug] - Hitsay ID: " + message + " | Hitsay Message: " + hitsays[message] + " | Hitsay Length: " + hitsays.length + "\n");
    }
}

function ragebot_fire() {
    const target = Event.GetInt("target_index");
    const hitbox = Event.GetInt("hitbox");
    const hitchance = Event.GetInt("hitchance");
    const safepoint = Event.GetInt("safepoint");
    const exploit = Event.GetInt("exploit");
    const name = Entity.GetName(target);
    const hitbox_name = getHitboxName(hitbox);

    Cheat.PrintColor(colors.GREEN, "[ZSense Debug] - Shot at ");
    Cheat.PrintColor(colors.RED, name + "");
    Cheat.PrintColor(colors.GREEN, " on ");
    Cheat.PrintColor(colors.PURPLE, hitbox_name + " ");
    Cheat.PrintColor(colors.GREEN, "(");
    Cheat.PrintColor((safepoint == 1) ? colors.GREEN : colors.RED, (safepoint == 1) ? "SAFEPOINT " : "UNSAFE ");
    Cheat.PrintColor(colors.PURPLE, "| ");
    Cheat.PrintColor((exploit > 0) ? colors.GREEN : colors.RED, (exploit > 0) ? "EXPLOIT" : "NONE");
    Cheat.PrintColor(colors.GREEN, ")\n");
}

function ragebot_hit() {
    const hit = Event.GetInt("userid");
    const atk = Event.GetInt("attacker");
    const hitgroup = Event.GetInt("hitgroup");
    const damage = Event.GetInt("dmg_health");
    const health = Event.GetInt("health");
    const phit = Entity.GetEntityFromUserID(hit);
    const patk = Entity.GetEntityFromUserID(atk);
    const hitname = Entity.GetName(phit);
    const hitboxname = getHitboxName(hitgroup);

    if (phit == patk || Entity.IsTeammate(phit) || Entity.IsLocalPlayer(phit) || !Entity.IsLocalPlayer(patk))
        return;
    
    rb_hit = true;
    hitinfo = {
        hitbox: hitgroup,
        damage: damage
    };

    Cheat.PrintColor(colors.GREEN, "[ZSense Debug] - Hit ");
    Cheat.PrintColor(colors.RED, hitname + " ");
    Cheat.PrintColor(colors.GREEN, "for ");
    Cheat.PrintColor(colors.RED, damage + " HP ");
    Cheat.PrintColor(colors.GREEN, "on ");
    Cheat.PrintColor(colors.PURPLE, hitboxname + " ");
    Cheat.PrintColor(health > 0 ? colors.GREEN : colors.RED, "(" + health + "HP left) \n");
}

function commandListener() {
    const text = Event.GetString("text");

    if (text == "!testchat") {
        Cheat.PrintChat("Test 1263");
        return;
    }
    if (text == "!steamdata") {
        const table = Entity.SetProp(Entity.GetLocalPlayer(), "CCSPlayerResource", "m_iCompetitiveRanking", 18);
        Cheat.PrintChat(" \x02" + table + "");
        return;
    }

}

function clantag() {
    if (UI.GetValue(bClantag) > 0) {
        switch (UI.GetValue(bClantag)) {
            case 1:
                Local.SetClanTag("GROßERNAMER'");
                break;
            case 2:
                var now = Math.round(Globals.Curtime() * 3);
                const clantag = ["", "n", "ny", "nya", "nyaa", "nyaah", "nyaaho", "nyaahoo", "nyaahook", "NYAAHOOK!", "nyaahook", "nyaahook!", "nyaahook", "nyaahook!", "nyaahok! ", "nyaahok!  ", "nyaahok!   "];
                if (now == clantag_last) return;

                last_time = now;
                const index = Math.round(now % clantag.length);
                Local.SetClanTag(clantag[index]);
                break;
        }
    }
}

function player_join() {
    const userid = Event.GetInt("userid");
    const ent = Entity.GetEntityFromUserID(userid);
    const ranks = ["Unranked", "Silver 1", "Silver 2", "Silver 3", "Silver 4", "Silver Elite", "Silver Elite Master", "GN 1", "GN 2", "GN 3", "GN Master", "MG 1", "MG 2", "MGE", "DMG", "LE", "LEM", "Supreme", "Global Elite"];
    const rank_name = ranks[Entity.GetProp(ent, "CCSPlayerResource", "m_iCompetitiveRanking")];
    const wins = Entity.GetProp(ent, "CCSPlayerResource", "m_iCompetitiveWins");
    rank_message =  "" + Entity.GetName(ent) + " - RANK: " + rank_name + " | WINS: " + wins;
    Cheat.PrintColor([255, 255, 0, 255], "" +  Entity.GetName(ent) + " - RANK: " + rank_name + " | WINS: " + wins + "\n");
    Cheat.PrintChat(" \x05" + Entity.GetName(ent) + " - RANK: " + rank_name + " | WINS: " + wins);
}
//#endregion

function onLoad() {
	Cheat.RegisterCallback("CreateMove", "cm");
    Cheat.RegisterCallback("Draw", "draw");
    Cheat.RegisterCallback("round_freeze_end", "round_freeze_end");
    Cheat.RegisterCallback("player_hurt", "player_hurt");
    Cheat.RegisterCallback("ragebot_fire", "ragebot_fire");
    Cheat.RegisterCallback("player_hurt", "ragebot_hit");
    Cheat.RegisterCallback("player_say", "commandListener");
    Cheat.RegisterCallback("CreateMove", "clantag");
    Cheat.RegisterCallback("player_connect_full", "player_join");

	Cheat.ExecuteCommand("clear");
	Cheat.PrintColor(colors.GREEN, "[ZSense] - Script loaded successfully.\n");
	Cheat.PrintColor(colors.BLUE, "Welcome, ");
	Cheat.PrintColor((Cheat.GetUsername() == "NinjaOficial") ? colors.PURPLE : colors.BLUE, Cheat.GetUsername() + "\n");
	welcome_draw = true;
}

onLoad();