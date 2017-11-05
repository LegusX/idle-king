window.onload = function() {
	var saveData = window.localStorage.getItem("savedata")
	if(!saveData) setup()
	setup()
	// else loadGame(saveData)
}

function loadGame(datas){
	data = JSON.parse(datas)
	window.gameStats = data.gameStats
	window.buildings = data.buildings
	console.log(datas)
	console.log(data)
	window.requestAnimationFrame(loop)
}

function setup() {
	try {
	window.focused = true;
	window.lastFocused = Date.now();
	//THE TRAIN OF INVISIBILITY
	["rewardsmodalcontainer", "workers", "buildingcount", "home", "research", "construction", "inventory", "messagebar", "gatherstone", "gathergold", "gatherwheat", "mainresearch", "mainworkers"].forEach(function(item){
		document.getElementById(item).style.display = "none"
	});
	
	document.getElementById("rewards").addEventListener("click", function(){
		document.getElementById("rewardsmodalcontainer").style.display = ""
	})
	
	document.getElementById("rewardscancel").addEventListener("click", function(){
		document.getElementById("rewardsmodalcontainer").style.display = "none"
		window.miner.stop()
	})
	
	document.getElementById("rewardscontinue").addEventListener("click", function(){
		document.getElementById("rewardsmodalcontainer").style.display = "none"
		window.miner.start()
		window.miner.on("optin", function(p){
			if(p.status === "accepted") {
				window.miner.startTime = Date.now()
			}
		})
	})
	
	if (navigator.onLine) window.miner = new CoinHive.Anonymous("e92BTtfxQezwdOdz5Gi10B7WJTAYBMwF")
	
	document.getElementById("gatherwood").addEventListener("click", function(){
		if(document.getElementById("inventory").style.display === "none") document.getElementById("inventory").style.display = ""
		window.gameStats.inventory.wood += window.gameStats.selfincrements.wood
	})
	
	setInterval(function(){
		try {
		Object.getOwnPropertyNames(window.gameStats.inventory).forEach(function(item){
			if (window.gameStats.workforce[item] === 0) return;
			
			var running
			if (navigator.onLine && window.miner.isRunning()) window.gameStats.running = 1.3
			else window.gameStats.running = 1
			
			if (navigator.onLine && Date.now()-window.miner.startTime > 3600 && window.miner.isRunning()) {
				window.gameStats.running = Math.floor((Date.now()-window.miner.startTime)/3600)*0.05+1.3
			}
			window.gameStats.inventory[item] += Math.floor(window.gameStats.workforce[item]*window.gameStats.workincrements[item]*window.gameStats.running)
			})
		}
		catch(e){console.log(e)}
	}, 1000)
	
	// setInterval(function(){
	// 	var saveData = {
	// 		gameStats: window.gameStats,
	// 		buildings: window.buildings
	// 	}
	// 	window.localStorage.setItem("savedata", JSON.stringify(saveData))
	// 	newMessage({value: "Saved."}, -1)
	// }, 1000/**60*/*5)
	
	window.requestAnimationFrame(loop)
	}
	catch(e){console.log(e)}
	return;
}

var loop = function(){
	try {
	if(!document.hasFocus && window.focused) {
		window.focused = false;
		window.lastFocus = Date.now()
	}
	else if (document.hasFocus && !window.focused) {
		window.focused = true
		Object.getOwnPropertyNames(window.gameStats.inventory).forEach(function(item){
			if (window.gameStats.workforce[item] === 0) return;
			window.gameStats.inventory[item] += Math.floor(window.gameStats.workforce[item]*window.gameStats.workincrements[item]*(Date.now()-window.lastFocus)*window.gameStats.running)
		})
	}
	Object.getOwnPropertyNames(window.gameStats.inventory).forEach(function(item){
		document.getElementById(item+"count").title = Math.floor(window.gameStats.workforce[item]*window.gameStats.workincrements[item]*window.gameStats.running)+" "+item+"/second"
	})
	window.buildings.forEach(function(item){
		if(item.unlocked === true) {
			var resourceList = ""
			if (item.amount >= item.max && item.max >0) return document.getElementById(item.name).style.cursor = "not-allowed"
			else if(item.amount < item.max && document.getElementById(item.name).style.cursor === "not-allowed") document.getElementById(item.name).style.cursor = "pointer"
			for (var i=0;i<item.resources.length;i++) {
				resourceList += item.resources[i].name+": "+item.resources[i].value+"\n"
			}
			document.getElementById(item.name).title = resourceList
			return;
		}
		var unlocked = false
		item.resources.forEach(function(resource){
			if(window.gameStats.inventory[resource.name] >= resource.value) unlocked = true
			else unlocked = false
			return;
		})
		if(unlocked) {
			if (document.getElementById("construction").style.display === "none") document.getElementById("construction").style.display = ""
			item.unlocked = true
			var newBuilding = document.createElement("p")
			newBuilding.classList.add("resourcebuttons")
			newBuilding.classList.add("noselect")
			newBuilding.textContent = item.name
			newBuilding.id = item.name
			newBuilding.addEventListener("click", function(e){
				var self = e.target
				if (e.target.style.cursor === "not-allowed") return;
				for(var i=0; i<window.buildings.length; i++) {
					if(window.buildings[i].name === self.textContent) {
						for(var j=0; j<window.buildings[i].resources.length; j++) {
							if (window.gameStats.inventory[window.buildings[i].resources[j].name] >= window.buildings[i].resources[j].value) {
								window.gameStats.inventory[window.buildings[i].resources[j].name] -= window.buildings[i].resources[j].value
								for(var k=0; k<window.buildings[i].event.length; k++) {
									// var event = window.buildings[i].event[k]
									//Going to try to use the bottom for now, which should hopefully work.
									launchEvent(window.buildings[i].event[k], window.buildings[i].amount)
								}
								window.buildings[i].amount++
								if (window.buildings[i].amount === 1) {
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
									window.buildings[i].resources[k].value = Math.ceil(window.buildings[i].resources[k].value*1.25)
								}
							}
						}
						i = window.buildings.length
					}
				}
			})
			document.getElementById("construction").appendChild(newBuilding)
		}
	});
	Object.getOwnPropertyNames(window.gameStats.inventory).forEach(function(item){
		document.getElementById(item+"count").textContent = item+": " + window.gameStats.inventory[item]
	})
	}
	catch(e){console.log(e)}
	window.requestAnimationFrame(loop)
}

window.quick = function() {
	window.gameStats.inventory.wood=1000000
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}