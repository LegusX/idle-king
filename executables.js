//This is mainly for random functions that only ever get executed once or twice throughout the game
function setupWorkforce(){
	try{
		var work = document.getElementById("mainworkers")
		var worksummary = document.getElementById("workersummary")
		var buildsummary = document.getElementById("buildingsummary")
		
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
				// newWorkerInput.extra = "stone"
				newWorkerInput.min = 0
				newWorkerInput.max = window.gameStats.workforce["max"+item.workforce.maxwhat]
				
				newWorkerInput.addEventListener("input", function(e){
					// console.log(e.target.extra)
					var target = e.target
					var total = Number(document.getElementById('workertotal').textContent.replace("Total: ", ""));
					var idle = total;
					Object.getOwnPropertyNames(window.gameStats.workincrements).forEach(function(item){
						idle-=window.gameStats.workforce[item];
					})
					if (idle-1 >= 0) {
						document.getElementById("workeridle").textContent = "Idle: "+idle-1
						window.gameStats.workforce[target.id.replace("worker", "")] = e.target.value
					}
					else {
						document.getElementById(e.target.id).value = window.gameStats.workforce[target.id.replace("worker", "")]
						console.log(window.gameStats.workforce[target.id.replace("worker", "")])
						console.log(target.id.replace("worker", ""))
					}
				})
				if(!item.unlocked) newWorkerInput.style.display = "none"
				worksummary.appendChild(newWorkerInput)
				
				window.gameStats.workforce.keys
			}
			for(var i=0;i<Object.getOwnPropertyNames(item.workforce.workchanges).length;i++) {
				
			}
		})
	}
	catch(e){console.log}
}

function launchCommand(message){
	try {
		if (typeof message === "undefined") {
			var command = document.getElementById("cmdline").value
			window.commandList.push(command)
			alert(window.commandList)
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
		document.getElementById("debugconsole").scrollTop = 4000
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
	
}