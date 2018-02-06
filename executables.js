//This is mainly for random functions that only ever get executed once or twice throughout the game
function setupWorkforce(){
	try{
		var work = document.getElementById("mainworkers");
		var worksummary = document.getElementById("workersummary");
		var buildsummary = document.getElementById("buildingsummary");
		
		document.getElementById("workeridle").textContent = "Idle: "+window.gameStats.workforce.idle;
		document.getElementById("workertotal").textContent = "Total: "+window.gameStats.workforce.max;

		window.RGV.workforce = true;
		window.buildings.forEach(function(item){
			if (typeof item.workforce === "undefined") return;
			if (document.getElementById("workername"+item.workforce.name) === null && document.getElementById("worker"+item.workforce.name) === null) {
				worksummary.appendChild(document.createElement("br"));
				
				var newWorkerText = document.createElement("p");
				newWorkerText.textContent = item.workforce.name+": ";
				newWorkerText.classList.add("summaryitems");
				newWorkerText.id = "workername"+item.workforce.name;
				if(!item.unlocked) newWorkerText.style.display = "none";
				worksummary.appendChild(newWorkerText);
				
				item.workforce.owner = item.name;
				
				var newWorkerInput = document.createElement("button");
				newWorkerInput.id = "worker"+item.workforce.name+"-";
				newWorkerInput.textContent = "-1";
				newWorkerInput.addEventListener("click", function(e){
					try {
						var amount = Number(e.target.textContent.substring(1,e.target.textContent.length))*-1
						var name = e.target.id.replace("worker", "").split("").splice(0,e.target.id.replace("worker", "").length-1).join("");
						var work = findWork(name);
						if (work.amount+amount < 0) return;
						if (window.gameStats.workforce.idle - amount <0) return;
						work.amount+=amount;
						window.buildings[window.buildingNames.indexOf(work.building)].workforce = work;
						window.gameStats.workforce.idle+=amount*-1;
						var p = document.getElementById("worker"+work.name);
						p.textContent = work.amount
					}catch(e){console.log(e)}
				});
				if(!item.unlocked) newWorkerInput.style.display = "none";
				worksummary.appendChild(newWorkerInput);
				
				var newWorkerNumber = document.createElement("p");
				newWorkerNumber.id = "worker"+item.workforce.name;
				newWorkerNumber.textContent = item.workforce.amount;
				newWorkerNumber.classList.add("summaryinput");
				if(!item.unlocked) newWorkerInput.style.display = "none";
				worksummary.appendChild(newWorkerNumber);
				
				var newWorkerInput2 = document.createElement("button");
				newWorkerInput2.id = "worker"+item.workforce.name+"+";
				newWorkerInput2.textContent = "+1";
				newWorkerInput2.addEventListener("click", function(e){
					try {
						var amount = Number(e.target.textContent.substring(1,e.target.textContent.length))
						var name = e.target.id.replace("worker", "").split("").splice(0,e.target.id.replace("worker", "").length-1).join("");
						var work = findWork(name);
						if (work.amount+amount < 0) return;
						if (window.gameStats.workforce.idle - amount <0) return;
						work.amount+=amount;
						window.buildings[window.buildingNames.indexOf(work.building)].workforce = work;
						window.gameStats.workforce.idle+=amount*-1;
						var p = document.getElementById("worker"+work.name);
						p.textContent = work.amount
					}catch(e){console.log(e)}
				});
				if(!item.unlocked) newWorkerInput2.style.display = "none";
				worksummary.appendChild(newWorkerInput2);
				
				
			}

		});
	}
	catch(e){console.log(e+"SIRLY")}
}

function launchCommand(message){
	try {
		if (typeof message === "undefined") {
			var command = document.getElementById("cmdline").value;
			if (command === "") return;
			window.commandList.push(command);
			try {
				response = eval(command);
				newMessage = document.createElement("label");
				newMessage.innerHTML = "<span style='color: #0029cc;'>"+response+"</span>";
				document.getElementById("mainconsole").appendChild(newMessage);
				document.getElementById("mainconsole").appendChild(document.createElement("hr"));
			}
			catch(e){
				newMessage = document.createElement("label");
				newMessage.innerHTML = "<span style='color: red;'>"+e+"</span>";
				document.getElementById("mainconsole").appendChild(newMessage);
				document.getElementById("mainconsole").appendChild(document.createElement("hr"));
			}
			document.getElementById("cmdline").value = "";
		}
		else {
			newMessage = document.createElement("label");
			newMessage.innerHTML = "<span style='color: "+(message.includes("error")||message.includes("Error"))?red:black+";'>"+message+"</span>";
			document.getElementById("mainconsole").appendChild(newMessage);
			document.getElementById("mainconsole").appendChild(document.createElement("hr"));
		}
		document.getElementById("debugconsole").scrollTop = document.getElementById("debugconsole").scrollHeight+1;
	}
	catch(e){console.log(e)}
}

function iterate(obj, finalArray) {
    for (var property in obj) {
		if(!finalArray.includes(property) /*&& !Number.isInteger(Number(property))*/) finalArray.push(property);
        if (obj.hasOwnProperty(property)  /*&& !Number.isInteger(Number(property))*/) {
            if (typeof obj[property] == "object" /*&&typeof obj.length == "undefined"*/) {
                iterate(obj[property], finalArray);
            } else {
                if(!finalArray.includes(property)) finalArray.push(property);
            }
        }
    }
	return finalArray;
}

function createWork(item){
	try {
		var work = document.getElementById("mainworkers");
		var worksummary = document.getElementById("workersummary");
		var buildsummary = document.getElementById("buildingsummary");
		
		document.getElementById("workeridle").textContent = "Idle: "+window.gameStats.workforce.idle;
		document.getElementById("workertotal").textContent = "Total: "+window.gameStats.workforce.max;

		window.RGV.workforce = true;
		window.buildings.forEach(function(item){
			if (typeof item.workforce === "undefined") return;
			if (document.getElementById("workername"+item.workforce.name) === null && document.getElementById("worker"+item.workforce.name) === null) {
				worksummary.appendChild(document.createElement("br"));
				
				var newWorkerText = document.createElement("p");
				newWorkerText.textContent = item.workforce.name+": ";
				newWorkerText.classList.add("summaryitems");
				newWorkerText.id = "workername"+item.workforce.name;
				if(!item.unlocked) newWorkerText.style.display = "none";
				worksummary.appendChild(newWorkerText);
				
				item.workforce.owner = item.name;
				
				var newWorkerInput = document.createElement("button");
				newWorkerInput.id = "worker"+item.workforce.name+"-";
				newWorkerInput.textContent = "-1";
				newWorkerInput.addEventListener("click", function(e){
					try {
						var amount = Number(e.target.textContent.substring(1,e.target.textContent.length))*-1
						var name = e.target.id.replace("worker", "").split("").splice(0,e.target.id.replace("worker", "").length-1).join("");
						var work = findWork(name);
						if (work.amount+amount < 0) return;
						if (window.gameStats.workforce.idle - amount <0) return;
						work.amount+=amount;
						window.buildings[window.buildingNames.indexOf(work.building)].workforce = work;
						window.gameStats.workforce.idle+=amount*-1;
						var p = document.getElementById("worker"+work.name);
						p.textContent = work.amount
					}catch(e){console.log(e)}
				});
				if(!item.unlocked) newWorkerInput.style.display = "none";
				worksummary.appendChild(newWorkerInput);
				
				var newWorkerNumber = document.createElement("p");
				newWorkerNumber.id = "worker"+item.workforce.name;
				newWorkerNumber.textContent = item.workforce.amount;
				newWorkerNumber.classList.add("summaryinput");
				if(!item.unlocked) newWorkerInput.style.display = "none";
				worksummary.appendChild(newWorkerNumber);
				
				var newWorkerInput2 = document.createElement("button");
				newWorkerInput2.id = "worker"+item.workforce.name+"+";
				newWorkerInput2.textContent = "+1";
				newWorkerInput2.addEventListener("click", function(e){
					try {
						var amount = Number(e.target.textContent.substring(1,e.target.textContent.length))
						var name = e.target.id.replace("worker", "").split("").splice(0,e.target.id.replace("worker", "").length-1).join("");
						var work = findWork(name);
						if (work.amount+amount < 0) return;
						if (window.gameStats.workforce.idle - amount <0) return;
						work.amount+=amount;
						window.buildings[window.buildingNames.indexOf(work.building)].workforce = work;
						window.gameStats.workforce.idle+=amount*-1;
						var p = document.getElementById("worker"+work.name);
						p.textContent = work.amount
					}catch(e){console.log(e)}
				});
				if(!item.unlocked) newWorkerInput2.style.display = "none";
				worksummary.appendChild(newWorkerInput2);
				
				
			}

		});
	}
	catch(e){console.error(e)}
}

function setupBuildings(){
	window.buildingNames = []
	for (var i=0;i<window.buildings.length;i++){
		window.buildingNames.push(window.buildings[i].name)
	}
	return;
}
