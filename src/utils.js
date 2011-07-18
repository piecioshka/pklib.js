pklib = this.pklib || {};

pklib.utils = (function() {

	var obj = {

		addEvent : function(target, eventType, callback) {
            if (target.attachEvent) {
                utils.event.add = function(target, eventType, callback){
                    target.attachEvent("on" + eventType, callback);
                };
            } else if (target.addEventListener) {
                utils.event.add = function(target, eventType, callback){
                    target.addEventListener(eventType, callback, false);
                };
            }
            utils.event.add(target, eventType, callback);
            
            return target;
        },

		merge : function(target, source) {
			for ( var el in source) {
				if (typeof target[el] === "object") {
					if (target[el].parentNode != null) {
						target[el] = source[el];
						continue;
					}
					target[el] = this.merge(target[el], source[el]);
				} else {
					target[el] = source[el];
				}
			}
			return target;
		},

		sizes : {
			window : function getWindowSize(name) {
				var win = window;
				var docElemProp = win.document.documentElement["client" + name];
				return win.document.compatMode === "CSS1Compat" && docElemProp || win.document.body["client" + name] || docElemProp;
			},
			document : function getDocumentSizes(name) {
				var doc = document;
				var clientName = doc.documentElement["client" + name];
				var scrollBodyName = doc.body["scroll" + name];
				var scrollName = doc.documentElement["scroll" + name];
				var offsetBodyName = doc.body["offset" + name];
				var offsetName = doc.documentElement["offset" + name];
				return Math.max(clientName, scrollBodyName, scrollName, offsetBodyName, offsetName);
			},
			obj : function getObjSizes(obj, name) {
			    var client = obj["client" + name];
			    var scroll = obj["scroll" + name];
			    var offset = obj["offset" + name];
				return Math.max(client, scroll, offset);
			}
		},

		clearfocus : function(obj) {
			if (typeof obj !== "undefined") {
				pklib.utils.addEvent(obj, "focus", function() {
					if (this.value === this.defaultValue) {
						this.value = "";
					}
				});
				pklib.utils.addEvent(obj, "blur", function() {
					if (this.value === "") {
						this.value = this.defaultValue;
					}
				});
			}
		},

		outerlink : function(area) {
			area = area || document;
			var links = area.getElementsByTagName("a");
			for ( var i = 0, len = links.length; i < len; ++i) {
				var link = links[i];
				if (link.rel === "outerlink") {
					pklib.utils.addEvent(link, "click", function outerlink(e) {
						window.open(this.href);
						e.preventDefault();
					});
				}
			}
		},

		confirm : function(element, text) {
			if (typeof element !== "undefined") {
				text = text || "Sure?";

				pklib.utils.addEvent(element, "click", function(evt) {
					var response = confirm(text);
					if(true === response){
						return true;
					} else {
						evt.preventDefault();
					}
				});
			}
		},

		ascii : {
			letters : {
				lower : [ 113, 119, 101, 114, 116, 121, 117, 105, 111, 112, 97,
						115, 100, 102, 103, 104, 106, 107, 108, 122, 120, 99,
						118, 98, 110, 109 ],
				upper : [ 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 65, 83, 68,
						70, 71, 72, 74, 75, 76, 90, 88, 67, 86, 66, 78, 77 ]
			}
		},

		chars : [ " ", "-", "_", "\n", "\r", "\t" ],

		ltrim : function(source) {
			if (typeof source === "string") {
				return source.replace(new RegExp("^[" + this.chars + "]+", "g"), "");
			}
			return source;
		},

		rtrim : function(source) {
			if (typeof source === "string") {
				return source.replace(new RegExp("[" + this.chars + "]+$", "g"), "");
			}
			return source;
		},

		trim : function(source) {
			if (typeof source === "string") {
				return this.ltrim(this.rtrim(source));
			}
			return source;
		},

		slug : function(text) {
			if (typeof text === "string") {
				var result = '';
				for ( var i = 0; i < text.length; ++i) {
					var letter = text[i].toLowerCase().charCodeAt(0);
					switch (letter) {
					case 380:
					case 378:
						result += 'z';
						break;
					case 347:
						result += 's';
						break;
					case 324:
						result += 'n';
						break;
					case 322:
						result += 'l';
						break;
					case 263:
						result += 'c';
						break;
					case 261:
						result += 'a';
						break;
					case 243:
						result += 'o';
						break;
					case 281:
						result += 'e';
						break;

					case 63:
					case 43:
					case 42:
					case 32:
					case 33:
						result += '-';
						break;
					default:
						result += String.fromCharCode(letter);
					}
				}
				return result;
			}
			return text;
		},

		scrollTo : function(prop, animate) {
			if (animate) {
				var scrollTopInterval = setInterval(function() {
					document.body.scrollTop -= 5;
					if (document.body.scrollTop <= 0) {
						clearInterval(scrollTopInterval);
					}
				}, 1);
			} else {
				document.body.scrollTop = prop;
			}
		}

	};

	return obj;

})();