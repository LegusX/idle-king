		var saveData = {
			gameStats: window.gameStats,
			buildings: window.buildings,
			settings: window.settings,
			misc: window.misc,
			ua: window.unlockedAchieve
		};
var finishedArray = [];
Object.getOwnPropertyNames(saveData).forEach(function(item){
	var object = saveData[item];
	if(!finishedArray.includes(item))finishedArray.push(item);
	addArrays(object);
});

function addArrays(object) {
	if (typeof object !== "object") return;
	if (typeof object[0] !== "undefined") return;
	else {
		Object.getOwnPropertyNames(object).forEach(function(item){
			if(!finishedArray.includes(item))finishedArray.push(item);
			addArrays(object);
		});
	}
}
console.log(finishedArray);