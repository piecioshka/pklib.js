/*!
 * pklib JavaScript library 1.0.0
 * http://pklib.com/
 * 
 * Copyright 2011, Piotr Kowalski
 * Public Domain
 * http://pklib.com/license
 * 
 * Date: Mon Aug 22 09:21:07 GMT 2011
 */

// pklib definition and initialization
pklib = this.pklib || {
    author : "Piotr Kowalski",
    www : "http://pklib.pl/",
    version : "1.0.0",
};
	
/**
 * @package pklib.browser
 */
pklib = this.pklib || {};
pklib.browser = (function() {

    var browsers = [ "msie", "chrome", "safari", "opera", "mozilla", "konqueror" ];

    var __browser = {

        getName : function() {
            var userAgent = navigator.userAgent.toLowerCase();

            for ( var i = 0, len = browsers.length; i < len; ++i) {
                var browser = browsers[i];
                if (new RegExp(browser).test(userAgent)) {
                    return browser;
                }
            }
            return undefined;
        },

        getVersion : function() {
            var userAgent = navigator.userAgent.toLowerCase();

            for ( var i = 0, len = browsers.length; i < len; ++i) {
                var browser = browsers[i], len = browser.length, cur = userAgent.indexOf(browser);
                if (cur != -1) {
                    return userAgent.substr(cur + len + 1, 3);
                }
            }
            return undefined;
        }
    };

    return __browser;

})();
	
/**
 * @package pklib.utils
 * @dependence pklib.browser
 */
pklib = this.pklib || {};
pklib.utils = (function() {
    
    var doc = document;

    var __utils = {
            
        css: {
            
            addClass : function(el, cls) {
                if(typeof el === "undefined" || el == null || typeof cls === "undefined"){
                    throw new TypeError();
                }
                var c = el.className;
                if(!this.hasClass(el, cls)){
                    if (c.length) {
                        c += " " + cls;
                    } else {
                        c = cls;
                    }
                }
                el.className = c;
            },
            
            removeClass : function(el, cls) {
                if(typeof el === "undefined" || el == null || typeof cls === "undefined"){
                    throw new TypeError();
                }
                var regexp = new RegExp("(\s" + cls + ")|(" + cls + "\s)|" + cls, "i");
                el.className = el.className.replace(regexp, "");
            },
            
            hasClass : function(el, cls) {
                if(typeof el === "undefined" || el == null || typeof cls === "undefined"){
                    throw new TypeError();
                }
                var regexp = new RegExp("(\s" + cls + ")|(" + cls + "\s)|" + cls, "i");
                return regexp.test(el.className);
            }
            
        },

        dom: {
            
            byId : function(id, area) {
                area = area || doc;
                return area.getElementById(id);
            },
            
            byTag : function(tag, area) {
                area = area || doc;
                return area.getElementsByTagName(tag);
            },
            
            index : function(obj) {
                var parent = obj.parentNode;
                var elements = this.children(parent);
                for ( var i = 0, len = elements.length; i < len; ++i) {
                    var item = elements[i];
                    if (item === obj) {
                        return i;
                    }
                }
                return null;
            },
            
            children : function(obj) {
                for ( var i = 0, arr = [], childs = obj.childNodes, len = childs.length; i < len; ++i) {
                    if (childs[i].nodeType !== doc.TEXT_NODE) {
                        arr.push(childs[i]);
                    }
                }
                return arr;
            },
            
            center : function(obj, contener) {
                if (contener === doc.getElementsByTagName("body")[0]) {
                    var left = (Math.max(pklib.utils.size.window("width"), pklib.utils.size.document("width")) - pklib.utils.size.object(obj, "width")) / 2;
                    var top = (Math.max(pklib.utils.size.window("height"), pklib.utils.size.document("height")) - pklib.utils.size.object(obj, "height")) / 2;
                    pklib.utils.scrollTo(top);
                } else {
                    var left = (pklib.utils.size.window("width") - pklib.utils.size.object(obj, "width")) / 2;
                    var top = (pklib.utils.size.window("height") - pklib.utils.size.object(obj, "height")) / 2;
                }
                obj.style.left = left + "px";
                obj.style.top = top + "px";
                obj.style.position = "absolute";
                return [ left, top ];
            }
            
        },

        array : {

            unique : function(array) {
                for ( var i = 0, temp = [], len = array.length; i < len; ++i) {
                    if (!this.inArray.call(null, temp, array[i])) {
                        temp.push(array[i]);
                    }
                }
                return temp;
            },

            inArray : function(array, param) {
                for ( var i = 0, len = array.length; i < len; ++i) {
                    if (array[i] === param) {
                        return i;
                    }
                }
                return false;
            },

            remove : function(array /*  */) {
                var params = Array.prototype.splice.call(arguments, 1);
                for ( var i = 0, len = params.length; i < len; ++i) {
                    var param = params[i], inside = this.inArray(array, param);
                    if (inside !== false) {
                        array.splice(inside, 1);
                    }
                }
                return array;
            }

        },

        event : {

            add : function(target, eventType, callback) {
                if (target.attachEvent) {
                    this.add = function(target, eventType, callback) {
                        target.attachEvent("on" + eventType, callback);
                    };
                } else if (target.addEventListener) {
                    this.add = function(target, eventType, callback) {
                        target.addEventListener(eventType, callback, false);
                    };
                }
                this.add(target, eventType, callback);
            }

        },

        size : {

            window : function(name) {
                name = pklib.utils.string.capitalize(name);
                var win = window, clientName = win.document.documentElement["client" + name];
                return win.document.compatMode === "CSS1Compat" && clientName || win.document.body["client" + name] || clientName;
            },

            document : function(name) {
                name = pklib.utils.string.capitalize(name);
                var clientName = doc.documentElement["client" + name], scrollBodyName = doc.body["scroll" + name], scrollName = doc.documentElement["scroll" + name], offsetBodyName = doc.body["offset" + name], offsetName = doc.documentElement["offset" + name];
                return Math.max(clientName, scrollBodyName, scrollName, offsetBodyName, offsetName);
            },

            object : function(obj, name) {
                name = pklib.utils.string.capitalize(name);
                var client = obj["client" + name], scroll = obj["scroll" + name], offset = obj["offset" + name];
                return Math.max(client, scroll, offset);
            }

        },

        ascii : {

            letters : {
                lower : [ 113, 119, 101, 114, 116, 121, 117, 105, 111, 112, 97, 115, 100, 102, 103, 104, 106, 107, 108, 122, 120, 99, 118, 98, 110, 109 ],
                upper : [ 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 65, 83, 68, 70, 71, 72, 74, 75, 76, 90, 88, 67, 86, 66, 78, 77 ]
            }

        },
        
        date: {
        
            getFullMonth : function() {
                var month = (parseInt(new Date().getMonth(), 10) + 1);
                return (month < 10) ? "0" + month : month;
            }
        
        },

        string : {

            chars : [ " ", "-", "_", "\n", "\r", "\t" ],

            ltrim : function(source) {
                return source.replace(new RegExp("^[" + this.chars + "]+", "g"), "");
            },

            rtrim : function(source) {
                return source.replace(new RegExp("[" + this.chars + "]+$", "g"), "");
            },

            trim : function(source) {
                return this.ltrim(this.rtrim(source));
            },

            slug : function(source) {
                for ( var i = 0, result = '', len = source.length; i < len; ++i) {
                    var letter = source[i].toLowerCase().charCodeAt(0);
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
            },

            isLetter : function(source) {
                return /^[a-zA-Z]$/.test(source);
            },

            capitalize : function(source) {
                return source.substr(0, 1).toUpperCase() + source.substring(1, source.length).toLowerCase();
            },

            delimiterSeparatedWords : function(source) {
                return source.replace(/[A-Z]/g, function(match) {
                    return "-" + match.toLowerCase();
                });
            },

            camelCase : function(source) {
                while (source.indexOf("-") != -1) {
                    var pos = source.indexOf("-"), 
                        pre = source.substr(0, pos), 
                        sub = source.substr(pos + 1, 1).toUpperCase(), 
                        post = source.substring(pos + 2, source.length);
                    source = pre + sub + post;
                }
                return source;
            }

        },

        merge : function(target, source) {
            for ( var el in source) {
                if (source.hasOwnProperty(el)) {
                    if (typeof target[el] === "object" && target[el] != null) {
                        if (target[el].parentNode != null) {
                            target[el] = source[el];
                            continue;
                        }
                        target[el] = arguments.callee(target[el], source[el]);
                    } else {
                        target[el] = source[el];
                    }
                }
            }
            return target;
        },

        clearfocus : function(obj) {
            if (typeof obj !== "undefined") {
                pklib.utils.event.add(obj, "focus", function() {
                    if (this.value === this.defaultValue) {
                        this.value = "";
                    }
                });
                pklib.utils.event.add(obj, "blur", function() {
                    if (this.value === "") {
                        this.value = this.defaultValue;
                    }
                });
            }
        },

        outerlink : function(area) {
            area = area || doc;
            var links = area.getElementsByTagName("a");
            for ( var i = 0, len = links.length; i < len; ++i) {
                var link = links[i];
                if (link.rel === "outerlink") {
                    pklib.utils.event.add(link, "click", function(e) {
                        window.open(this.href);
                        e.preventDefault();
                    });
                }
            }
        },

        confirm : function(element, text) {
            if (typeof element !== "undefined") {
                text = text || "Sure?";

                pklib.utils.event.add(element, "click", function(evt) {
                    var response = confirm(text);
                    if (true === response) {
                        return true;
                    } else {
                        evt.preventDefault();
                    }
                });
            }
        },

        scrollTo : function(param, animate) {
            if (true === animate) {
                var scrollTopInterval = setInterval(function() {
                    doc.body.scrollTop -= 5;
                    if (doc.body.scrollTop <= 0) {
                        clearInterval(scrollTopInterval);
                    }
                }, 1);
            } else {
                doc.body.scrollTop = param;
            }
        }

    };

    return __utils;

})();
	
/**
 * @package app.ajax
 * @dependence pklib.utils
 */
pklib = this.pklib || {};
pklib.cache = [];
pklib.ajax = (function() {

    var client = null, _settings = {}, _states = [];

    function __init() {
        client = null, _settings = {
            type : "get",
            async : true,
            cache : false,
            url : null,
            params : null,
            headers : {
                "Accept-Encoding" : "gzip"
            },

            unset : function(data) {
            },
            opened : function(data) {
            },
            headersReceived : function(data) {
            },
            loading : function(data) {
            },
            done : function(data) {
            }
        }, _states = [];
    }

    function handler() {
        var method = "responseText";
        
        if (this.readyState === 4) {
            pklib.cache[_settings.url] = this;

            var ct = this.getResponseHeader("Content-Type"),
                xmlct = [ "application/xml", "text/xml" ];

            if (pklib.utils.array.inArray(ct, xmlct)) {
                method = "responseXML";
            }

        }
        _states[this.readyState].call(null, this[method]);
    }

    return function(obj) {

        __init();

        _settings = pklib.utils.merge(_settings, obj);
        _settings.type = _settings.type.toUpperCase();
        _states = [ _settings.unset, _settings.opened, _settings.headersReceived, _settings.loading, _settings.done ];

        if (_settings.cache && pklib.cache[_settings.url]) {
            handler.call(pklib.cache[_settings.url]);
        } else {
            client = new XMLHttpRequest();
            client.onreadystatechange = function(){
                handler.call(client);
            };
            client.open(_settings.type, _settings.url, _settings.async);
            if (_settings.headers != null) {
                for ( var item in _settings.headers ) {
                    client.setRequestHeader(item, _settings.headers[item]);
                }
            }
            client.send(_settings.params);
        }

    };

})();
	
/**
 * @package pklib.cookie
 */
pklib = this.pklib || {};
pklib.cookie = (function() {
    
    var doc = document;

    var __cookie = {

        create : function(name, value, days) {
            value = value || null;
            var expires = '';

            if (typeof days !== "undefined") {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = '; expires=' + date.toGMTString();
            }

            doc.cookie = name + '=' + value + expires + '; path=/';

            return this.read(name);
        },

        read : function(name) {
            if(typeof name === "undefined"){
                return;
            }
            name = name + '='; 
            var ca = doc.cookie.split(';');

            for ( var i = 0, len = ca.length; i < len; ++i) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }

            return undefined;
        },

        erase : function(name) {
            return this.create(name, undefined, -1);
        }

    };

    return __cookie;

})();
	
/**
 * @package pklib.file
 */
pklib = this.pklib || {};
pklib.file = (function() {

    var doc = document;

    var __file = {

        load : function(src, callback) {
            var script = doc.createElement("script");
            script.type = "text/javascript";
            script.src = src;

            if (script.readyState) {
                script.onreadystatechange = function() {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        (typeof callback === "function") && callback();
                    }
                };
            } else {
                script.onload = function() {
                    (typeof callback === "function") && callback();
                };
            }

            doc.getElementsByTagName("head")[0].appendChild(script);

        }

    };

    return __file;

})();
	
/**
 * @package pklib.glass
 * @dependence pklib.utils, pklib.browser
 */
pklib = this.pklib || {};
pklib.glass = (function() {

    var doc = document, 
        id = "pklib-glass-wrapper", 
        settings = {
            contener : doc.getElementsByTagName("body")[0],
            style : {
                position : 'absolute',
                left : 0,
                top : 0,
                background : '#000',
                opacity : 0.5,
                zIndex : 1000
            }
        };

    var _fill = function(obj, contener) {
        if (contener === doc.getElementsByTagName("body")[0]) {
            var width = Math.max(pklib.utils.size.window("width"), pklib.utils.size.document("width"));
            var height = Math.max(pklib.utils.size.window("height"), pklib.utils.size.document("height"));
            if (pklib.browser.getName() === "msie") {
                width -= 20;
            }
        } else {
            var width = pklib.utils.size.object(contener, "width");
            var height = pklib.utils.size.object(contener, "height");
        }
        obj.style.width = width;
        obj.style.height = height;
        return [ width, height ];
    };

    var __glass = {
        objId : id,
        show : function(config, callback) {
            var that = this;
            
            settings = pklib.utils.merge(settings, config);
            settings.style.filter = 'alpha(opacity=' + parseFloat(settings.style.opacity, 10) * 100 + ')';

            var glass = doc.createElement("div");
            var glassStyle = glass.style;

            glass.setAttribute("id", this.objId);
            for ( var style in settings.style) {
                glassStyle[style] = settings.style[style];
            }

            settings.contener.appendChild(glass);

            _fill(glass, settings.contener);

            pklib.utils.event.add(window, "resize", function() {
                that.close();
                that.show(config, callback);
                _fill(glass, settings.contener);
            });

            (typeof callback === "function") && callback();

            return glass;
        },
        close : function(callback) {
            var glass = doc.getElementById(this.objId);
            var result = false;
            if (glass !== null) {
                glass.parentNode.removeChild(glass);
                arguments.callee(callback);
                result = true;
            }
            
            (typeof callback === "function") && callback();

            return result;
        }
    };

    return __glass;

})();
	
/**
 * @package pklib.json
 */
pklib = this.pklib || {};
pklib.json = (function() {

	var __json = {

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
	
	return __json;

})();
	
/**
 * @package pklib.loader
 * @dependence pklib.utils
 */
pklib = this.pklib || {};
pklib.loader = (function() {

    var doc = document, 
        id = "pklib-loader-wrapper", 
        settings = {
            src : 'http://pklib.com/img/icons/loader.gif',
            contener : doc.getElementsByTagName("body")[0],
            style : {
                width : 31,
                height : 31,
                zIndex : 1010
            },
            center : true
        };

    var __loader = {
        objId : id,
        show : function(config, callback) {
            settings = pklib.utils.merge(settings, config);

            var loader = doc.createElement("img");
            var loaderStyle = loader.style;

            loader.setAttribute("id", this.objId);
            loader.setAttribute("src", settings.src);
            for ( var style in settings.style) {
                loaderStyle[style] = settings.style[style];
            }
            if (settings.center) {
                pklib.utils.dom.center(loader, settings.contener);

                pklib.utils.event.add(window, "resize", function() {
                    pklib.utils.dom.center(loader, settings.contener);
                });
            }

            settings.contener.appendChild(loader);

            (typeof callback === "function") && callback();

            delete loader;
        },
        close : function(callback) {
            var loader = doc.getElementById(this.objId);
            var result = false;
            if (loader !== null) {
                loader.parentNode.removeChild(loader);
                this.close(callback);
                result = true;
            }
            
            (typeof callback === "function") && callback();

            return result;
        }
    };

    return __loader;

})();
	
/**
 * @package pklib.message
 * @dependence pklib.utils
 */
pklib = this.pklib || {};
pklib.message = (function() {

    var doc = document, 
        id = "pklib-message-wrapper", 
        contents = null, 
        settings = {
            contener : doc.getElementsByTagName("body")[0],
            style : {
                width : 300,
                height : 300,
                zIndex : 1010
            }
        };

    var __message = {
        objId : id,
        content : contents,
        show : function(config, callback) {
            settings = pklib.utils.merge(settings, config);

            var message = doc.createElement("div");
            var messageStyle = message.style;

            message.setAttribute("id", this.objId);
            for ( var style in settings.style) {
                messageStyle[style] = settings.style[style];
            }

            if (typeof this.content === "string") {
                message.innerHTML = this.content;
            } else if (typeof this.content === "object") {
                message.appendChild(this.content);
            }

            settings.contener.appendChild(message);

            pklib.utils.dom.center(message, settings.contener);

            pklib.utils.event.add(window, "resize", function() {
                pklib.utils.dom.center(message, settings.contener);
            });

            (typeof callback === "function") && callback();

            return message;
        },
        close : function(callback) {
            var message = doc.getElementById(this.objId);
            var result = false;
            
            if (message !== null) {
                message.parentNode.removeChild(message);
                this.close(callback);
                result = true;
            }
            
            (typeof callback === "function") && callback();

            return result;
        }
    };

    return __message;

})();
	
/**
 * @package pklib.node
 */
pklib = this.pklib || {};
pklib.node = (function() {

    var node = [ 
         null, 
         'ELEMENT_NODE', 
         'ATTRIBUTE_NODE', 
         'TEXT_NODE', 
         'CDATA_SECTION_NODE', 
         'ENTITY_REFERENCE_NODE', 
         'ENTITY_NODE', 
         'PROCESSING_INSTRUCTION_NODE', 
         'COMMENT_NODE', 
         'DOCUMENT_NODE', 
         'DOCUMENT_TYPE_NODE', 
         'DOCUMENT_FRAGMENT_NODE', 
         'NOTATION_NODE' 
    ];

    var __node = {
        is : function(element) {
            return node[element.nodeType];
        }
    };

    return __node;

})();
	
/**
 * @package pklib.profiler
 */
pklib = this.pklib || {};
pklib.profiler = (function(){
    
    var data = {};
    
    var __profiler = {
        start: function(name){
            data[name] = new Date();
        },
        stop: function(name){
            data[name] = new Date() - data[name];
        },
        getTime: function(name){
            return data[name];
        }
    };
    
    return __profiler;
    
})();
	
/**
 * @package pklib.validate
 * @dependence pklib.utils
 */
pklib = this.pklib || {};
pklib.validate = (function(){
	
	var __validate = {

        empty: function(obj) {
            switch(typeof obj){
                case "string": return ( obj === '' ); break;
                case "number": return ( obj === 0 ); break;
                case "object": return ( obj.length === 0 ); break;
                default: return false;
            }
        },

        regexp: function(config) {
            var settings = {
                object: null,
                regexp: null,
                error: null,
                success: null
            };

            settings = pklib.utils.merge(settings, config);

            var exp = new RegExp(settings.regexp);

            if (exp.test(settings.object)) {
                return settings.success();
            }
            
            return settings.error();
        }

    };
	
	return __validate;

})();
	
