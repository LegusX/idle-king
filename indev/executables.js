//This is mainly for random functions that only ever get executed once or twice throughout the game
function setupWorkforce() {
	try {
		var work = document.getElementById("mainworkers");
		var worksummary = document.getElementById("workersummary");
		var buildsummary = document.getElementById("buildingsummary");

		document.getElementById("workeridle").textContent = "Idle: " + window.gameStats.workforce.idle;
		document.getElementById("workertotal").textContent = "Total: " + window.gameStats.workforce.max;

		window.RGV.workforce = true;
		window.buildings.forEach(function (item) {
			if (typeof item.workforce === "undefined") return;
			if (document.getElementById("workername" + item.workforce.name) === null && document.getElementById("worker" + item.workforce.name) === null) {
				worksummary.appendChild(document.createElement("br"));

				var newWorkerText = document.createElement("p");
				newWorkerText.textContent = item.workforce.name + ": ";
				newWorkerText.classList.add("summaryitems");
				newWorkerText.id = "workername" + item.workforce.name;
				if (!item.unlocked) newWorkerText.style.display = "none";
				worksummary.appendChild(newWorkerText);

				item.workforce.owner = item.name;

				var newWorkerInput = document.createElement("button");
				newWorkerInput.id = "worker" + item.workforce.name + "-";
				newWorkerInput.textContent = "-1";
				newWorkerInput.addEventListener("click", function (e) {
					try {
						var amount = Number(e.target.textContent.substring(1, e.target.textContent.length)) * -1
						var name = e.target.id.replace("worker", "").split("").splice(0, e.target.id.replace("worker", "").length - 1).join("");
						var work = findWork(name);
						var building = window.buildings[window.buildingNames.indexOf(work.building)]
						if (work.amount + amount < 0) return;
						if (window.gameStats.workforce.idle - amount < 0) return;
						if (work.amount + amount > building.amount * building.workforce.maxchange) return newMessage({
							type: "message",
							value: "You need to build another " + building.name + " to appoint more people to that job!"
						})
						work.amount += amount;
						window.buildings[window.buildingNames.indexOf(work.building)].workforce = work;
						window.gameStats.workforce.idle += amount * -1;
						var p = document.getElementById("worker" + work.name);
						p.textContent = work.amount
					} catch (e) {
						console.log(e)
					}
				});
				if (!item.unlocked) newWorkerInput.style.display = "none";
				worksummary.appendChild(newWorkerInput);

				var newWorkerNumber = document.createElement("p");
				newWorkerNumber.id = "worker" + item.workforce.name;
				newWorkerNumber.textContent = item.workforce.amount;
				newWorkerNumber.classList.add("summaryinput");
				if (!item.unlocked) newWorkerNumber.style.display = "none";
				worksummary.appendChild(newWorkerNumber);

				var newWorkerInput2 = document.createElement("button");
				newWorkerInput2.id = "worker" + item.workforce.name + "+";
				newWorkerInput2.textContent = "+1";
				newWorkerInput2.addEventListener("click", function (e) {
					try {
						var amount = Number(e.target.textContent.substring(1, e.target.textContent.length))
						var name = e.target.id.replace("worker", "").split("").splice(0, e.target.id.replace("worker", "").length - 1).join("");
						var work = findWork(name);
						var building = window.buildings[window.buildingNames.indexOf(work.building)]
						if (work.amount + amount < 0) return;
						if (window.gameStats.workforce.idle - amount < 0) return;
						if (work.amount + amount > building.amount * building.workforce.maxchange) return newMessage({
							type: "message",
							value: "You need to build another " + building.name + " to appoint more people to that job!"
						})
						work.amount += amount;
						window.buildings[window.buildingNames.indexOf(work.building)].workforce = work;
						window.gameStats.workforce.idle += amount * -1;
						var p = document.getElementById("worker" + work.name);
						p.textContent = work.amount
					} catch (e) {
						console.log(e)
					}
				});
				if (!item.unlocked) newWorkerInput2.style.display = "none";
				worksummary.appendChild(newWorkerInput2);


			}

		});
	} catch (e) {
		console.log(e + "SIRLY")
	}
}

function launchCommand(message) {
	try {
		if (typeof message === "undefined") {
			var command = document.getElementById("cmdline").value;
			if (command === "") return;
			window.commandList.push(command);
			try {
				response = eval(command);
				newMessage = document.createElement("label");
				newMessage.innerHTML = "<span style='color: #0029cc;'>" + response + "</span>";
				document.getElementById("mainconsole").appendChild(newMessage);
				document.getElementById("mainconsole").appendChild(document.createElement("hr"));
			} catch (e) {
				newMessage = document.createElement("label");
				newMessage.innerHTML = "<span style='color: red;'>" + e + "</span>";
				document.getElementById("mainconsole").appendChild(newMessage);
				document.getElementById("mainconsole").appendChild(document.createElement("hr"));
			}
			document.getElementById("cmdline").value = "";
		} else {
			newMessage = document.createElement("label");
			newMessage.innerHTML = "<span style='color: " + (message.includes("error") || message.includes("Error")) ? red : black + ";'>" + message + "</span>";
			document.getElementById("mainconsole").appendChild(newMessage);
			document.getElementById("mainconsole").appendChild(document.createElement("hr"));
		}
		document.getElementById("debugconsole").scrollTop = document.getElementById("debugconsole").scrollHeight + 1;
	} catch (e) {
		console.log(e)
	}
}

function iterate(obj, finalArray) {
	for (var property in obj) {
		if (!finalArray.includes(property) /*&& !Number.isInteger(Number(property))*/ ) finalArray.push(property);
		if (obj.hasOwnProperty(property) /*&& !Number.isInteger(Number(property))*/ ) {
			if (typeof obj[property] == "object" /*&&typeof obj.length == "undefined"*/ ) {
				iterate(obj[property], finalArray);
			} else {
				if (!finalArray.includes(property)) finalArray.push(property);
			}
		}
	}
	return finalArray;
}

function createWork(item) {
	try {
		var work = document.getElementById("mainworkers");
		var worksummary = document.getElementById("workersummary");
		var buildsummary = document.getElementById("buildingsummary");

		document.getElementById("workeridle").textContent = "Idle: " + window.gameStats.workforce.idle;
		document.getElementById("workertotal").textContent = "Total: " + window.gameStats.workforce.max;

		window.RGV.workforce = true;
		window.buildings.forEach(function (item) {
			if (typeof item.workforce === "undefined") return;
			if (document.getElementById("workername" + item.workforce.name) === null && document.getElementById("worker" + item.workforce.name) === null) {
				worksummary.appendChild(document.createElement("br"));
				
				var newWorkerText = document.createElement("p");
				newWorkerText.textContent = item.workforce.name + ": ";
				newWorkerText.classList.add("summaryitems");
				newWorkerText.id = "workername" + item.workforce.name;
				if (!item.unlocked) newWorkerText.style.display = "none";
				worksummary.appendChild(newWorkerText);

				item.workforce.owner = item.name;

				var newWorkerInput = document.createElement("button");
				newWorkerInput.id = "worker" + item.workforce.name + "-";
				newWorkerInput.textContent = "-1";
				newWorkerInput.addEventListener("click", function (e) {
					try {
						var amount = Number(e.target.textContent.substring(1, e.target.textContent.length)) * -1
						var name = e.target.id.replace("worker", "").split("").splice(0, e.target.id.replace("worker", "").length - 1).join("");
						var work = findWork(name);
						var building = window.buildings[window.buildingNames.indexOf(work.building)]
						if (work.amount + amount < 0) return;
						if (window.gameStats.workforce.idle - amount < 0) return;
						if (work.amount + amount > building.amount * building.workforce.maxchange) return newMessage({
							type: "message",
							value: "You need to build another " + building.name + " to appoint more people to that job!"
						})
						work.amount += amount;
						window.buildings[window.buildingNames.indexOf(work.building)].workforce = work;
						window.gameStats.workforce.idle += amount * -1;
						var p = document.getElementById("worker" + work.name);
						p.textContent = work.amount
					} catch (e) {
						console.log(e)
					}
				});
				if (!item.unlocked) newWorkerInput.style.display = "none";
				worksummary.appendChild(newWorkerInput);

				var newWorkerNumber = document.createElement("p");
				newWorkerNumber.id = "worker" + item.workforce.name;
				newWorkerNumber.textContent = item.workforce.amount;
				newWorkerNumber.classList.add("summaryinput");
				if (!item.unlocked) newWorkerNumber.style.display = "none";
				worksummary.appendChild(newWorkerNumber);

				var newWorkerInput2 = document.createElement("button");
				newWorkerInput2.id = "worker" + item.workforce.name + "+";
				newWorkerInput2.textContent = "+1";
				newWorkerInput2.addEventListener("click", function (e) {
					try {
						var amount = Number(e.target.textContent.substring(1, e.target.textContent.length))
						var name = e.target.id.replace("worker", "").split("").splice(0, e.target.id.replace("worker", "").length - 1).join("");
						var work = findWork(name);
						var building = window.buildings[window.buildingNames.indexOf(work.building)]
						if (work.amount + amount < 0) return;
						if (window.gameStats.workforce.idle - amount < 0) return;
						if (work.amount + amount > building.amount * building.workforce.maxchange) return newMessage({
							type: "message",
							value: "You need to build another " + building.name + " to appoint more people to that job!"
						})
						work.amount += amount;
						window.buildings[window.buildingNames.indexOf(work.building)].workforce = work;
						window.gameStats.workforce.idle += amount * -1;
						var p = document.getElementById("worker" + work.name);
						p.textContent = work.amount
					} catch (e) {
						console.log(e)
					}
				});
				if (!item.unlocked) newWorkerInput2.style.display = "none";
				worksummary.appendChild(newWorkerInput2);
			}
		});
	} catch (e) {
		console.error(e)
	}
}

function setupBuildings() {
	window.buildingNames = []
	for (var i = 0; i < window.buildings.length; i++) {
		window.buildingNames.push(window.buildings[i].name)
	}
	return;
}

//from https://stackoverflow.com/questions/6121203/how-to-do-fade-in-and-fade-out-with-javascript-and-css
function fade(element, t) {
	var op = 1; // initial opacity
	var timer = setInterval(function () {
		if (op <= 0.1) {
			clearInterval(timer);
			if (t) element.remove()
			else element.style.display = "none"
		}
		element.style.opacity = op;
		element.style.filter = 'alpha(opacity=' + op * 100 + ")";
		op -= op * 0.1;
	}, 50);
	return;
}

function setupUpgrade(upgrade, location) {
	try {
		if (upgrade.cost < window.gameStats.inventory.science) {
			if (document.getElementById("nothingtoupgrade").style.display !== "none") document.getElementById("nothingtoupgrade").style.display = "none"
			if (document.getElementById("upgradelist").style.display === "none") document.getElementById("upgradelist").style.display = ""
			if (document.getElementById(upgrade.name) === null) {
				var upgradeinfo = document.createElement("p")
				upgradeinfo.classList.add("resourcebuttons")
				upgradeinfo.textContent = upgrade.name
				upgradeinfo.id = upgrade.building + location
				upgradeinfo.style.display = "block"
				upgradeinfo.addEventListener("mouseover", function (e) {
					var p = e.target
					var upgrade = findBuild(p.id.substr(0, p.id.length - 1)).upgrades[p.id.split("")[p.id.length - 1]]
					document.getElementById("upgradeinfotext").textContent = upgrade.description
					document.getElementById("upgradeinfo").style.display = ""
				})
				upgradeinfo.addEventListener("mouseout", function (e) {
					document.getElementById("upgradeinfo").style.display = "none"
				})
				upgradeinfo.addEventListener("click", function (e) {
					try {
						var p = e.target
						var building = findBuild(p.id.substr(0, p.id.length - 1))
						console.log(p.id.substr(0, p.id.length - 1))
						var buildingNumber = getBuildingLocation(building.name)
						var upgrade = building.upgrades[p.id.split("")[p.id.length - 1]]
						if (upgrade.cost > window.gameStats.inventory.science) return;
						else window.gameStats.inventory.science -= upgrade.cost
						p.textContent = "Purchased!"
						fade(p, true)
						upgrade.override.forEach(function (item) {
							if (typeof window.buildings[buildingNumber][item.top] !== "object") window.buildings[buildingNumber][item.top] = item.value
							else window.buildings[buildingNumber][item.top][item.variable] = item.value
							return;
						})
						upgrade.event.forEach(function(item){
							launchEvent(item, 0, building);
						})
						window.gameStats.upgradelist.push(upgrade.name)
					} catch (e) {
						console.log(e)
					}
				})
				document.getElementById("upgradelist").appendChild(upgradeinfo)
			}
		}
	} catch (e) {
		console.log(e)
	}
}

function getBuildingLocation(name) {
	for (var i = 0; i < window.buildings.length; i++) {
		if (window.buildings[i].name === name) return i
	}
}

function getWorkforceTotal() {
	let total = 0
	for (let i in window.buildings) {
		let b = window.buildings[i]
		if (typeof b.workforce !== "undefined") total+=b.workforce.amount
	}
	return total;
}

function numberSplitter(n) {
	var a = [];
	while (n > 0) {
		var s = Math.round(Math.random()*n);
		a.push(s);
		n -= s;
	}
	return a
}

function addWorkers(n) {
	let s = ["idle", "total", "max"]
	for (let i in s) {
		window.gameStats.workforce[s[i]]+=n
	}
}