const tabchanger = {
	homeChanger: function() {
		try{
			var div = document.getElementById("mainhome")
			if(div.style.display !== "none") return;
			div.style.display = ""
			document.getElementById("mainresearch").style.display = "none"
			document.getElementById("mainworkers").style.display = "none"
		}catch(e){console.log(e)}
	},
	
	researchChanger: function() {
		try{
			var div = document.getElementById("mainresearch")
			if(div.style.display !== "none") return;
			div.style.display = ""
			document.getElementById("mainhome").style.display = "none"
			document.getElementById("mainworkers").style.display = "none"
		}catch(e){console.log(e)}
	},
	
	workersChanger: function() {
		try {
			var div = document.getElementById("mainworkers")
			if(div.style.display !== "none") return;
			div.style.display = ""
			document.getElementById("mainresearch").style.display = "none"
			document.getElementById("mainhome").style.display = "none"
		}catch(e){console.log(e)}
	}
}