pklib = pklib || {};

pklib.json = (function() {
	
	return {
	
		stringify: function(obj){
		
			var result = '';
			
			if(typeof obj === 'object' && typeof obj.length === 'undefined'){
				result += '{';
				
				var length = 0;
				for(var item in obj){
					if(typeof item !== 'function'){
						length++;
					}
				}
				
				var iterator = 0;
				for(var item in obj){
					if(typeof item !== 'function'){
						iterator++;
						result += '"' + item + '"' + ": " + pklib.json.stringify(obj[item]);
						if(iterator !== length ){
							result += ', ';
						}
					}
				}
				result += '}';
			}
			
			if(typeof obj === 'array' || (typeof obj === 'object' && typeof obj.length !== 'undefined')){
				result += '[';
				for(var i = 0; i < obj.length; ++i){
					result += pklib.json.stringify(obj[i]);
					if(i !== (obj.length - 1) ){
						result += ', ';
					}
				}
				result += ']';
			}
		
			if(typeof obj === 'number'){
				result += obj;
			}
			
			if(typeof obj === 'string'){
				result += '"' + obj + '"';
			}
			
			if(typeof obj === 'boolean'){
				result += obj;
			}
			
			if(typeof obj === 'function'){
				result += ''; // don't add functions
			}
			
			return result;	
			
		}
	
	};
	
})();