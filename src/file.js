pklib = this.pklib || {};

pklib.file = (function() {

	return {

		attach: function(data, callback) {
	    	var file = document.createElement(data.tag);

			for(var key in data){
	            file[key] = data[key];
			}

			var attach_file = document.getElementsByTagName(data.section).item(0).appendChild(file);
			
			if(attach_file.readyState){
				// IE
				attach_file.onreadystatechange = function(){
					if(attach_file.readyState == "loaded" || attach_file.readyState == "complete") {
						attach_file.onreadystatechange = null;
						if(typeof callback === 'function'){
							callback(attach_file);
						}
					}
				}
			} else {
				// Others
				if(typeof callback === 'function'){
					attach_file.onload = function(){
						callback(attach_file);
					}
				}
			}
	        
	        return attach_file;
	    },

		loadScript: function(url, callback){
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = url;
			
			if(script.readyState){
				// IE
				script.onreadystatechange = function(){
					if(script.readyState == "loaded" || script.readyState == "complete") {
						script.onreadystatechange = null;
						if(typeof callback === 'function'){
							callback(script);
						}
					}
				}
			} else {
				// Others
				if(typeof callback === 'function'){
					script.onload = function(){
						callback(script);
					}
				}
			}

			document.getElementsByTagName("head").item(0).appendChild(script);
		}

	};

})();
