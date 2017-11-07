//event launcher. seperate file for ease of reading
//Events always contain two values:
//The type of the event, like a message or value change
//Value that is supposed to be changed
//Also says when the event should be launched
//{name:"",value:"",when:""}
//Look, there's a reason I warned you not to try and make updates to this thing. It won't be easy. o_O

function launchEvent(event, amount) {
	try {
	if(event.when !== amount || event.when === -1) return event;
	if(event.launched) return event;
	switch (event.type) {
		case "message": {
			newMessage(event);
			break;
		}
		case "newtab": {
			editTab(event);
			break;
		}
		case "achieve": {
			achieve(event, true);
			break;
		}
		default: {
			console.warn("Cannot launch event with type: "+event.type);
		}
	}
	if (event.change !== undefined) {
		launchChange(event.change);
	}
	event.launched = true;
	}catch(e){console.log(e)}
	return event;
}

function launchChange(change) {
	if(Object.getOwnPropertyNames(change).length < 4) return console.warn("Does not have correct number of change attributes");
	if(change.high === "gameStats") {
		switch (change.operation) {
			case "multiply": {
				window.gameStats[change.what][change.which] = window.gameStats[change.what][change.which]*change.by;
				break;
			}
			case "divide": {
				window.gameStats[change.what][change.which] = window.gameStats[change.what][change.which]/change.by;
				break;
			}
			case "add": {
				window.gameStats[change.what][change.which] += change.by;
				break;
			}
			case "subtract": {
				window.gameStats[change.what][change.which] -= change.by;
				break;
			}
			default: {
				console.warn("Cannot launch change with operation: "+change.operation);
			}
		}
		if (change.what ==="workincrements") {
			document.getElementById(change.which+"count").title = window.gameStats[change.what][change.which]+" per second";
		}
	}
	else if(change.high === "buildings") {
		var building;
		for (var i=0;i<window.buildings.length;i++) {
			if(window.buildings[i].name === change.what) {
				building = window.buildings[i];
				i=window.buildings.length;
			}
		}
		if (!building) return console.warn("Building: "+change.what+" cannot be found");
		switch (change.operation) {
			case "multiply": {
				building[change.which] = building[change.which]*change.by;
				break;
			}
			case "divide": {
				building[change.which] = building[change.which]/change.by;
				break;
			}
			case "add": {
				building[change.which] += change.by;
				break;
			}
			case "subtract": {
				building[change.which] -= change.by;
				break;
			}
			default: {
				console.warn("Cannot launch change with operation: "+change.operation);
			}
		}
		if (change.which === "amount") {
			for (k=0; k<building.resources.length; k++) {
				building.resources[k].value = Math.ceil(building.resources[k].base*Math.pow(building.multi, building.amount));
				window.buildings[i] = building;
			}
		}
	}
	return;
}

function newMessage(event) {
	try{
	messagebar = document.getElementById("messagebar");
	if(messagebar.style.display==="none") messagebar.style.display = "";
	
	var newMessage = document.createElement("p");
	newMessage.textContent = event.value;
	
	while(messagebar.childNodes.length>window.settings.maxmessages-1) {
		messagebar.removeChild(messagebar.lastChild);
	}
	if (messagebar.childNodes.length === 0) messagebar.appendChild(newMessage);
	else messagebar.insertBefore(newMessage, messagebar.childNodes[0]);
	}catch(e){console.log(e)}
	return;
}

function editTab(event) {
	try {
	if (!event.extra) return console.warn("Event: "+event+" lacks the 'extra' property.");
	if (!document.getElementById(event.extra)) return console.warn("Event: "+event+" was not passed with a valid 'extra' property.");
	if (document.getElementById(event.extra).style.display === "none") document.getElementById(event.extra).style.display = "";
	document.getElementById(event.extra).firstChild.textContent = event.value;
	document.getElementById(event.extra).addEventListener("click", tabchanger["main"+event.extra]);
	return;
	}
	catch(e){console.log(e)}
}

function achieve(event, notify) {
	try {
	if (notify) {
		newAchieve = document.createElement("div");
		title = document.createElement("h4");
		descrip = document.createElement("p");
		newAchieve.classList.add("achievement");
		newAchieve.classList.add("fadein");
		title.textContent = event.value;
		title.style.cssText = "text-align: center;";
		descrip.textContent = event.extra;
		newAchieve.appendChild(title);
		newAchieve.appendChild(descrip);
		newAchieve.addEventListener("click", function(e){
			e.target.remove();
		});
		setTimeout(function(){
			document.getElementById("achievebar").firstChild.remove();
		}, 1000*15);
		document.getElementById("achievebar").appendChild(newAchieve);
	}
	achievementItem = document.createElement("p");
	achievementItem.textContent = event.value;
	achievementItem.title = event.extra;
	achievementItem.classList.add("achievementlist")
	document.getElementById("achievemodalcontent").appendChild(achievementItem);
	window.unlockedAchieve.push(event)
	}catch(e){console.log(e)}
}