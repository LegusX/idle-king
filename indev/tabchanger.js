// try {
	window.tabids = ["mainresearch","mainworkers","mainhome","mainstorage"]
const tabchanger = {
	homeChanger: function() {
		try {
			var div = document.getElementById("mainhome");
			if(div.style.display !== "none") return;
			div.style.display = "";
			document.getElementById(div.id.replace("main", "")).classList.add("selectedDiv")
			for (let i in window.tabids) {
				if (window.tabids[i] !== div.id) {
					document.getElementById(window.tabids[i]).style.display = "none"
					document.getElementById(window.tabids[i].replace("main", "")).classList.remove("selectedDiv")
				}
			}
		}catch(e){console.log(e)}
	},
	
	researchChanger: function() {
		try {
			var div = document.getElementById("mainresearch")
			if(div.style.display !== "none") return;
			div.style.display = ""
			document.getElementById(div.id.replace("main", "")).classList.add("selectedDiv")
			for (let i in window.tabids) {
				if (window.tabids[i] !== div.id) {
					document.getElementById(window.tabids[i]).style.display = "none"
					document.getElementById(window.tabids[i].replace("main", "")).classList.remove("selectedDiv")
				}
			}
		}catch(e){console.log(e)}
	},
	
	workersChanger: function() {
		try {
			var div = document.getElementById("mainworkers")
			if(div.style.display !== "none") return;
			div.style.display = ""
			document.getElementById(div.id.replace("main", "")).classList.add("selectedDiv")
			for (let i in window.tabids) {
				if (window.tabids[i] !== div.id) {
					document.getElementById(window.tabids[i]).style.display = "none"
					document.getElementById(window.tabids[i].replace("main", "")).classList.remove("selectedDiv")
				}
			}
		}catch(e){console.log(e)}
	},
	storageChanger: function() {
		try {
			var div = document.getElementById("mainstorage")
			if(div.style.display !== "none") return;
			div.style.display = ""
			document.getElementById(div.id.replace("main", "")).classList.add("selectedDiv")
			for (let i in window.tabids) {
				if (window.tabids[i] !== div.id) {
					document.getElementById(window.tabids[i]).style.display = "none"
					document.getElementById(window.tabids[i].replace("main", "")).classList.remove("selectedDiv")
				}
			}
		}catch(e){console.log(e)}
	}
};

// }catch(e){console.log(e)}