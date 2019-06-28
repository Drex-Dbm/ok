module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Edit/Convert Text",

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
	short_description: "This action allows you to edit / convert texts in any way.",

	//---------------------------------------------------------------------
	
	//---------------------------------------------------------------------
	// Action Subtitle
	//
	// This function generates the subtitle displayed next to the name.
	//---------------------------------------------------------------------

	subtitle: function (data) {
		const actions = {
			"split": "Split",
			"slice": "Slice",
			"replace": "Replace",
			"uppercase": "To Uppercase",
			"lowercase": "To Lowercase",
			"randomize": "Randomize Upper- and Lowercase",
			"number": "To Number"
		};
		return `Edit Text | ${actions[data.action]}`;
	},

	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		let dataType = 'Unknown Type';
		switch(data.action) {
			case 'split':
				dataType = 'List';
				break;
			default:
				dataType = 'Text';
				break;
		}
		return ([data.varName, dataType]);
	},

	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------

	fields: ["text", "action", "value1", "value2", "storage", "varName"],

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

	html: function (isEvent, data) {
		return `
	<div style="width: 550px; height: 350px; overflow-y: scroll; overflow-x: hidden;">
		<div>
			<p>
			Made by ${this.author}.
			</p>
		</div><br>
		<div style="padding-top: 8px;">
			Text:<br>
			<textarea id="text" rows="7" placeholder="Insert your text here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
		</div><br>
		<div style="padding-top: 8px;">
			Action:<br>
			<select id="action" class="round" style="float: left; width: 80%;" onchange="glob.onChange(this)">
				<option value="split">Split</option>
				<option value="slice">Slice</option>
				<option value="replace">Replace</option>
				<option value="uppercase">To Uppercase</option>
				<option value="lowercase">To Lowercase</option>
				<option value="randomize">Randomize Upper- and Lowercase</option>
				<option value="number">To Number</option>
			</select>
		</div><br><br>
		<div style="padding-top: 8px;">
			<div id="valueContainer1" style="float: left; width: 50%;">
				<span id="tempName1">From</span>:<br>
				<input id="value1" class="round" type="text" placeholder="">
			</div>
			<div id="valueContainer2" style="float: right; width: 50%;">
				<span id="tempName2">To</span>:<br>
				<input id="value2" class="round" type="text" placeholder="">
			</div>
		</div>
		<div style="padding-top: 8px;"><br><br><br>
			<div style="float: left; width: 35%;">
				Store In:<br>
				<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
					${data.variables[1]}
				</select>
			</div>
			<div id="varNameContainer" style="float: right; width: 60%;">
				Variable Name:<br>
				<input id="varName" class="round" type="text"><br>
			</div>
		</div>
	</div>`
	},

	//---------------------------------------------------------------------
	// Action Editor Init Code
	//
	// When the HTML is first applied to the action editor, this code
	// is also run. This helps add modifications or setup reactionary
	// functions for the DOM elements.
	//---------------------------------------------------------------------

	init: function () {
		const { glob, document } = this;
		var active1 = false;
		var status1 = 0;
		var active2 = false;
		var status2 = 0;
		var active3 = false;
		var status3 = 0;

		function display1() {
			active1 = true;
			var value1 = document.getElementById('value1');
			var value2 = document.getElementById('value2');
			switch(status1) {
				case 2:
					value1.placeholder = 'Text';
					value2.placeholder = 'Number';
					break;
				case 1:
					value1.placeholder = 'Word';
					value2.placeholder = 'Number';
					break;
				default:
					value1.placeholder = 'Letter';
					value2.placeholder = 'Number';
					break;
			}
			setTimeout(function() {
				if(document.getElementById('action').value == 'split') {
					status1 == 2 ? status1 = 0 : status1++;
					display1();
				} else {
					active1 = false;
					status1 = 0;
					switch(document.getElementById('action').value) {
						case 'slice':
						case 'replace':
							break;
						default:
							value1.placeholder = '';
							value2.placeholder = '';
							break;
					}
				}
			}, 1500);
		}
		function display2() {
			active2 = true;
			var value1 = document.getElementById('value1');
			var value2 = document.getElementById('value2');
			switch(status2) {
				case 2:
					value1.placeholder = 'Optional';
					value2.placeholder = 'Number';
					break;
				case 1:
					value1.placeholder = 'Number';
					value2.placeholder = 'Optional';
					break;
				default:
					value1.placeholder = 'Number';
					value2.placeholder = 'Number';
					break;
			}
			setTimeout(function() {
				if(document.getElementById('action').value == 'slice') {
					status2 == 2 ? status2 = 0 : status2++;
					display2();
				} else {
					active2 = false;
					status2 = 0;
					switch(document.getElementById('action').value) {
						case 'split':
						case 'replace':
							break;
						default:
							value1.placeholder = '';
							value2.placeholder = '';
							break;
					}
				}
			}, 1500);
		}
		function display3() {
			active3 = true;
			var value1 = document.getElementById('value1');
			var value2 = document.getElementById('value2');
			switch(status3) {
				case 1:
					value1.placeholder = 'x';
					value2.placeholder = 'y';
					break;
				default:
					value1.placeholder = 'a';
					value2.placeholder = 'b';
					break;
			}
			setTimeout(function() {
				if(document.getElementById('action').value == 'replace') {
					status3 == 1 ? status3 = 0 : status3++;
					display3();
				} else {
					active3 = false;
					status3 = 0;
					switch(document.getElementById('action').value) {
						case 'split':
						case 'slice':
							break;
						default:
							value1.placeholder = '';
							value2.placeholder = '';
							break;
					}
				}
			}, 1500);
		}

		glob.onChange = function() {
			const valueContainer1 = document.getElementById('valueContainer1');
			const valueContainer2 = document.getElementById('valueContainer2');
			var tempName1;
			var tempName2;
			switch(document.getElementById('action').value) {
				case 'split':
					valueContainer1.style.display = null;
					valueContainer2.style.display = null;
					if(!active1) {
						display1();
					}
					tempName1 = 'Text';
					tempName2 = 'Limit';
					break;
				case 'slice':
					valueContainer1.style.display = null;
					valueContainer2.style.display = null;
					if(!active2) {
						display2();
					}
					tempName1 = 'From';
					tempName2 = 'To';
					break;
				case 'replace':
					valueContainer1.style.display = null;
					valueContainer2.style.display = null;
					if(!active3) {
						display3();
					}
					tempName1 = 'This';
					tempName2 = 'To That';
					break;
				case 'uppercase':
					valueContainer1.style.display = 'none';
					valueContainer2.style.display = 'none';
					break;
				case 'lowercase':
					valueContainer1.style.display = 'none';
					valueContainer2.style.display = 'none';
					break;
				case 'randomize':
					valueContainer1.style.display = 'none';
					valueContainer2.style.display = 'none';
					break;
				case 'number':
					valueContainer1.style.display = 'none';
					valueContainer2.style.display = 'none';
					break;
			}
			document.getElementById('tempName1').innerHTML = tempName1;
			document.getElementById('tempName2').innerHTML = tempName2;
		}

		glob.onChange(document.getElementById('action'));
		glob.variableChange(document.getElementById('storage'), 'varNameContainer');
	},

	//---------------------------------------------------------------------
	// Action Bot Function
	//
	// This is the function for the action within the Bot's Action class.
	// Keep in mind event calls won't have access to the "msg" parameter,
	// so be sure to provide checks for variable existance.
	//---------------------------------------------------------------------

	action: function (cache) {
		const data = cache.actions[cache.index];
		const text = this.evalMessage(data.text, cache);
		const val1 = this.evalMessage(data.value1, cache);
		const val2 = this.evalMessage(data.value2, cache);

		if(text !== undefined && text !== '') {
			var result;
			switch(data.action) {
				case 'split':
					result = parseInt(val2) >= 0 ? text.split(val1, val2) : text.split(val1);
					break;
				case 'slice':
					if(parseInt(val1) >= 0 && parseInt(val2) >= 0) {
						result = text.slice(val1, val2);
					} else if(parseInt(val1) >= 0) {
						result = test.slice(val1);
					} else if(parseInt(val2) >= 0) {
						result = test.slice(0, val2);
					} else {
						result = text;
					}
					break;
				case 'replace':
					const replaceString = this.getAddOns().require('replace-string');
					result = replaceString(text, val1, val2);
					break;
				case 'uppercase':
					result = text.toUpperCase();
					break;
				case 'lowercase':
					result = text.toLowerCase();
					break;
				case 'randomize':
					list = [];
					for(var loop = 0; loop < text.length; loop++) {
						Math.round(Math.random(0)*1) == 0 ? list.push(text[loop].toLowerCase()) : list.push(text[loop].toUpperCase());
					}
					result = list.join('');
					break;
				case 'number':
					result = parseFloat(text) === NaN ? parseInt(text) : parseFloat(text);
					break;
			}
	
			if(result !== undefined) {
				const storage = parseInt(data.storage);
				const varName = this.evalMessage(data.varName, cache);
				this.storeValue(result, storage, varName, cache);
			}
		}
		this.callNextAction(cache);
	},

	//---------------------------------------------------------------------
	// Action Bot Mod
	//
	// Upon initialization of the bot, this code is run. Using the bot's
	// DBM namespace, one can add/modify existing functions if necessary.
	// In order to reduce conflictions between mods, be sure to alias
	// functions you wish to overwrite.
	//---------------------------------------------------------------------

	mod: function (DBM) {
	}

} // End of module