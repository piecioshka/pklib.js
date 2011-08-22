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
