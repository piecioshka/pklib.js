pklib = this.pklib || {};

pklib.glass = (function(){

	var doc = document,
		id = "pklib-glass-wrapper",
		contents = null,
		settings = {
			contener: doc.getElementsByTagName("body")[0],
			style: {
				position: 'absolute',
				left: 0,
				top: 0,
				background: '#000',
				opacity: 0.5,
				zIndex: 1000
			}
		};

	var _fill = function(obj, contener){
		if(contener === doc.getElementsByTagName("body")[0]){
			var width = Math.max(pklib.utils.sizes.window("Width"), pklib.utils.sizes.document("Width"));
			var height = Math.max(pklib.utils.sizes.window("Height"), pklib.utils.sizes.document("Height"));
			if(pklib.browser.getName() === "msie"){
				width -= 20;
			}
		} else {
			var width = pklib.utils.sizes.obj(contener, "Width");
			var height = pklib.utils.sizes.obj(contener, "Height");
		}
		obj.style.width = width;
		obj.style.height = height;
		return [width, height];
	};
	
	var obj = {
		objId: id,
		show: function(config, callback){
			settings = pklib.utils.merge(settings, config);
			settings.style.filter = 'alpha(opacity='+ parseFloat(settings.style.opacity, 10) * 100 + ')';
			
			var glass = doc.createElement("div");
			var glassStyle = glass.style;
			
			glass.setAttribute("id", obj.objId);
			for(var style in settings.style){
				glassStyle[style] = settings.style[style];
			}
			
			if(typeof obj.content === "string"){
				glass.innerHTML = obj.content; 
			} else if(typeof obj.content === "object"){
				glass.appendChild(obj.content);
			}
			
			settings.contener.appendChild(glass);
			
			_fill(glass, settings.contener);
			
			pklib.utils.addEvent(window, "resize", function(){
				obj.close();
				obj.show(config, callback);
				_fill(glass, settings.contener);
			});
			
			typeof callback === "function" && callback();
		},
		close: function(callback){
			var glass = doc.getElementById(obj.objId);
			var result = false;
			if(glass !== null){
				glass.parentNode.removeChild(glass);
				obj.close(callback);
				result = true;
			}
			typeof callback === "function" && callback();
			
			return result;
		}
	};
	
	return obj;
	
})();
