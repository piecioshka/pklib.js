/**
 * pklib JavaScript library v1.0.0
 * http://pklib.com/
 * 
 * Copyright 2011, Piotr Kowalski
 * Released under the GPL 3.0 Licenses.
 * http://pklib.com/license
 * 
 * Date: Tue Aug 23 2011 21:41:07 GMT+0200 (CEST)
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

    return {

        /**
         * @return {undefined or string}
         */
        getName : function() {
            var userAgent = navigator.userAgent.toLowerCase();

            for ( var i = 0, len = browsers.length; i < len; ++i) {
                var browser = browsers[i];
                if (new RegExp(browser).test(userAgent)) {
                    return browser;
                }
            }
        },

        /**
         * @return {undefined or string}
         */
        getVersion : function() {
            var userAgent = navigator.userAgent.toLowerCase();

            for ( var i = 0, len = browsers.length; i < len; ++i) {
                var browser = browsers[i], len = browser.length, cur = userAgent.indexOf(browser);
                if (cur != -1) {
                    return userAgent.substr(cur + len + 1, 3);
                }
            }
        }
    };

})();
    
/**
 * @package pklib.utils
 * @dependence pklib.browser
 */
pklib = this.pklib || {};
pklib.utils = (function() {

    var doc = document;

    var __utils = {

        css : {

            /**
             * @param {HTMLElement} element
             * @param {string} cssClass
             */
            addClass : function(element, cssClass) {
                if (typeof element === "undefined" || element == null || typeof cssClass === "undefined") {
                    throw new TypeError();
                }
                var classElement = element.className;
                if (!this.hasClass(element, cssClass)) {
                    if (classElement.length) {
                        classElement += " " + cssClass;
                    } else {
                        classElement = cssClass;
                    }
                }
                element.className = classElement;
            },

            /**
             * @param {HTMLElement} element
             * @param {string} cssClass
             */
            removeClass : function(element, cssClass) {
                if (typeof element === "undefined" || element == null || typeof cssClass === "undefined") {
                    throw new TypeError();
                }
                var regexp = new RegExp("(\s" + cssClass + ")|(" + cssClass + "\s)|" + cssClass, "i");
                element.className = element.className.replace(regexp, "");
            },

            /**
             * @param {HTMLElement} element
             * @param {string} cssClass
             * @return {boolean}
             */
            hasClass : function(element, cssClass) {
                if (typeof element === "undefined" || element == null || typeof cssClass === "undefined") {
                    throw new TypeError();
                }
                var regexp = new RegExp("(\s" + cssClass + ")|(" + cssClass + "\s)|" + cssClass, "i");
                return regexp.test(element.className);
            }

        },

        dom : {

            nodeTypes : {
                1 : 'ELEMENT_NODE',
                2 : 'ATTRIBUTE_NODE',
                3 : 'TEXT_NODE',
                4 : 'CDATA_SECTION_NODE',
                5 : 'ENTITY_REFERENCE_NODE',
                6 : 'ENTITY_NODE',
                7 : 'PROCESSING_INSTRUCTION_NODE',
                8 : 'COMMENT_NODE',
                9 : 'DOCUMENT_NODE',
                10 : 'DOCUMENT_TYPE_NODE',
                11 : 'DOCUMENT_FRAGMENT_NODE',
                12 : 'NOTATION_NODE'
            },

            /**
             * @param {HTMLElement} element
             * @return {string}
             */
            isNode : function(element) {
                return this.nodeTypes[element.nodeType];
            },

            /**
             * @param {string} id
             * @param {HTMLElement} area
             * @return {HTMLElement}
             */
            byId : function(id, area) {
                area = area || doc;
                return area.getElementById(id);
            },

            /**
             * @param {string} tag
             * @param {HTMLElement} area
             * @return {HTMLCollection}
             */
            byTag : function(tag, area) {
                area = area || doc;
                return area.getElementsByTagName(tag);
            },

            /**
             * @param {HTMLElement} element
             * @return {null or number}
             */
            index : function(element) {
                var parent = element.parentNode;
                var elements = this.children(parent);
                for ( var i = 0, len = elements.length; i < len; ++i) {
                    var item = elements[i];
                    if (item === element) {
                        return i;
                    }
                }
                return null;
            },

            /**
             * @param {HTMLElement} element
             * @return {array}
             */
            children : function(element) {
                for ( var i = 0, arr = [], childs = element.childNodes, len = childs.length; i < len; ++i) {
                    if (childs[i].nodeType !== doc.TEXT_NODE) {
                        arr.push(childs[i]);
                    }
                }
                return arr;
            },

            /**
             * @param {HTMLElement} element
             * @param {HTMLElement} area
             * @return {array}
             */
            center : function(element, area) {
                var left, top;
                if (area === doc.getElementsByTagName("body")[0]) {
                    left = (Math.max(pklib.utils.size.window("width"), pklib.utils.size.document("width")) - pklib.utils.size.object(element, "width")) / 2;
                    top = (Math.max(pklib.utils.size.window("height"), pklib.utils.size.document("height")) - pklib.utils.size.object(element, "height")) / 2;
                } else {
                    left = (pklib.utils.size.window("width") - pklib.utils.size.object(element, "width")) / 2;
                    top = (pklib.utils.size.window("height") - pklib.utils.size.object(element, "height")) / 2;
                }
                element.style.left = left + "px";
                element.style.top = top + "px";
                element.style.position = "absolute";
                return [ left, top ];
            }

        },

        array : {

            /**
             * @param {HTMLElement} obj
             * @return {boolean}
             */
            isArray : function(obj) {
                return typeof obj === "object" && obj != null && typeof obj.length !== "undefined" && typeof obj.slice !== "undefined";
            },

            /**
             * @param {array} array
             * @param {any Object) param
             * @return {boolean or number}
             */
            inArray : function(array, param) {
                for ( var i = 0, len = array.length; i < len; ++i) {
                    if (array[i] === param) {
                        return i;
                    }
                }
                return false;
            },

            /**
             * @param {array} array
             * @return {array}
             */
            unique : function(array) {
                for ( var i = 0, temp = [], len = array.length; i < len; ++i) {
                    var item = array[i];
                    if (this.inArray.call(null, temp, item) === false) {
                        temp.push(item);
                    }
                }
                return temp;
            },

            /**
             * @param {array} array
             * @param {any Object}...
             * @return {array}
             */
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

            /**
             * @param {HTMLElement} target
             * @param {string} eventType
             * @param {function} callback
             * @param {boolean} bubbles
             * @return {Event}
             */
            add : function(target, eventType, callback, bubbles) {
                if (target.attachEvent) {
                    this.add = function(target, eventType, callback, bubbles) {
                        bubbles = bubbles || false;
                        target.attachEvent("on" + eventType, callback);

                        var evt = doc.createEvent("Event");
                        evt.initEvent(eventType, bubbles, true);
                        return evt;
                    };
                } else if (target.addEventListener) {
                    this.add = function(target, eventType, callback, bubbles) {
                        bubbles = bubbles || false;
                        target.addEventListener(eventType, callback, bubbles);

                        var evt = doc.createEvent("Event");
                        evt.initEvent(eventType, bubbles, true);
                        return evt;
                    };
                }

                this.add(target, eventType, callback, bubbles);
            },

            /**
             * @param {HTMLElement} target
             * @param {string} eventType
             * @param {function} callback
             * @param {boolean} bubbles
             * @return {boolean}
             */
            remove : function(target, eventType, callback, bubbles) {
                if (target.detachEvent) {
                    this.remove = function(target, eventType, callback) {
                        target.detachEvent("on" + eventType, callback);
                        return true;
                    };
                } else if (target.removeEventListener) {
                    this.remove = function(target, eventType, callback, bubbles) {
                        bubbles = bubbles || false;
                        target.removeEventListener(eventType, callback, bubbles);
                        return true;
                    };
                }
                return this.remove(target, eventType, callback, bubbles);
            }

        },

        size : {

            /**
             * @param {string} name
             * @returns {number}
             */
            window : function(name) {
                if (typeof name === "undefined") {
                    throw new TypeError();
                }
                name = pklib.utils.string.capitalize(name);
                var win = window, clientName = win.document.documentElement["client" + name];
                return win.document.compatMode === "CSS1Compat" && clientName || win.document.body["client" + name] || clientName;
            },

            /**
             * @param {string} name
             * @return {number}
             */
            document : function(name) {
                if (typeof name === "undefined") {
                    throw new TypeError();
                }
                name = pklib.utils.string.capitalize(name);
                var clientName = doc.documentElement["client" + name], scrollBodyName = doc.body["scroll" + name], scrollName = doc.documentElement["scroll" + name], offsetBodyName = doc.body["offset" + name], offsetName = doc.documentElement["offset" + name];
                return Math.max(clientName, scrollBodyName, scrollName, offsetBodyName, offsetName);
            },

            /**
             * @param {HTMLElement} obj
             * @param {string} name
             * @return {number}
             */
            object : function(obj, name) {
                if (typeof name === "undefined" || typeof obj === "undefined") {
                    throw new TypeError();
                }
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

        date : {

            /**
             * @return {string}
             */
            getFullMonth : function() {
                var month = (parseInt(new Date().getMonth(), 10) + 1);
                return (month < 10) ? "0" + month : month;
            }

        },

        string : {

            /**
             * @param {any Object} obj
             * @return {boolean}
             */
            isString : function(obj) {
                return typeof obj === "string";
            },

            /**
             * @param source
             * @returns
             */
            isLetter : function(source) {
                return typeof source === "string" && /^[a-zA-Z]$/.test(source);
            },

            chars : [ " ", "-", "_", "\n", "\r", "\t" ],

            /**
             * @param {string} source
             * @return {string}
             */
            ltrim : function(source) {
                return source.replace(new RegExp("^[" + this.chars.join("") + "]+", "g"), "");
            },

            /**
             * @param {string} source
             * @return {string}
             */
            rtrim : function(source) {
                return source.replace(new RegExp("[" + this.chars.join("") + "]+$", "g"), "");
            },

            /**
             * @param {string} source
             * @return {string}
             */
            trim : function(source) {
                return this.ltrim(this.rtrim(source));
            },

            /**
             * @param {string}source
             * @return {string}
             */
            slug : function(source) {
                var result = source.toLowerCase().replace(/\s/mg, "-");
                result = result.replace(/[^a-zA-Z0-9\-]/mg, function(char) {
                    switch (char.charCodeAt()) {
                        case 261:
                            return String.fromCharCode(97);
                        case 281:
                            return String.fromCharCode(101);
                        case 243:
                            return String.fromCharCode(111);
                        case 347:
                            return String.fromCharCode(115);
                        case 322:
                            return String.fromCharCode(108);
                        case 378:
                        case 380:
                            return String.fromCharCode(122);
                        case 263:
                            return String.fromCharCode(99);
                        case 324:
                            return String.fromCharCode(110);

                        default:
                            return "";
                    }
                });
                return result;
            },

            /**
             * @param {string} source
             * @return {string}
             */
            capitalize : function(source) {
                return source.substr(0, 1).toUpperCase() + source.substring(1, source.length).toLowerCase();
            },

            /**
             * @param {string} source
             * @return {string}
             */
            delimiterSeparatedWords : function(source) {
                return source.replace(/[A-ZĘÓĄŚŁŻŹĆŃ]/g, function(match) {
                    return "-" + match.toLowerCase();
                });
            },

            /**
             * @param {string} source
             * @return {string}
             */
            camelCase : function(source) {
                while (source.indexOf("-") != -1) {
                    var pos = source.indexOf("-"), pre = source.substr(0, pos), sub = source.substr(pos + 1, 1).toUpperCase(), post = source.substring(pos + 2, source.length);
                    source = pre + sub + post;
                }
                return source;
            },

            /**
             * @param {string} source
             * @param {number} len
             * @return {string}
             */
            slice : function(source, len) {
                for ( var item = 0, text = "", num = source.length; item < num; ++item) {
                    text += source[item];
                    if (item == len - 1) {
                        if (num - len > 3) {
                            text += "...";
                        }
                        break;
                    }
                }

                return text;
            }

        },

        action : {

            /**
             * @param {HTMLElement} obj
             */
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

            /**
             * @param {HTMLElement} area
             */
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

            /**
             * @param {HTMLElement} element
             * @param {string} text
             */
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
            }

        },

        animate : {

            /**
             * @param param
             * @param {boolean} animate
             */
            scrollTo : function(param, animate) {
                if (true === animate) {
                    var interval = null;
                    interval = setInterval(function() {
                        doc.body.scrollTop -= 5;
                        if (doc.body.scrollTop <= 0) {
                            clearInterval(interval);
                        }
                    }, 1);
                } else {
                    doc.body.scrollTop = param;
                }
            }

        },

        /**
         * @param {array or object} target
         * @param {array or object} source
         * @return {array}
         */
        merge : function(target, source) {
            if (this.array.isArray(target) && this.array.isArray(source)) {
                for ( var i = 0, len = source.length; i < len; ++i) {
                    var element = source[i];
                    if (!this.array.inArray(target, element)) {
                        target.push(element);
                    }
                }
                return target.sort();
            } else {
                for ( var element in source) {
                    if (source.hasOwnProperty(element)) {
                        target[element] = source[element];
                    }
                }
                return target;
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

    var client = null, settings = {}, states = [];

    function __init() {
        client = null, settings = {
            type : "get",
            async : true,
            cache : false,
            url : null,
            params : null,
            headers : {},

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
        }, states = [];
    }

    function handler() {
        var method = "responseText";

        if (this.readyState === 4) {
            pklib.cache[settings.url] = this;

            var ct = this.getResponseHeader("Content-Type"), xmlct = [ "application/xml", "text/xml" ];

            if (pklib.utils.array.inArray(xmlct, ct) !== false) {
                method = "responseXML";
            }

        }
        states[this.readyState].call(null, this[method]);
    }

    /**
     * @param {object} config
     * <pre>
     * { 
     *      type {string|default /get/}, 
     *      async {boolean|default true},
     *      cache {boolean|default false}, 
     *      url {string}, 
     *      params {array or object},
     *      headers {object}
     * 
     *      unset {function},
     *      opened {function},
     *      headersReceived {function},
     *      loading {function},
     *      done {function}
     * }
     * </pre>
     */
    return function(config) {

        __init();

        settings = pklib.utils.merge(settings, config);
        settings.type = settings.type.toUpperCase();
        states = [ settings.unset, settings.opened, settings.headersReceived, settings.loading, settings.done ];

        if (settings.cache && pklib.cache[settings.url]) {
            handler.call(pklib.cache[settings.url]);
        } else {
            client = new XMLHttpRequest();
            client.onreadystatechange = function() {
                handler.call(client);
            };
            client.open(settings.type, settings.url, settings.async);
            if (settings.headers != null) {
                for ( var item in settings.headers) {
                    client.setRequestHeader(item, settings.headers[item]);
                }
            }
            client.send(settings.params);
        }

    };

})();
    
/**
 * @package pklib.cookie
 */
pklib = this.pklib || {};
pklib.cookie = (function() {

    var doc = document;

    return {

        /**
         * @param {string} name
         * @param {string} value
         * @param {number} days
         * @return {string}
         */
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

        /**
         * @param {string} name
         * @return {null or string}
         */
        read : function(name) {
            if (typeof name === "undefined") {
                return null;
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
        },

        /**
         * @param {string} name
         * @return {string}
         */
        erase : function(name) {
            return this.create(name, undefined, -1);
        }

    };

})();
    
/**
 * @package pklib.file
 */
pklib = this.pklib || {};
pklib.file = (function() {

    var doc = document;

    return {

        /**
         * @param {string} src
         * @param {function} callback
         */
        load : function(src, callback) {
            var script = doc.createElement("script");
            script.type = "text/javascript";
            script.src = src;

            if (script.readyState) {
                script.onreadystatechange = function() {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        (typeof callback === "function") && callback(script);
                    }
                };
            } else {
                script.onload = function() {
                    (typeof callback === "function") && callback(script);
                };
            }

            doc.getElementsByTagName("head")[0].appendChild(script);

        }

    };

})();
    
/**
 * @package pklib.json
 */
pklib = this.pklib || {};
pklib.json = (function() {

    var __json = {

        /**
         * @param {array} object
         * @param {number} ind
         * @return {string}
         */
        stringify : function(object, ind) {
            var source = "", type = "", index = ind || 0;

            function indent(len) {
                for ( var i = 0, preffix = "\t", source = ""; i < len; ++i) {
                    source += preffix;
                }
                return source;
            }

            // Undefined
            if (typeof object === "undefined") {
                type = undefined;
                return type;
            } else

            // Null
            if (object == null) {
                type = null;
                return type;
            } else

            // Boolean
            if (typeof object === "boolean") {
                type = "boolean";
                return object;
            } else

            // Number
            if (typeof object === "number") {
                type = "number";
                return object;
            } else

            // String
            if (typeof object === "string") {
                type = "string";
                return '"' + object + '"';
            } else

            // Function
            if (typeof object === "function") {
                type = "function";

                function __getName(fun) {
                    var text = fun.toString();
                    text = text.split("\n")[0].replace("function ", "");
                    return text.substr(0, text.indexOf("(")) + "()";
                }

                return __getName(object);
            } else

            // Array
            if (typeof object === "object" && typeof object.slice === "function") {
                type = "array";
                if (object.length === 0) {
                    return "[]";
                }
                source = "[\n" + indent(index);
                index++;
                for ( var i = 0, len = object.length; i < len; ++i) {
                    source += indent(index) + arguments.callee(object[i], index);
                    if (i !== len - 1) {
                        source += ",\n";
                    }
                }
                index--;
                source += "\n" + indent(index) + "]";
            } else

            // Object
            if (typeof object === "object") {
                type = "object";

                function __getLast(object) {
                    for ( var i in object) {
                    }
                    return i;
                }

                source = "{\n";
                index++;
                for ( var item in object) {
                    source += indent(index) + item + ": " + arguments.callee(object[item], index);
                    if (item !== __getLast(object)) {
                        source += ",\n";
                    }
                }
                index--;
                source += "\n" + indent(index) + "}";
            }

            return source;
        },

        /**
         * @param {object} object
         * @param {boolean} toJson
         * @returns {string}
         */
        serialize : function(object, toJson) {
            if (typeof object !== "object" || object == null) {
                throw new TypeError();
            }

            var addAmp = false, response = '';

            response += (toJson) ? '{' : '';

            for ( var i in object) {
                if (typeof object[i] !== "function") {
                    if (addAmp) {
                        var lst = toJson ? ',' : '&';
                        response += lst;
                    } else {
                        addAmp = true;
                    }

                    var value = '';
                    if (typeof object[i] !== "undefined" && object[i] !== null) {
                        value = object[i];
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
 * @package pklib.profiler
 */
pklib = this.pklib || {};
pklib.profiler = (function() {

    var data = {};

    return {

        /**
         * @param {string} name
         * @return {number}
         */
        start : function(name) {
            data[name] = new Date();
            return data[name];
        },

        /**
         * @param {string} name
         * @return {number}
         */
        stop : function(name) {
            data[name] = new Date() - data[name];
            return new Date((new Date()).getTime() + data[name]);
        },

        /**
         * @param {string} name
         * @return {number}
         */
        getTime : function(name) {
            return data[name];
        }

    };

})();
    
/**
 * @package pklib.validate
 * @dependence pklib.utils
 */
pklib = this.pklib || {};
pklib.validate = (function() {

    return {

        /**
         * @param {object} object
         * @return {boolean}
         */
        empty : function(object) {
            if (object == null) {
                return true;
            } else if (pklib.utils.array.isArray(object)) {
                return (object.length === 0);
            } else {
                switch (typeof object) {
                    case "string":
                        return (object === '');
                        break;
                    case "number":
                        return (object === 0);
                        break;
                    case "object":
                        var iterator = 0;
                        for ( var item in object) {
                            if (object.hasOwnProperty(item)) {
                                iterator++;
                            }
                        }
                        return (iterator === 0);
                        break;

                    case "undefined":
                }
                return false;
            }
        },

        /**
         * @param {object} config
         * <pre>
         * { 
         *      object {string}
         *      regexp {object}
         * 
         *      error {function},
         *      success {function}
         * }
         * </pre>
         * 
         * @return {function}
         */
        regexp : function(config) {
            var settings = {
                object : null,
                regexp : null,
                error : function() {
                },
                success : function() {
                }
            };

            settings = pklib.utils.merge(settings, config);

            if(settings.regexp == null){
                throw new TypeError();
            }
            var exp = new RegExp(settings.regexp);

            if(settings.object == null){
                throw new TypeError();
            }
            if (exp.test(settings.object)) {
                return (typeof settings.success === "function") && settings.success();
            }

            return (typeof settings.error === "function") && settings.error();
        }

    };

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
        var width, height;
        if (contener === doc.getElementsByTagName("body")[0]) {
            width = Math.max(pklib.utils.size.window("width"), pklib.utils.size.document("width"));
            height = Math.max(pklib.utils.size.window("height"), pklib.utils.size.document("height"));
            if (pklib.browser.getName() === "msie") {
                width -= 20;
            }
        } else {
            width = pklib.utils.size.object(contener, "width");
            height = pklib.utils.size.object(contener, "height");
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
    
