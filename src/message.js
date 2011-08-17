/**
 * @package pklib.message
 * @dependence pklib.utils
 */
pklib = this.pklib || {};

pklib.message = (function(){
	
	var doc = document,
		id = "pklib-message-wrapper",
		contents = null,
		settings = {
			contener: doc.getElementsByTagName("body")[0],
			style: {
				width: 300,
				height: 300,
				zIndex: 1010
			}
		};
	
	var _center = function(obj, contener){
		if(contener === doc.getElementsByTagName("body")[0]){
			var left = ( Math.max(pklib.utils.size.window("width"), pklib.utils.size.document("width")) - pklib.utils.size.obj(obj, "width") ) / 2;
			var top = ( Math.max(pklib.utils.size.window("height"), pklib.utils.size.document("height")) - pklib.utils.size.obj(obj, "height") ) / 2;
			pklib.utils.scrollTo(top);
		} else {
			var left = ( pklib.utils.size.obj(contener, "width") - pklib.utils.size.obj(obj, "width") ) / 2;
			var top = ( pklib.utils.size.obj(contener, "height") - pklib.utils.size.obj(obj, "height") ) / 2;
		}
		obj.style.left = left;
		obj.style.top = top;
		return [left, top];
	};
	
	var obj = {
		objId: id,
		content: contents,
		show: function(config, callback){
			settings = pklib.utils.merge(settings, config);
			
			var message = doc.createElement("div");
			var messageStyle = message.style;
			
			message.setAttribute("id", obj.objId);
			for(var style in settings.style){
				messageStyle[style] = settings.style[style];
			}
			
			if(typeof obj.content === "string"){
				message.innerHTML = obj.content; 
			} else if(typeof obj.content === "object"){
				message.appendChild(obj.content);
			}
			
			settings.contener.appendChild(message);
			
			_center(message, settings.contener);
			
			pklib.utils.addEvent(window, "resize", function(){
				_center(message, settings.contener);
			});
			
			(typeof callback === "function") && callback();
			
			return message;
		},
		close: function(callback){
			var message = doc.getElementById(obj.objId);
			var result = false;
			if(message !== null){
				message.parentNode.removeChild(message);
				obj.close(callback);
				result = true;
			}
			(typeof callback === "function") && callback();
			
			return result;
		}
	};
	
	return obj;
	
})();
