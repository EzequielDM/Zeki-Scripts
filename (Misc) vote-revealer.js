// Vote revealer
// Edited by Zeki#0001

// UI
const sayteam = UI.AddCheckbox("Send to team");
const sayall = UI.AddCheckbox("Send to all");

var options = []

function getVal(val) {
    return UI.GetValue.apply(null, val);
}

// Define the opts
function onVoteOptions() {
    options[0] = Event.GetString("option1")
    options[1] = Event.GetString("option2")
    options[2] = Event.GetString("option3")
    options[3] = Event.GetString("option4")
    options[4] = Event.GetString("option5")
}

// vote cast func
function onVoteCast() {
    var entid = Event.GetInt("entityid");
    if (entid) {
        var team = Event.GetInt("team");
        var option = Event.GetInt("vote_option");
        var name = Entity.GetName(entid);
        var chTeam = "null";
        // team checker fixed
        switch (team) {
            case 0:
                chTeam = "[N] ";
                break;
            case 1:
                chTeam = "[S] ";
                break;
            case 2:
                chTeam = "[T] ";
                break;
            case 3:
                chTeam = "[CT] ";
                break;
            default:
                chTeam = "[UNK] ";
                break;
        }

        var vote = options[option];
        Global.Print(chTeam + name + " voted " + vote + "\n");

        if (getVal(sayall)) {
            Cheat.ExecuteCommand("say " + chTeam + name + " voted " + vote);
        } else if (getVal(sayteam)) {
            Cheat.ExecuteCommand("say_team " + chTeam + name + " voted " + vote);
        } else {
            Global.PrintChat(chTeam + name + " voted " + vote);
        }

    }
}
Global.RegisterCallback("vote_options", "onVoteOptions");
Global.RegisterCallback("vote_cast", "onVoteCast");