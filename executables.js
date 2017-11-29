//This is mainly for random functions that only ever get executed once or twice throughout the game
function setupWorkforce(){
	try{
		var work = document.getElementById("mainworkers")
		var worksummary = document.getElementById("workersummary")
		var buildsummary = document.getElementById("buildingsummary")
		
		document.getElementById("workeridle").textContent = "Idle: "+window.gameStats.workforce.idle
		document.getElementById("workertotal").textContent = "Total: "+window.gameStats.workforce.max

		window.RGV.workforce = true
		window.buildings.forEach(function(item){
			if (typeof item.workforce === "undefined") return;
			if (document.getElementById("workername"+item.workforce.name) === null && document.getElementById("worker"+item.workforce.name) === null) {
				worksummary.appendChild(document.createElement("br"))
				var newWorkerText = document.createElement("p")
				newWorkerText.textContent = item.workforce.name+": "
				newWorkerText.classList.add("summaryitems")
				newWorkerText.id = "workername"+item.workforce.name
				if(!item.unlocked) newWorkerText.style.display = "none"
				worksummary.appendChild(newWorkerText)
				
				var newWorkerInput = document.createElement("input")
				newWorkerInput.type = "number"
				newWorkerInput.id = "worker"+item.workforce.name
				newWorkerInput.classList.add("summaryinput")
				newWorkerInput.min = 0
				newWorkerInput.max = window.gameStats.workforce["max"+item.workforce.maxwhat]
				newWorkerInput.value = window.gameStats.workforce[item.workforce.maxwhat]
				
				newWorkerInput.addEventListener("input", function(e){
					try{
						var name = e.target.id.substr(6)
						var item = findWork(name)
						console.log(item)
					}catch(e){console.error(e+"NEWORKER")}
				})
				if(!item.unlocked) newWorkerInput.style.display = "none"
				worksummary.appendChild(newWorkerInput)
			}
/*			for(var i=0;i<Object.getOwnPropertyNames(item.workforce.workchanges).length;i++) {
				
			}
*/		})
	}
	catch(e){console.log}
}

function launchCommand(message){
	try {
		if (typeof message === "undefined") {
			var command = document.getElementById("cmdline").value
			if (command === "") return;
			window.commandList.push(command)
			try {
				response = eval(command)
				newMessage = document.createElement("label")
				newMessage.innerHTML = "<span style='color: #0029cc;'>"+response+"</span>"
				document.getElementById("mainconsole").appendChild(newMessage)
				document.getElementById("mainconsole").appendChild(document.createElement("hr"))
			}
			catch(e){
				newMessage = document.createElement("label")
				newMessage.innerHTML = "<span style='color: red;'>"+e+"</span>"
				document.getElementById("mainconsole").appendChild(newMessage)
				document.getElementById("mainconsole").appendChild(document.createElement("hr"))
			}
			document.getElementById("cmdline").value = ""
		}
		else {
			newMessage = document.createElement("label")
			newMessage.innerHTML = "<span style='color: "+(message.includes("error")||message.includes("Error"))?red:black+";'>"+message+"</span>"
			document.getElementById("mainconsole").appendChild(newMessage)
			document.getElementById("mainconsole").appendChild(document.createElement("hr"))
		}
		document.getElementById("debugconsole").scrollTop = document.getElementById("debugconsole").scrollHeight+1
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
                if(!finalArray.includes(property)) finalArray.push(property)
            }
        }
    }
	return finalArray
}

function createWork(b){
	try {
		if(!window.gameStats.workforce.workers.includes(b.workforce)) window.gameStats.workforce.workers.push(b.workforce)
		// else
		window.gameStats.workforce["max"+b.workforce.maxwhat]+=b.workforce.maxchange
		if(document.getElementById("worker"+b.workforce.name) !== null) document.getElementById("worker"+b.workforce.name).max = window.gameStats.workforce["max"+b.workforce.maxwhat]
	}catch(e){console.error(e)}
}

//Totally stolen from the MDN docs :D
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}