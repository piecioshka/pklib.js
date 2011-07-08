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
			var left = ( Math.max(pklib.utils.sizes.window("Width"), pklib.utils.sizes.document("Width")) - pklib.utils.sizes.obj(obj, "Width") ) / 2;
			var top = ( Math.max(pklib.utils.sizes.window("Height"), pklib.utils.sizes.document("Height")) - pklib.utils.sizes.obj(obj, "Height") ) / 2;
			pklib.utils.scrollTo(top);
		} else {
			var left = ( pklib.utils.sizes.obj(contener, "Width") - pklib.utils.sizes.obj(obj, "Width") ) / 2;
			var top = ( pklib.utils.sizes.obj(contener, "Height") - pklib.utils.sizes.obj(obj, "Height") ) / 2;
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
			
			typeof callback === "function" && callback();
			
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
			typeof callback === "function" && callback();
			
			return result;
		}
	};
	
	return obj;
	
})();
