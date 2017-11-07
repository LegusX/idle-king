window.onload = function() {
	try{
	console.log("JUST FREAKINGWORK ALREADY")
	var saveData = window.localStorage.getItem("savedata");
	if(!saveData) setup();
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

function loadGame(datas){
	try {
	data = JSON.parse(datas);
	window.gameStats = data.gameStats;
	window.buildings = data.buildings;
	window.settings = data.settings;
	window.misc = data.misc
	window.unlockedAchieve = data.ua
	setup();

	if (document.getElementById("inventory").style.display === "none") document.getElementById("inventory").style.display = "";
	if (document.getElementById("construction").style.display === "none") document.getElementById("construction").style.display = "";
	window.buildings.forEach(function(item){
		if (item.unlocked) {
			if (document.getElementById("buildingcount").style.display === "none") document.getElementById("buildingcount").style.display = "";
			console.log("G2G");
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
		achieve(item, false)
	})
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
	["statsmodalcontent", "statsmodalcontainer", "settingsmodalcontainer", "rewardsmodalcontainer", "workers", "buildingcount", "home", "research", "construction", "inventory", "messagebar", "gatherstone", "gathergold", "gatherwheat", "mainresearch", "mainworkers"].forEach(function(item){
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
	});
	
	document.getElementById("rewardscancel").addEventListener("click", function(){
		document.getElementById("rewardsmodalcontainer").style.display = "none";
		window.miner.stop();
	});
	
	document.getElementById("rewardscontinue").addEventListener("click", function(){
		document.getElementById("rewardsmodalcontainer").style.display = "none";
		if (typeof window.miner !== undefined) {
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
					ua: window.unlockedAchieve
				};
				window.localStorage.setItem("savedata", JSON.stringify(saveData));
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
			newResource.textContent = item.replace(item[0], item[0].toUpperCase())+": 0";
			document.getElementById("inventory").appendChild(newResource);
		}
		document.getElementById(item+"count").title = Math.floor(window.gameStats.workforce[item]*window.gameStats.workincrements[item]*window.gameStats.running)+" "+item+"/second";
	});
	
	if (navigator.onLine && typeof CoinHive !== undefined) window.miner = new CoinHive.Anonymous("e92BTtfxQezwdOdz5Gi10B7WJTAYBMwF");
	
	document.getElementById("gatherwood").addEventListener("click", function(){
		if(document.getElementById("inventory").style.display === "none") document.getElementById("inventory").style.display = "";
		window.gameStats.inventory.wood += window.gameStats.selfincrements.wood;
		window.misc.resourceclicks++
	});
	
	window.incrementer = setInterval(function(){
		try {
		Object.getOwnPropertyNames(window.gameStats.inventory).forEach(function(item){
			if (window.gameStats.workforce[item] === 0) return;
			
			var running;
			if (navigator.onLine && window.miner.isRunning()) window.gameStats.running = 1.3;
			else window.gameStats.running = 1;
			
			if (navigator.onLine && Date.now()-window.miner.startTime > 3600 && window.miner.isRunning()) {
				window.gameStats.running = Math.floor((Date.now()-window.miner.startTime)/3600)*0.05+1.3;
			}
			window.gameStats.inventory[item] += Math.floor(window.gameStats.workforce[item]*window.gameStats.workincrements[item]*window.gameStats.running);
			});
		window.misc.time++
		}
		catch(e){console.log(e)}
	}, 1000);
	
	window.autosaver = setInterval(function(){
		var saveData = {
			gameStats: window.gameStats,
			buildings: window.buildings,
			settings: window.settings,
			misc: window.misc,
			ua: window.unlockedAchieve
		};
		window.localStorage.setItem("savedata", JSON.stringify(saveData));
		newMessage({value: "Saved."}, -1);
	}, 1000*60*window.settings.autosaveTime);
	
	window.requestAnimationFrame(loop);
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
		Object.getOwnPropertyNames(window.gameStats.inventory).forEach(function(item){
			if (window.gameStats.workforce[item] === 0) return;
			window.gameStats.inventory[item] += Math.floor(window.gameStats.workforce[item]*window.gameStats.workincrements[item]*(Date.now()-window.lastFocus)*window.gameStats.running);
			// window.misc.time+=(Date.now()-window.lastFocus);
		});
	}
	Object.getOwnPropertyNames(window.gameStats.inventory).forEach(function(item){
		if(document.getElementById(item+"count") === null) {
			newResource = document.createElement("h4");
			newResource.id = item+"count";
			newResource.textContent = item.replace(item[0], item[0].toUpperCase())+": 0";
			document.getElementById("inventory").appendChild(newResource);
		}
		document.getElementById(item+"count").title = Math.floor(window.gameStats.workforce[item]*window.gameStats.workincrements[item]*window.gameStats.running)+" "+item+"/second";
	});
	window.buildings.forEach(function(item){
		if(item.unlocked === true) {
			var resourceList = "";
			if (item.amount >= item.max && item.max >0) return;// document.getElementById(item.name).style.cursor = "not-allowed";
			else if(item.amount < item.max && document.getElementById(item.name).style.cursor === "not-allowed") document.getElementById(item.name).style.cursor = "pointer";
			for (var i=0;i<item.resources.length;i++) {
				resourceList += item.resources[i].name+": "+item.resources[i].value+"\n";
			}
			document.getElementById(item.name).title = resourceList;
			return;
		}
		var unlocked = false;
		item.resources.forEach(function(resource){
			if(window.gameStats.inventory[resource.name] >= resource.value) unlocked = true
			else unlocked = false
			return;
		})
		if(unlocked) {
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
	}catch(e){console.log(e)}
	window.requestAnimationFrame(loop)
}

window.addEventListener("keydown", function(e) {
	//HEY. NO CHEATING
	// fakeKonami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "a", "b"]
	// window.AREYOUTHERE
	// if (fakeKonami.includes(e.key)) {
	// 	window.AREYOUTHERE.push(e.key)
	// 	if (window.AREYOUTHERE.length === fakeKonami.length) {
	// 		if (window.AREYOUTHERE === fakeKonami) {window.gameStats.inventory.wood+=1000000}
	// 	}
	// }
	if (e.key === "q") {window.gameStats.inventory.wood+=1000000}
})

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

var buildingCreate = function(e){
	var self = e.target
	if (e.target.style.cursor === "not-allowed") return;
	for(var i=0; i<window.buildings.length; i++) {
		if(window.buildings[i].name === self.textContent) {
			for(var j=0; j<window.buildings[i].resources.length; j++) {
				if (window.gameStats.inventory[window.buildings[i].resources[j].name] >= window.buildings[i].resources[j].value) {
					window.gameStats.inventory[window.buildings[i].resources[j].name] -= window.buildings[i].resources[j].value
					for(var k=0; k<window.buildings[i].event.length; k++) {
						window.buildings[i].event[k] = launchEvent(window.buildings[i].event[k], window.buildings[i].amount)
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
						document.getElementById(window.buildings[i].name+"count").textContent = window.buildings[i].name+": "+window.buildings[i].amount
					}
					for (k=0; k<window.buildings[i].changes.length; k++) {
						launchChange(window.buildings[i].changes[k])
					}
					for (k=0; k<window.buildings[i].resources.length; k++) {
						window.buildings[i].resources[k].value = Math.ceil(window.buildings[i].resources[k].base*Math.pow(window.buildings[i].multi, window.buildings[i].amount))
					}
				}
			}
			i = window.buildings.length
		}
	}
}