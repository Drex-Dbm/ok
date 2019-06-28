module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Run Script",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Other Stuff",

//---------------------------------------------------------------------
// DBM Add-Ons Infos (Optional)
//
// These are the informations about this mod.
//---------------------------------------------------------------------

// Who made the mod (Default: "DBM Add-Ons Mod Developer")
author: "ZockerNico",

// The version of the mod (Default: 1.0.0)
version: "1.0.0",

// A short description for this mod
short_description: "This action evaluates a script and stores the result & error.",

//---------------------------------------------------------------------

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	return `${data.code}`;
},

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function(data, varType) {
	const type = parseInt(data.storage);
	if(type !== varType) return;
	return ([data.varName, 'Unknown Type']);
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["behavior", "interpretation", "inspectation", "depth", "code", "storage", "varName", "storage2", "varName2"],

//---------------------------------------------------------------------
// Command HTML
//
// This function returns a string containing the HTML used for
// editting actions. 
//
// The "isEvent" parameter will be true if this action is being used
// for an event. Due to their nature, events lack certain information, 
// so edit the HTML to reflect this.
//
// The "data" parameter stores constants for select elements to use. 
// Each is an array: index 0 for commands, index 1 for events.
// The names are: sendTargets, members, roles, channels, 
//                messages, servers, variables
//---------------------------------------------------------------------

html: function(isEvent, data) {
	return `
<div style="width: 550px; height: 350px; overflow-y: scroll; overflow-x: hidden;">
	<div>
		<p>This action has been modified by DBM Add-Ons.</p>
	</div><br>
	<div style="padding-top: 8px;">
		Custom Code:<br>
		<textarea id="code" rows="14" name="is-eval" style="width: 99%; white-space: nowrap; resize: none;"></textarea>
	</div><br>
	<div>
		<div style="float: left; width: 45%;">
			End Behavior:<br>
			<select id="behavior" class="round">
				<option value="0" selected>Call Next Action Automatically</option>
				<option value="1">Do Not Call Next Action</option>
			</select>
		</div>
		<div style="padding-left: 5%; float: left; width: 50%;">
			Interpretation Style:<br>
			<select id="interpretation" class="round">
				<option value="0" selected>Evaluate Text First</option>
				<option value="1">Evaluate Text Directly</option>
			</select>
		</div>
	</div><br><br><br>
	<div>
		<div style="float: left; width: 35%;">
			Inspect Result:<br>
			<select id="inspectation" class="round" onchange="glob.onChange1(this)">
				<option value="0" selected>No Inspectation</option>
				<option value="1">Inspect Objects</option>
				<option value="2">Inspect Functions</option>
			</select>
		</div>
		<div id="depthContainer" style="float: right; width: 60%; display: none;">
			Depth:<br>
			<input id="depth" class="round" type="text" value="1">
		</div>
	</div><br><br><br>
	<div>
		<div style="float: left; width: 35%;">
			Store Result In:<br>
			<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
				${data.variables[0]}
			</select>
		</div>
		<div id="varNameContainer" style="display: none; float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text">
		</div>
	</div><br><br><br>
	<div>
		<div style="float: left; width: 35%;">
			Store Error In:<br>
			<select id="storage2" class="round" onchange="glob.onChange2(this)">
				${data.variables[0]}
				<option value="4" selected>Bot Log</option>
			</select>
		</div>
		<div id="varNameContainer2" style="display: none; float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName2" class="round" type="text">
		</div>
	</div><br><br><br>
</div>`
},

//---------------------------------------------------------------------
// Action Editor Init Code
//
// When the HTML is first applied to the action editor, this code
// is also run. This helps add modifications or setup reactionary
// functions for the DOM elements.
//---------------------------------------------------------------------

init: function() {
	const {glob, document} = this;

	glob.onChange1 = function() {
		const depthContainer = document.getElementById('depthContainer');
		switch(parseInt(document.getElementById('inspectation').value)) {
			default:
				depthContainer.style.display = 'none';
				break;
			case 1:
				depthContainer.style.display = null;
				break;
		}
	}

	glob.onChange2 = function() {
		const varNameContainer2 = document.getElementById('varNameContainer2');
		switch(parseInt(document.getElementById('storage2').value)) {
			case 0:
			case 4:
				varNameContainer2.style.display = 'none';
				break;
			default:
				varNameContainer2.style.display = null;
				break;
		}
	}

	glob.onChange1(document.getElementById('inspectation'));
	glob.onChange2(document.getElementById('storage2'));
	glob.variableChange(document.getElementById('storage'), 'varNameContainer');
},

//---------------------------------------------------------------------
// Action Bot Function
//
// This is the function for the action within the Bot's Action class.
// Keep in mind event calls won't have access to the "msg" parameter, 
// so be sure to provide checks for variable existance.
//---------------------------------------------------------------------

action: function(cache) {
	const data = cache.actions[cache.index];
	const DBM = this.getDBM();

	const tempVars = this.getActionVariable.bind(cache.temp);
	if(cache.server) {
		const serverVars = this.getActionVariable.bind(this.server[cache.server.id]);
	} else {
		const serverVars = null;
	}
	const globalVars = this.getActionVariable.bind(this.global);

	const msg = cache.msg;
	const server = cache.server;
	const client = DBM.Bot.bot;
	const bot = DBM.Bot.bot;
	const me = server ? server.me : null;
	
	if(msg) {
		const user = msg.author;
		const member = msg.member;
		if(msg.mentions) {
			const mentionedUser = msg.mentions.users.first() || '';
			const mentionedChannel = msg.mentions.channels.first() || '';
		}
	}
	if(server) {
		const defaultChannel = server.getDefaultChannel();
	}

	let code;
	switch(parseInt(data.interpretation)) {
		default:
			code = this.evalMessage(data.code, cache);
			break;
		case 1:
			code = data.code;
			break;
	}

	let result;
	let error;
	try {
		result = eval(code);
	} catch(e) {
		error = e;
	}

	
	const varName = this.evalMessage(data.varName, cache);
	const storage = parseInt(data.storage);
	const varName2 = this.evalMessage(data.varName2, cache);
	const storage2 = parseInt(data.storage2);

	if(result !== undefined) {
		switch(parseInt(data.inspectation)) {
			default:
				this.storeValue(result, storage, varName, cache);
				break;
			case 1:
				this.storeValue(this.getAddOns().require('util').inspect(result, {depth: (parseInt(data.depth) > 0 ? parseInt(data.depth) : 1)}), storage, varName, cache);
				break;
			case 2:
				this.storeValue(result.toString(), storage, varName, cache);
				break;
		}
	}
	if(error !== undefined) {
		storage2 == 4 ? console.error(error) : this.storeValue(error, storage2, varName2, cache);
	}
	if(parseInt(data.behavior) == 0) {
		this.callNextAction(cache);
	}
},

//---------------------------------------------------------------------
// Action Bot Mod
//
// Upon initialization of the bot, this code is run. Using the bot's
// DBM namespace, one can add/modify existing functions if necessary.
// In order to reduce conflictions between mods, be sure to alias
// functions you wish to overwrite.
//---------------------------------------------------------------------

mod: function(DBM) {
}

}; // End of module