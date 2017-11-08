window.gameStats = {
	running: 1,
	version: "0.0.1",
	inventory: {
		wood: 20,
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
		wood: 1,
		stone: 0,
		wheat: 0,
		gold: 0,
		maxwood: 0,
		maxstone: 0,
		maxwheat: 0,
		maxgold: 0
	},
	workincrements: {
		wood: 20,
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
		changes: []
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
				value: "Hey, look! You can press three buttons now!",
				when: 0,
				launched: false
			}
		],
		execute: function(){
			if (document.getElementById("gatherstone").style.display !== "none") return;
			document.getElementById("gatherstone").style.display = ""
			document.getElementById("gatherstone").addEventListener("click", function(){
				window.gameStats.inventory.stone+=window.gameStats.selfincrements.wood
			})
		}
	}
]

window.unlockedAchieve = []
window.achievements = []