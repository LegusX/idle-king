const tabchanger = {
	homeChanger: function() {
		var div = document.getElementById("mainhome")
		if(!div.style.display === "none") return;
		div.style.display === ""
		document.getElementById("mainresearch").style.display = "none"
		document.getElementById("mainworkers").style.display = "none"
	},
	
	researchChanger: function() {
		var div = document.getElementById("mainresearch")
		if(!div.style.display === "none") return;
		div.style.display === ""
		document.getElementById("mainhome").style.display = "none"
		document.getElementById("mainworkers").style.display = "none"
	},
	
	workChanger: function() {
		var div = document.getElementById("mainworkers")
		if(!div.style.display === "none") return;
		div.style.display === ""
		document.getElementById("mainresearch").style.display = "none"
		document.getElementById("mainhome").style.display = "none"
	}
}