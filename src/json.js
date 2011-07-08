pklib = pklib || {};

pklib.json = (function() {

	var obj = {

		stringify: function(obj){

			var result = '';

			if(typeof obj === "object" && typeof obj.length === "undefined"){
				result += '{';
				
				var length = 0;
				for(var item in obj){
					if(typeof item !== "function"){
						length++;
					}
				}

				var iterator = 0;
				for(var item in obj){
					if(typeof item !== "function"){
						iterator++;
						result += '"' + item + '"' + ": " + pklib.json.stringify(obj[item]);
						if(iterator !== length ){
							result += ', ';
						}
					}
				}
				result += '}';
			}

			if(typeof obj === 'array' || (typeof obj === "object" && typeof obj.length !== "undefined")){
				result += '[';
				for(var i = 0, len = obj.length; i < len; ++i){
					result += pklib.json.stringify(obj[i]);
					if(i !== (obj.length - 1) ){
						result += ', ';
					}
				}
				result += ']';
			}

			if(typeof obj === "number"){
				result += obj;
			}

			if(typeof obj === "string"){
				result += '"' + obj + '"';
			}

			if(typeof obj === 'boolean'){
				result += obj;
			}

			if(typeof obj === "function"){
				result += ''; // don't add functions
			}

			return result;	
		},
		
        // Serialize JSON to string
        serialize: function(obj, toJson){
        	var obj = obj || {},
	    		addAmp = false,
	        	response = '';
        	
        	response += (toJson) ? '{' : '';
			
			for(var i in obj){
				if(typeof obj[i] !== "function"){
					if(addAmp) {
						var lst = toJson ? ',' : '&';
						response += lst;
					} else {
						addAmp = true;
					}
					
					var value = '';
					if(typeof obj[i] !== "undefined" && obj[i] !== null){
						value = obj[i];
					}
					
					var bef = toJson ? ':' : '=';
					var mtz = toJson ? '"' : '';
					response += i + bef + mtz + value + mtz;
				}
			}
			
        	response += (toJson) ? '}' : '';
			
			return response;
        }

	};
	
	return obj;

})();
