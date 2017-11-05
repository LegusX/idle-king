window.gameStats = {
	running: 1,
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
	}
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
				value: 20
			}
		],
		event: [
			{
				type: "message", //which event to launch
				value: "After several seconds of extremely hard work, you built your well desereved new hut. Congratulations", //what value it should launch
				when: 0 //At how many purchases should it be launched
				//0 based index
			},
			{
				type: "newtab",
				value: "A Wood Hut",
				when: 0,
				extra: "home" //what tab to change or just extra info that event needs.
			},
			{
				type: "message", //which event to launch
				value: "Okay, that's enough huts. You can stop now", //what value it should launch
				when: 9 //At how many purchases should it be launched
				//0 based index
			},
			{
				type: "message", //which event to launch
				value: "Seriously, you're starting to embaress me. Just stop it.", //what value it should launch
				when: 19 //At how many purchases should it be launched
				//0 based index
			},
			{
				type: "message", //which event to launch
				value: "If you build even one more hut, I will set them on fire, one by one.", //what value it should launch
				when: 29 //At how many purchases should it be launched
				//0 based index
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
				}
				//0 based index
			},
		],
		changes: []
	}
]