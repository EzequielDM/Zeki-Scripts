UI.AddLabel("         Semi-Rage Helper");
const hk_semirage = UI.AddHotkey("Switch legit to semi");
const hk_autowall = UI.AddHotkey("Enable autowall");
UI.AddLabel("");
const s_scouthc = UI.AddSliderInt("Scout hitchance", 0, 100);
const s_awphc = UI.AddSliderInt("AWP hitchance", 0, 100);
const s_autohc = UI.AddSliderInt("Auto hitchance", 0, 100);
const s_pistolhc = UI.AddSliderInt("Pistol hitchance", 0, 100);
const s_genhc = UI.AddSliderInt("General hitchance", 0, 100);
UI.AddLabel("");
const c_noscope = UI.AddCheckbox("Legit | Noscope hitchance");
const s_noscope = UI.AddSliderInt("Noscope hitchance", 0, 100);
const c_headdot = UI.AddCheckbox("Legit | Head dot");
const cp_headdot = UI.AddColorPicker("Head dot color");
const c_headdotbt = UI.AddCheckbox("Legit | Head dot backtrack");
const cp_headdotbt = UI.AddColorPicker("Head dot backtrack color");


// Presets
var data = {
	mode: "legit",
	active_keybinds: ["", ""]
};
// Enemies positions and backtrack
/**
 * @args1 - ent_id
 * @args2 - coords
 * @args3 - time
 */
var positions = {
	3: {
		pos: [
			[1, 1, 1],
			[2, 2, 2]
		],
		time: 23986.23
	}
};

// Get active mode
function getActiveMode() {
	return UI.GetValue("Legit", "GENERAL", "General", "Enabled") ? "legit" : "semi";
}

// Handle visibility function
function handleVis() {
	UI.SetEnabled.apply(null, s_noscope.concat(get(c_noscope)));
	UI.SetEnabled.apply(null, cp_headdot.concat(get(c_headdot)));
	UI.SetEnabled.apply(null, c_headdotbt.concat(get(c_headdot)));
	UI.SetEnabled.apply(null, cp_headdotbt.concat(get(c_headdotbt)));
}

// Get value function
function get(val) {
	return UI.GetValue.apply(null, val);
}

// Returns the player's current weapon type
function getCurrentWeaponCat(weapon) {
	const wp_name = Entity.GetName(weapon);
	switch (wp_name) {
		case "p2000":
		case "dual berettas":
		case "p250":
		case "tec 9":
		case "cz75 auto":
		case "five seven":
		case "usp s":
		case "glock 18":
			return "PISTOL";
		case "r8 revolver":
		case "desert eagle":
			return "HEAVY PISTOL";
		case "ssg 08":
			return "SCOUT";
		case "awp":
			return "AWP";
		case "g3sg1":
		case "scar 20":
			return "AUTOSNIPER";
		default:
			return "GENERAL";
	}
}

// Get distance function
function getDistance(a, b) {
	x = a[0] - b[0];
	y = a[1] - b[1];
	z = a[2] - b[2];
	return Math.sqrt(x * x + y * y + z * z);
}

// Stores head dot positions for enemies
function registerHeadDotPos(local, max_bt, max_dist) {
	const enemies = Entity.GetEnemies();
	const now = Globals.Tickcount();
	const max_ticks = Math.floor(max_bt / 15.625);
	for (e in enemies) {
		if (Entity.IsDormant(enemies[e]) || !Entity.IsAlive(enemies[e])) {
			if (positions[enemies[e]]) {
				delete positions[enemies[e]];
				continue;
			}
			continue;
		}
		const headpos = Entity.GetHitboxPosition(enemies[e], 0);
		if (!positions[enemies[e]].pos) {
			Cheat.PrintChat("Parsed");
			positions[enemies[e]] = {
				pos: [headpos],
				time: now
			}
			continue;
		}
		/*if (positions[enemies[e]].pos.length > max_ticks) {
			delete positions[enemies[e]].pos[0];
			positions[enemies[e]].pos.push(headpos);
		}
		positions[enemies[e]].pos.push(headpos);
		Cheat.PrintChat("Parsed " + positions[enemies[e]].pos);*/
	}
}

function cm() {
	// Handle visibility
	handleVis();
	// Set active mode
	data.mode = getActiveMode();

	// Hotkeys

	// Semirage hotkey
	if (UI.IsHotkeyActive.apply(null, hk_semirage)) {
		UI.SetValue("Legit", "GENERAL", "General", "Enabled", false);
		UI.SetValue("Rage", "GENERAL", "General", "Enabled", true);
	} else {
		UI.SetValue("Legit", "GENERAL", "General", "Enabled", true);
		UI.SetValue("Rage", "GENERAL", "General", "Enabled", false);
	}

	// Autowall hotkey
	if (UI.IsHotkeyActive.apply(null, hk_autowall)) {
		UI.SetValue("Rage", "GENERAL", "Disable autowall", false);
		UI.SetValue("Rage", "PISTOL", "Disable autowall", false);
		UI.SetValue("Rage", "HEAVY PISTOL", "Disable autowall", false);
		UI.SetValue("Rage", "SCOUT", "Disable autowall", false);
		UI.SetValue("Rage", "AWP", "Disable autowall", false);
		UI.SetValue("Rage", "AUTOSNIPER", "Disable autowall", false);
		data.active_keybinds[0] = "awall";
	} else {
		UI.SetValue("Rage", "GENERAL", "Disable autowall", true);
		UI.SetValue("Rage", "PISTOL", "Disable autowall", true);
		UI.SetValue("Rage", "HEAVY PISTOL", "Disable autowall", true);
		UI.SetValue("Rage", "SCOUT", "Disable autowall", true);
		UI.SetValue("Rage", "AWP", "Disable autowall", true);
		UI.SetValue("Rage", "AUTOSNIPER", "Disable autowall", true);
		data.active_keybinds[0] = "";
	}

	// Noscope hitchance
	if (get(c_noscope)) {
		data.active_keybinds[1] = "noscope";
		const local = Entity.GetLocalPlayer();
		const weapon_cat = getCurrentWeaponCat(Entity.GetWeapon(local));
		if (Entity.GetProp(local, "CCSPlayer", "m_bIsScoped")) {
			if (data.mode == "legit") {
				switch (weapon_cat) {
					case "PISTOL":
						UI.SetValue("Legit", "GENERAL", "Hitchance", get(s_pistolhc));
						break;
					case "SCOUT":
						UI.SetValue("Legit", "GENERAL", "Hitchance", get(s_scouthc));
						break;
					case "AUTOSNIPER":
						UI.SetValue("Legit", "GENERAL", "Hitchance", get(s_autohc));
						break;
					case "AWP":
						UI.SetValue("Legit", "GENERAL", "Hitchance", get(s_awphc));
						break;
					default:
						UI.SetValue("Legit", "GENERAL", "Hitchance", get(s_genhc));
						break;
				}
			} else {
				switch (weapon_cat) {
					case "SCOUT":
						UI.SetValue("Rage", "SCOUT", "Hitchance", get(s_scouthc));
						break;
					case "AWP":
						UI.SetValue("Rage", "AWP", "Hitchance", get(s_awphc));
						break;
					case "AUTOSNIPER":
						UI.SetValue("Rage", "AUTOSNIPER", "Hitchance", get(s_autohc));
						break;
					default:
						UI.SetValue("Rage", "GENERAL", "Hitchance", get(s_genhc));
						break;
				}
			}
		} else if (data.mode == "legit") {
			UI.SetValue("Legit", "GENERAL", "Hitchance", get(s_noscope));
		} else if (data.mode == "semi") {
			UI.SetValue("Rage", weapon_cat, "Hitchance", get(s_noscope));
		}
	} else {
		data.active_keybinds[1] = "";
	}

	if (get(c_headdotbt)) {
		maxbt = UI.GetValue("Legit", "GENERAL", "General", "Enabled") ? UI.GetValue("Legit", "GENERAL", "Maximum time") : 200;
		maxdist = UI.GetValue("Legit", "GENERAL", "General", "Enabled") ? UI.GetValue("Legit", "GENERAL", "Maximum distance") : 200;
		registerHeadDotPos(Entity.GetLocalPlayer(), maxbt, maxdist);
	}

	// Define hitchance
	if (data.mode == "legit" && !get(c_noscope)) {
		const weapon = Entity.GetWeapon(Entity.GetLocalPlayer());
		switch (getCurrentWeaponCat(weapon)) {
			case "PISTOL":
				UI.SetValue("Legit", "GENERAL", "Hitchance", get(s_pistolhc));
				break;
			case "SCOUT":
				UI.SetValue("Legit", "GENERAL", "Hitchance", get(s_scouthc));
				break;
			case "AUTOSNIPER":
				UI.SetValue("Legit", "GENERAL", "Hitchance", get(s_autohc));
				break;
			case "AWP":
				UI.SetValue("Legit", "GENERAL", "Hitchance", get(s_awphc));
				break;
			default:
				UI.SetValue("Legit", "GENERAL", "Hitchance", get(s_genhc));
				break;
		}
	}
	if (data.mode == "semi" && !get(c_noscope)) {
		const weapon = Entity.GetWeapon(Entity.GetLocalPlayer());
		const weapon_cat = getCurrentWeaponCat(weapon);
		switch (weapon_cat) {
			case "PISTOL":
				UI.SetValue("Rage", weapon_cat, "Hitchance", get(s_pistolhc));
				break;
			case "SCOUT":
				UI.SetValue("Rage", weapon_cat, "Hitchance", get(s_scouthc));
				break;
			case "AUTOSNIPER":
				UI.SetValue("Rage", weapon_cat, "Hitchance", get(s_autohc));
				break;
			case "AWP":
				UI.SetValue("Rage", weapon_cat, "Hitchance", get(s_awphc));
				break;
			default:
				UI.SetValue("Rage", weapon_cat, "Hitchance", get(s_genhc));
				break;
		}
	}
}

// Main Draw function
function draw() {
	// Draws active mode
	var fonte = Render.AddFont("Segoe UI Semibold", 8, 400);
	var sx = Render.GetScreenSize()[0] / 2;
	var sy = Render.GetScreenSize()[1] / 2;
	var colors = [
		[100, 0, 0, 255],
		[0, 100, 0, 255],
		[0, 0, 100, 255],
		[150, 150, 0, 255],
		[0, 150, 150, 255],
		[150, 0, 150, 255]
	]

	// Draw indicators
	drawIndicators(sx, sy, fonte, colors);

	// Draw head dot
	drawHeadDot2(UI.GetColor.apply(null, cp_headdot));
}

// New draw head dot
function drawHeadDot2(color) {
	registerHeadDotPos(Entity.GetLocalPlayer(), 200, 100);
	for (id in positions) {
		if (!positions[id]) continue;
		for (head in positions[id].pos) {
			head = positions[id].pos[head];
			l_head = Entity.GetHitboxPosition(Entity.GetLocalPlayer(), 0);
			w2s = Render.WorldToScreen(head);
			distance = getDistance(head, l_head);
			Render.FilledCircle(w2s[0], w2s[1], (1250 / distance), [255, 0, 0, 255]);
			Render.Circle(w2s[0], w2s[1], (1250 / distance), [255, 0, 0, 255]);
		}
	}
}

// Draw head dot function
function drawHeadDot(color) {
	// Draw head dot
	if (get(c_headdot)) {
		const enemies = Entity.GetEnemies();
		for (e in enemies) {
			if (!Entity.IsAlive(enemies[e]) || Entity.IsDormant(enemies[e])) continue;
			head = Entity.GetHitboxPosition(enemies[e], 0);
			l_head = Entity.GetHitboxPosition(Entity.GetLocalPlayer(), 0);
			w2s = Render.WorldToScreen(head);
			distance = getDistance(head, l_head);
			Render.FilledCircle(w2s[0], w2s[1], (1250 / distance), color);
			Render.Circle(w2s[0], w2s[1], (1250 / distance), color);
		}
	}
}

// Draw indicators
function drawIndicators(sx, sy, fonte, colors) {
	var last_sy = sy + 20;
	Render.StringCustom(sx + 1, sy + 11, 0, data.mode.toUpperCase(), [0, 0, 0, 255], fonte);
	Render.StringCustom(sx, sy + 10, 0, data.mode.toUpperCase(), (data.mode == "legit") ? [0, 100, 0, 255] : [200, 155, 0, 255], fonte);
	for (i in data.active_keybinds) {
		if (data.length < 2 & data.active_keybinds[0] == "") break;
		Render.StringCustom(sx + 1, last_sy + 1, 0, data.active_keybinds[i].toUpperCase(), [0, 0, 0, 255], fonte);
		Render.StringCustom(sx, last_sy, 0, data.active_keybinds[i].toUpperCase(), colors[i], fonte);
		last_sy += 10;
	}
}

function onLoad() {
	// Handle visibility function
	handleVis();

	// Callbacks
	Cheat.RegisterCallback("CreateMove", "cm");
	Cheat.RegisterCallback("Draw", "draw");
}
onLoad();