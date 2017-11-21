try {
	window.version = "0.0.7"
	window.gameStats = {
		running: 1,
		version: "0.0.7",
		inventory: {
			wood: 0,
			stone: 0,
			wheat: 0,
			gold: 0
		},
		selfincrements: {
			wood: 1,
			stone: 1,
			wheat: 1,
			gold: 1
		},
		workforce: {
			wood: 0,
			stone: 0,
			wheat: 0,
			gold: 0,
			maxwood: 0,
			maxstone: 0,
			maxwheat: 0,
			maxgold: 0,
			idle: 0,
			total: 0,
			max: 0,
			keys: {}
		},
		workincrements: {
			wood: 1,
			stone: 1,
			wheat: 1,
			gold: 1,
		},
		misc: {
			time: 0,
			clicks: 0
		}
	}
	
	window.settings = {
		maxmessages: 15,
		autosaveTime: 0.1
	}
	
	window.misc = {
		time: 0,
		clicks: 0,
		resourceclicks: 0
	}
	
	window.buildings = [
		{
			name: "Wood Hut",
			amount: 0,
			max: 0,
			unlocked: false,
			resources: [
				{
					name: "wood",
					value: 20, //This value changes every time a new building is bought
					base: 20 //This will never change and is the starting value for cost
				}
			],
			extra: 0,
			multi: 1.1, //How much the resource costs should be multiplied by whenever a new building is bought
			event: [
				{
					type: "message", //which event to launch
					value: "After several seconds of extremely hard work, you built your well desereved new hut. Congratulations", //what value it should launch
					when: 0, //At how many purchases should it be launched
					//0 based index
					launched: false
				},
				{
					type: "newtab",
					value: "A Wood Hut",
					when: 0,
					extra: "home", //what tab to change or just extra info that event needs.
					launched: false
				},
				{
					type: "message", //which event to launch
					value: "Okay, that's enough huts. You can stop now", //what value it should launch
					when: 9, //At how many purchases should it be launched
					//0 based index
					launched: false
				},
				{
					type: "message", //which event to launch
					value: "Seriously, you're starting to embarrass me. Just stop it.", //what value it should launch
					when: 19, //At how many purchases should it be launched
					//0 based index
					launched: false
				},
				{
					type: "message", //which event to launch
					value: "If you build even one more hut, I will set them on fire, one by one.", //what value it should launch
					when: 29, //At how many purchases should it be launched
					//0 based index
					launched: false
				},
				{
					type: "achieve",
					value: "He did warn you.",
					extra: "The narrator burned down your hideous wood huts.",
					when: 30,
					launched: false
				},
				{
					type: "message", //which event to launch
					value: "The narrator has burned down all of your wood huts.", //what value it should launch
					when: 30, //At how many purchases should it be launched
					change: {
						operation: "subtract", // same as normal change
						high: "buildings", //which global variable to change
						what: "Wood Hut", //Name of building to change amount of
						which: "amount",
						by: 31
					},
					launched: false
					//0 based index
				}
			],
			execute: function(){
				window.buildings[0].extra = setInterval(function(){
					if (window.buildings[2].amount > 0 &&document.getElementById("workers").style.display === "none") {
						clearInterval(window.buildings[0].extra)
						editTab({
							extra: "workers",
							value: "Workforce"
						})
						setupWorkforce()
						newMessage({value:"If I were you, I would check out that new Workforce tab up at the top."})
					}
				}, 500)
			},
			changes: [
				{
					high: "gameStats",
					what: "workforce",
					which: "max",
					operation: "add",
					by: 2
				}
			]
		},
		{
			name: "Mine",
			amount: 0,
			max: 0,
			unlocked: false,
			resources: [
				{
					name: "wood",
					value: 40,
					base: 40
				}
			],
			multi: 1.1,
			event: [
				{
					type:"message",
					value: "Hey, look! You can press four buttons now!",
					when: 0,
					launched: false
				},
				{
					type:"message",
					value: "This mountain shall forever be called \"Swiss Cheese Mountain\"",
					when: 9,
					launched: false
				},
				{
					type:"message",
					value: "Now while I'm usually not one to be concerned for your welfare, the amount of holes in this single mountain seems to be unsafe.",
					when: 29,
					launched: false
				},
				{
					type:"message",
					value: "This mountain isn't going to last much longer. o_O",
					when: 39,
					launched: false
				},
				{
					type:"message",
					value: "I give up, it's your death you're begging for",
					when: 54,
					launched: false
				}
			],
			changes: [
				{
					high: "gameStats",
					what: "selfincrements",
					which: "stone",
					operation: "add",
					by: 0.25
				}
			],
			workforce: {
				maxchange: 5,
				maxwhat: "stone",
				name: "Miners",
				workchanges: {
					stone: 1,
					wheat: -0.5
				}
			},
			execute: function(){
				try {
				if (document.getElementById("gatherstone").style.display !== "none") return;
				document.getElementById("gatherstone").style.display = ""
				document.getElementById("gatherstone").addEventListener("click", function(){
					if (window.buildings[1].amount !== 1) {
						window.gameStats.inventory.stone+=window.gameStats.selfincrements.stone
					}
					else {
						window.gameStats.selfincrements.stone = 1
						window.gameStats.inventory.stone++
					}
				})
				return;
				}
				catch(e){console.log(e)}
			}
		},
		{
			name: "Farm",
			amount: 0,
			max: 0,
			unlocked: false,
			resources: [
				{
					name: "wood",
					value: 50,
					base: 50,
				},
				{
					name: "stone",
					value: 30,
					base: 30
				}
			],
			multi: 1.1,
			event: [
				{
					type: "message",
					value: "Hey, maybe you won't starve to death now!",
					when: 0,
					launched: false
				},
				{
					type: "message",
					value: "Ooh, you could even feed me now!",
					when: 5,
					launched: false
				},
				{
					type: "message",
					value: "You should probably consider getting some other people to help you, now that you can actually feed them too.",
					when: 15,
					launched: false
				}
			],
			execute: function(){
				if (document.getElementById("gatherwheat").style.display === "none") {
					document.getElementById("gatherwheat").style.display = ""
					// document.getElementById("gatherwheat").textContent = "Gather Wheat"
				}
				// document.getElementById("gatherwheat").addEventListener("click", function(){
					// if (document.getElementById("gatherwheat").textContent === "Gather Wheat") {
						
						// Later, if I still want to add this
						// setInterval(function(){
						// 	document.getElementById("gatherwheat").style.cssText = "background-color: "+document.getElementById("gatherwheat").style.cssText.subStr(18)
						// })
					// }
				document.getElementById("gatherwheat").addEventListener("click", function(){
					if (window.buildings[2].amount !== 1) {
						window.gameStats.inventory.wheat+=window.gameStats.selfincrements.wheat;
					}
					else {
						window.gameStats.selfincrements.wheat = 1;
						window.gameStats.inventory.wheat++;
					}
				// })
				});
			},
			changes: [
				{
					high: "gameStats",
					what: "selfincrements",
					which: "wheat",
					operation: "add",
					by: 1
				}
			]
		}
	];
	
	window.unlockedAchieve = [];
	window.achievements = [];
	window.RGV = {
		blacklist: ["event", "changes", "execute", "change"], //Add variables that you don't want in
		workforce: false
	}; //Random Global Variables
}
catch(e){console.log(e)}