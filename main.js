window.onload = function() {
	try{
	window.commandList = [""]
	window.addEventListener("keydown", function(e){
		if (e.key === "d"){
			if(document.getElementById("debugconsole").style.display === "none") document.getElementById("debugconsole").style.display = "";
			else if(e.target.id !== "cmdline") document.getElementById("debugconsole").style.display = "none";
		}
	});
	document.getElementById("cmdline").addEventListener("keydown", function(e){
		if (e.key === "Enter") {
			launchCommand();
		}
		else if(e.key === "ArrowUp") {
			console.log("hiya")
			if (window.commandList.includes(document.getElementById("cmdline").value)) {
				document.getElementById("cmdline").value = window.commandList[(window.commandList.indexOf(document.getElementById("cmdline").value)-1 === -1)?0:window.commandList.indexOf(document.getElementById("cmdline").value)-1]
			}
			else {
				document.getElementById("cmdline").value = window.commandList[window.commandList.length-1]
			}
		}
	});
	var saveData = window.localStorage.getItem("savedata");
	if(!saveData) newGame();
	// setup()
	else loadGame(saveData);
	}
	catch(e){console.log(e)}
};

window.onclick = function(e) {
	//This should take care of all modals, so long as they have the correct class
	for (var i=0;i<document.getElementsByClassName("modalcontainer").length;i++) {
	    if (document.getElementsByClassName("modalcontainer")[i].id === event.target.id) {
	    	e.target.style.display = "none";
	    }
	}
	window.misc.clicks++;
};

function newGame(){
	//Left this here in case I ever need other new game interaction, like getting the user's name, civilization name, and so forth.
	setup();
	window.requestAnimationFrame(loop);
}

function loadGame(datas){
	try {
	data = JSON.parse(datas);
	console.log(data)
	console.log(datas)
	if (data.gameStats.version !== window.version) {
		window.localStorage.removeItem("savedata");
		alert("Hey there, sorry, but it looks like your current save data doesn't work with this version of the game! \n\nUnfortunately, backwards compatibility of game data is sketchy at best, so the game will automatically delete your save data now in order to not break anything. \n\nSorry about that. :/");
		return newGame();
	}
	window.gameStats = data.gameStats;
	var buildings = data.buildings;
	// for(var i=0;i<window.buildings.length;i++) {
	// 	Object.getOwnPropertyNames(window.buildings[i]).forEach(function(item){
	// 		if(typeof buildings[item] === "undefined") buildings[item] = window.buildings[i][item];
	// 	});
	// }
	for(var i=0;i<buildings.length;i++) {
		for(var j=0;j<Object.getOwnPropertyNames(window.buildings[i]).length;j++) {
			if(typeof buildings[i][Object.getOwnPropertyNames(window.buildings[i])[j]] === "undefined") {
				buildings[i][Object.getOwnPropertyNames(window.buildings[i])[j]] = window.buildings[i][Object.getOwnPropertyNames(window.buildings[i])[j]]
			}
		}
	}
	window.buildings = buildings;
	window.settings = data.settings;
	window.misc = data.misc;
	window.unlockedAchieve = data.ua;
	setup();
	setupWorkforce();

	if (window.gameStats.name !== undefined) document.title = "Civ Clicker - "+window.gameStats.name
	if (document.getElementById("inventory").style.display === "none") document.getElementById("inventory").style.display = "";
	if (document.getElementById("construction").style.display === "none") document.getElementById("construction").style.display = "";
	
	if (window.buildings[2].amount > 0) {
		editTab({
			extra: "workers",
			value: "Workforce"
		});
	}
	window.buildings.forEach(function(item){
		if (item.unlocked) {
			if (document.getElementById("buildingcount").style.display === "none") document.getElementById("buildingcount").style.display = "";
			var newBuilding = document.createElement("p");
			newBuilding.classList.add("resourcebuttons");
			newBuilding.classList.add("noselect");
			newBuilding.textContent = item.name;
			newBuilding.id = item.name;
			newBuilding.addEventListener("click", buildingCreate);
			document.getElementById("construction").appendChild(newBuilding);
			var newCounter = document.createElement("h4");
			newCounter.id = item.name+"count";
			newCounter.textContent = item.name+": "+item.amount;
			document.getElementById("buildingcount").appendChild(newCounter);
			for (var i=0;i<item.event.length;i++){
				if (item.event[i].type ==="newtab") {
					editTab(item.event[i], item.amount);
				}
			}
		}
	});
	
	window.unlockedAchieve.forEach(function(item){
		achieve(item, false);
	});
	
	if (window.buildings[1].amount > 0) {
		if (document.getElementById("gatherstone").style.display !== "none") return;
		document.getElementById("gatherstone").style.display = "";
		document.getElementById("gatherstone").addEventListener("click", function(){
			if (window.buildings[1].amount !== 1) {
				window.gameStats.inventory.stone+=window.gameStats.selfincrements.stone;
			}
			else {
				window.gameStats.selfincrements.stone = 1;
				window.gameStats.inventory.stone++;
			}
		});
	}
	if (window.buildings[2].amount > 0) {
		if (document.getElementById("gatherwheat").style.display !== "none") return;
		document.getElementById("gatherwheat").style.display = "";
		document.getElementById("gatherwheat").addEventListener("click", function(){
			if (window.buildings[2].amount !== 1) {
				window.gameStats.inventory.wheat+=window.gameStats.selfincrements.wheat;
			}
			else {
				window.gameStats.selfincrements.wheat = 1;
				window.gameStats.inventory.wheat++;
			}
		});
	}
	newMessage({
		value: "Welcome back to Civ Clicker!"
	});
	window.requestAnimationFrame(loop);
	}
	catch(e){console.log(e)}
}


function setup() {
	try {
	window.focused = true;
	window.lastFocused = Date.now();
	//THE TRAIN OF INVISIBILITY
	//I honestly can't even remember why I called it that
	//Oh yeah, becuase the line is really long, and it's whole purpose is to turn all those things invisible.
	//That feeling you get when you realize that you just held a conversation with yourself in the comments of your code
	//because you're waiting for inspiration to hit you and tell you what you have been doing wrong this entire time with the code...
	//Yeah.
	//I should probably stop that...
	["newgamecontainer", "debugconsole", "notreadyrewards", "statsmodalcontent", "statsmodalcontainer", "settingsmodalcontainer", "rewardsmodalcontainer", "workers", "buildingcount", "home", "research", "construction", "inventory", "messagebar", "gatherstone", "gathergold", "gatherwheat", "mainresearch", "mainworkers"].forEach(function(item){
		document.getElementById(item).style.display = "none";
	});
	
	//Welcome to the most ineffecient way of making buttons in HTML5/JavaScript!
	document.getElementById("stats").addEventListener("click", function(){
		document.getElementById("statsmodalcontainer").style.display = "";
		document.getElementById("statsmodalcontent").style.display = "";
		var time = (window.misc.time < 60)? window.misc.time+" seconds": (window.misc.time < 3600)? Math.floor(window.misc.time/60)+" minutes": (window.misc.time < 3600*24)? Math.floor(window.misc.time/3600)+" hours": Math.trunc(window.misc.time/(3600*24))+" days"
		document.getElementById("totaltime").textContent = "Total Play Time: "+time
		document.getElementById("totalclicks").textContent = "Total Clicks: "+window.misc.clicks
		document.getElementById("totalresourceclicks").textContent = "Total Resource Clicks: "+window.misc.resourceclicks
		document.getElementById("achievemodalcontent").style.display = "none";
	});
	
	document.getElementById("statsheader").addEventListener("click", function(){
		document.getElementById("statsmodalcontent").style.display = "";
		document.getElementById("achievemodalcontent").style.display = "none";
		var time = (window.misc.time < 60)? window.misc.time+" seconds": (window.misc.time < 3600)? Math.floor(window.misc.time/60)+" minutes": (window.misc.time < 3600*24)? Math.floor(window.misc.time/3600)+" hours": Math.trunc(window.misc.time/(3600*24))+" days"
		document.getElementById("totaltime").textContent = "Total Play Time: "+time
		document.getElementById("totalclicks").textContent = "Total Clicks: "+window.misc.clicks
		document.getElementById("totalresourceclicks").textContent = "Total Resource Clicks: "+window.misc.resourceclicks
	});
	
	document.getElementById("achievements").addEventListener("click", function(){
		document.getElementById("statsmodalcontent").style.display = "none";
		document.getElementById("achievemodalcontent").style.display = "";
	});
	
	document.getElementById("rewards").addEventListener("click", function(){
		document.getElementById("rewardsmodalcontainer").style.display = "";
		if(typeof CoinHive === "undefined") {
			document.getElementById("readyrewards").style.display = "none"
			document.getElementById("notreadyrewards").style.display = ""
		}
		else {
			document.getElementById("readyrewards").style.display = ""
			document.getElementById("notreadyrewards").style.display = "none"
		}
	});
	
	document.getElementById("rewardscancel").addEventListener("click", function(){
		document.getElementById("rewardsmodalcontainer").style.display = "none";
		if (typeof window.miner !== "undefined") {
			window.miner.stop();
		}
	});
	
	document.getElementById("rewardscontinue").addEventListener("click", function(){
		document.getElementById("rewardsmodalcontainer").style.display = "none";
		if (typeof window.miner !== "undefined") {
			window.miner.start();
			window.miner.on("optin", function(p){
				if(p.status === "accepted") {
					window.miner.startTime = Date.now();
				}
			});
		}
	});
	
	document.getElementById("settings").addEventListener("click", function(){
		document.getElementById("settingsmodalcontainer").style.display = "";
		document.getElementById("maxmessages").value = window.settings.maxmessages;
		document.getElementById("autosavetime").value = window.settings.autosaveTime;
	});
	
	document.getElementById("settingsapply").addEventListener("click", function(){
		try {
		document.getElementById("settingsmodalcontainer").style.display = "none";
		if (Number(document.getElementById("autosavetime").value) !== Number(window.settings.autosaveTime)) {
			clearInterval(window.autosaver);
			window.autosaver = setInterval(function(){
				var saveData = {
					gameStats: window.gameStats,
					buildings: window.buildings,
					settings: window.settings,
					misc: window.misc,
					ua: window.unlockedAchieve,
					version: window.gameStats.version
				};
				window.localStorage.setItem("savedata", JSON.stringify(saveData, iterate(saveData, []).filter(function(e){return this.indexOf(e)<0;}, window.RGV.blacklist)));
				newMessage({value: "Saved."}, -1);
			}, 1000*60*Number(document.getElementById("autosavetime").value));
		}
		window.settings.maxmessages = Number(document.getElementById("maxmessages").value);
		window.settings.autosaveTime = Number(document.getElementById("autosavetime").value);
		}catch(e){console.log}
	});

	document.getElementById("settingscancel").addEventListener("click", function(){
		document.getElementById("settingsmodalcontainer").style.display = "none";
	});
	document.getElementById("maxmessages").value = 15;
	
	Object.getOwnPropertyNames(window.gameStats.inventory).forEach(function(item){
		if(document.getElementById(item+"count") === null) {
			newResource = document.createElement("h4");
			newResource.id = item+"count";
			newResource.textContent = item.split("")
			if(window.gameStats.inventory[item] === 0) newResource.style.display = "none"
			document.getElementById("inventory").appendChild(newResource);
		}
		document.getElementById(item+"count").title = Math.floor(window.gameStats.workforce[item]*window.gameStats.workincrements[item]*window.gameStats.running)+" "+item+"/second";
	});
	
	if (navigator.onLine && typeof CoinHive !== "undefined") window.miner = new CoinHive.Anonymous("e92BTtfxQezwdOdz5Gi10B7WJTAYBMwF");
	
	document.getElementById("gatherwood").addEventListener("click", function(){
		if(document.getElementById("inventory").style.display === "none") document.getElementById("inventory").style.display = "";
		window.gameStats.inventory.wood += window.gameStats.selfincrements.wood;
		window.misc.resourceclicks++
	});
	
	window.incrementer = setInterval(function(){
		try {
			
			var running;
			if (typeof window.miner !== "undefined" && navigator.onLine && window.miner.isRunning()) window.gameStats.running = 1.3;
			else window.gameStats.running = 1;
			
			if (typeof window.miner !== "undefined" && navigator.onLine && Date.now()-window.miner.startTime > 3600 && window.miner.isRunning()) {
				window.gameStats.running = Math.floor((Date.now()-window.miner.startTime)/3600)*0.05+1.3;
			}
			if(window.gameStats.workforce.workers.length > 0) window.gameStats.workforce.workers.forEach(function(item){
				Object.getOwnPropertyNames(item.workchanges).forEach(function(sitem){
					window.gameStats.inventory[sitem]+=this.workchanges[sitem]*this.amount*window.gameStats.running
				},item)
			});
			// window.gameStats.inventory[item] += Math.floor(window.gameStats.workforce[item]*window.gameStats.workincrements[item]*window.gameStats.running);
			window.misc.time++
			if(getRandomInt(0, 10) === 4) {
				moreVillagers = getRandomInt(1, 5)
				if (moreVillagers+window.gameStats.workforce.total > window.gameStats.workforce.max) moreVillagers = window.gameStats.workforce.max-window.gameStats.workforce.total
				if (moreVillagers === 0) return;
				if(typeof window.gameStats.name === "undefined") document.getElementById("newgamecontainer").style.display = ""
				document.getElementById("confirmnewgame").addEventListener("click", function(){
					var input = document.getElementById("namepicker")
					if (input.value === "") return alert("You need to choose a name!")
					else {
						window.gameStats.name = input.value
						document.getElementById("newgamecontainer").style.display = "none"
						document.title = "Civ Clicker - "+input.value
					}
				})
				newMessage({value: moreVillagers+" villager(s) have moved into your village!"}, -1)
				window.gameStats.workforce.total+=moreVillagers
				window.gameStats.workforce.idle+=moreVillagers
			}
		}
		catch(e){console.log(e)}
	}, 1000);
	
	window.autosaver = setInterval(function(){
		try {
			var saveData = {
				gameStats: window.gameStats,
				buildings: window.buildings,
				settings: window.settings,
				misc: window.misc,
				ua: window.unlockedAchieve,
				version: window.gameStats.version
			};
			window.localStorage.setItem("savedata", JSON.stringify(saveData, iterate(saveData, []).filter(function(e){return this.indexOf(e)<0;}, window.RGV.blacklist)));
			newMessage({value: "Saved."}, -1);
		}catch(e){console.error(e)}
	}, 1000*60*window.settings.autosaveTime);
	
	}
	catch(e){console.log(e)}
	return;
}

var loop = function(){
	try {
	if(!document.hasFocus && window.focused) {
		window.focused = false;
		window.lastFocus = Date.now();
	}
	else if (document.hasFocus && !window.focused) {
		window.focused = true;
		window.gameStats.workforce.workers.forEach(function(item){
			// if (window.gameStats.workforce[item] === 0) return;
			// window.gameStats.inventory[item] += Math.floor(window.gameStats.workforce[item]*window.gameStats.workincrements[item]*(Date.now()-window.lastFocus)*window.gameStats.running);
			// window.misc.time+=(Date.now()-window.lastFocus);
			Object.getOwnPropertyNames(item.workchanges).forEach(function(sitem){
				window.gameStats.inventory[sitem]+=item.workchanges[sitem]*amount*(Date.now()-window.lastFocus)*window.gameStats.running
			})
		});
	}
	Object.getOwnPropertyNames(window.gameStats.inventory).forEach(function(item){
		// if(document.getElementById(item+"count") === null) {
		// 	newResource = document.createElement("h4");
		// 	newResource.id = item+"count";
		// 	newResource.textContent = item.replace(item[0], item[0].toUpperCase())+": 0";
		// 	document.getElementById("inventory").appendChild(newResource);
		// }
		if (document.getElementById(item+"count").style.display === "none" && window.gameStats.inventory[item] > 0) document.getElementById(item+"count").style.display = ""
		// document.getElementById(item+"count").title = Math.floor(window.gameStats.workforce[item]*window.gameStats.workincrements[item]*window.gameStats.running)+" "+item+"/second";
		// document.getElementById(item+"count").title = (window.gameStats.workforce.calc[item] === 0)?"0 "+item+"/second":window.gameStats.workforce.calc[item]
	});
	window.buildings.forEach(function(item){
		if(item.unlocked === true) {
			var resourceList = "";
			if (item.amount >= item.max && item.max >0) return; //document.getElementById(item.name).style.cursor = "not-allowed";
			else if(item.amount < item.max && document.getElementById(item.name).style.cursor === "not-allowed") document.getElementById(item.name).style.cursor = "pointer";
			for (var i=0;i<item.resources.length;i++) {
				resourceList += item.resources[i].name+": "+item.resources[i].value+"\n";
			}
			document.getElementById(item.name).title = resourceList;
			return;
		}
		var unlocked = []
		item.resources.forEach(function(resource){
			if(window.gameStats.inventory[resource.name] >= resource.value) unlocked.push(true)
			else unlocked.push(false)
			return;
		})
		if(!unlocked.includes(false)) {
			if (document.getElementById("construction").style.display === "none") document.getElementById("construction").style.display = ""
			if (document.getElementById(item.name) === null) {
				window.buildings[window.buildings.indexOf(item)].unlocked = true
				var newBuilding = document.createElement("p");
				newBuilding.classList.add("resourcebuttons");
				newBuilding.classList.add("noselect");
				newBuilding.textContent = item.name;
				newBuilding.id = item.name;
				newBuilding.addEventListener("click", buildingCreate)
				document.getElementById("construction").appendChild(newBuilding)
			}
		}
	});
	Object.getOwnPropertyNames(window.gameStats.inventory).forEach(function(item){
		document.getElementById(item+"count").textContent = item+": " + window.gameStats.inventory[item]
	})
	document.getElementById("workertotal").textContent = "Total: "+window.gameStats.workforce.total
	}catch(e){console.log(e)}
	window.requestAnimationFrame(loop)
}

window.addEventListener("keydown", function(e) {
	//HEY. NO CHEATING
	// fakeKonami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]
	// window.AREYOUTHERE = []
	// if (fakeKonami.includes(e.key)) {
	// 	window.AREYOUTHERE.push(e.key)
	// 	if (window.AREYOUTHERE.length === fakeKonami.length) {
	// 		if (window.AREYOUTHERE === fakeKonami) {window.gameStats.inventory.wood+=1000000}
	// 	}
	// }
	if (e.key === "q") {
		Object.getOwnPropertyNames(window.gameStats.inventory).forEach(function(item){window.gameStats.inventory[item]+=1000000})
	}
})

var buildingCreate = function(e){
	try {
		var self = e.target
		if (e.target.style.cursor === "not-allowed") return;
		for(var i=0; i<window.buildings.length; i++) {
			if(window.buildings[i].name === self.textContent) {
				canbuy = []
				for(var j=0; j<window.buildings[i].resources.length; j++) {
					if (window.gameStats.inventory[window.buildings[i].resources[j].name] >= window.buildings[i].resources[j].value) canbuy.push(true)
					else canbuy.push(false)
				}
				if (!canbuy.includes(false)) {
					for(var j=0; j<window.buildings[i].resources.length; j++){
						window.gameStats.inventory[window.buildings[i].resources[j].name]-=window.buildings[i].resources[j].value
					}
					if (typeof window.buildings[i].event !== "undefined") {
						for(var k=0; k<window.buildings[i].event.length; k++) {
							window.buildings[i].event[k] = launchEvent(window.buildings[i].event[k], window.buildings[i].amount)
						}
					}
					window.buildings[i].amount++
					if (window.buildings[i].amount === 1 && document.getElementById(window.buildings[i].name+"count") === null) {
						if (document.getElementById("buildingcount").style.display === "none") document.getElementById("buildingcount").style.display = ""
						var newCounter = document.createElement("h4")
						newCounter.id = window.buildings[i].name+"count"
						newCounter.textContent = window.buildings[i].name+": 1"
						document.getElementById("buildingcount").appendChild(newCounter)
					}
					else {
						document.getElementById(window.buildings[i].name+"count").style.display = ""
						document.getElementById(window.buildings[i].name+"count").textContent = window.buildings[i].name+": "+window.buildings[i].amount
					}
					if (typeof window.buildings[i].changes !== "undefined") {
						for (k=0; k<window.buildings[i].changes.length; k++) {
							launchChange(window.buildings[i].changes[k])
						}
					}
					for (k=0; k<window.buildings[i].resources.length; k++) {
						window.buildings[i].resources[k].value = Math.ceil(window.buildings[i].resources[k].base*Math.pow(window.buildings[i].multi, window.buildings[i].amount))
					}
					if(typeof window.buildings[i].execute !== "undefined") {
						window.buildings[i].execute()
					}
					if(typeof window.buildings[i].workforce !== "undefined") {
						// window.gameStats.workforce["max"+window.buildings[i].workforce.maxwhat]+=window.buildings[i].workforce.maxchange
						// createWork(window.buildings[i])
					}
				}
				i = window.buildings.length
			}
		}
	}catch(e){console.log(e)}
}

function findWork(name){
	for (var i=0;i<window.gameStats.workforce.workers.length;i++) {
		if (window.gameStats.workforce.workers[i].name === name) {
			i=window.gameStats.workforce.workers.length
			var choosen = window.gameStats.workforce.workers[i]
		}
	}
	return choosen;
}