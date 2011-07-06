pklib = this.pklib || {};
pklib.file = pklib.file || {};

pklib.file.load = (function(){
	var doc = document;
	return function(src, callback){
		var script = doc.createElement("script");
		script.type = "text/javascript";
		script.src = src;
		
		if(script.readyState){
			// IE
			script.onreadystatechange = function(){
				if(script.readyState === "loaded" || script.readyState === "complete"){
					script.onreadystatechange = null;
					typeof callback === "function" && callback();
				}
			};
		} else {
			// Others
			script.onload = function(){
				typeof callback === "function" && callback();
			};
		}
		
		doc.getElementsByTagName("head")[0].appendChild(script);
		
	};
})();