/**
 * @package pklib.json
 */
pklib = this.pklib || {};

pklib.json = (function() {

	var obj = {

		stringify: function(obj, ind){
		    var source = "",
		        type = "",
		        ind = ind || 0;
		        
		    
		    function indent(len){
		        for(var i = 0, preffix = "\t", source = ""; i < len; ++i){
		            source += preffix;
		        }
		        return source;
		    }
		    
		    // Null
		    if(obj == null){
		        type = "null";
		        return type;
		    } else 
		        
	        // Undefined
	        if(typeof obj === "undefined"){
	            type = "undefined";
	            return type;
	        } else
               
            // Boolean
            if(typeof obj === "boolean"){
                type = "boolean";
                return obj;
            } else 
            
            // Number
            if(typeof obj === "number"){
                type = "number";
                return obj;
            } else 
            
            // String
            if(typeof obj === "string"){
                type = "string";
                return '"' + obj + '"';
            } else 
            
            // Function
            if(typeof obj === "function"){
                type = "function";
                
                function __getName(fun) {
                    var text = fun.toString();
                    text = text.split("\n")[0].replace("function ", "");
                    return text.substr(0, text.indexOf("(")) + "()";
                }
                
                return __getName(obj);
            } else 
            
            // Array
            if(typeof obj === "object" && typeof obj.slice === "function"){
                type = "array";
                if(obj.length === 0) {
                    return "[]";
                }
                source = "[\n" + indent(ind);
                ind++;
                for(var i = 0, len = obj.length; i < len; ++i){
                    source += indent(ind) + arguments.callee(obj[i], ind);
                    if(i !== len - 1){
                        source += ",\n";
                    }
                }
                ind--;
                source += "\n" + indent(ind) + "]";
            } else 
            
            // Object
            if(typeof obj === "object"){
                type = "object";
                
                function __getLast(obj){
                    for(var i in obj){} return i;
                }
                
                source = "{\n";
                ind++;
                for(var item in obj){
                    source += indent(ind) + item + ": " + arguments.callee(obj[item], ind);
                    if(item !== __getLast(obj)){
                        source += ",\n";
                    }
                }
                ind--;
                source += "\n" + indent(ind) + "}";
            }

			return source;
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
