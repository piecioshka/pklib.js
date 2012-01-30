/**
 * pklib JavaScript library v1.0.5pre
 * 
 * Copyright (c) 2012 Piotr Kowalski, http://pklib.com/
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *  
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Date: Mon Jan 30 10:55:11 GMT 2012
 */

(function (global) {
    "use strict";

    global.pklib = {
        author: "Piotr Kowalski",
        www: "http://pklib.com/",
        version: "1.0.4"
    };
}(this));

if (typeof Function.prototype.bind !== "function") {
	Function.prototype.bind = function (that) {
	    "use strict";
	    var method = this,
	        slice = Array.prototype.slice,
	        args = slice.apply(arguments, [1]);
	    return function () {
	        return method.apply(that, args.concat(slice.apply(arguments, [0])));
	    };
	};
}

/**
 * Module to service asynchronous request.
 * @package pklib.ajax
 * @dependence pklib.array
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {},
        setTimeout = global.setTimeout,
        cache = [];

    /**
     * @constructor
     * @this {XHRError}
     * @param message {String}
     */
    function XHRError(message) {
        this.name = "XHRError";
        this.message = message || "";
    }

    XHRError.prototype = new Error();
    XHRError.prototype.constructor = XHRError;

    /**
     * @param settings {Object}
     * @param xhr {XMLHttpRequest}
     */
    function handler(settings, xhr) {
        var contentType,
            xmlContentType = ["application/xml", "text/xml"],
            property = "responseText";

        if (xhr.readyState === 4) {
            cache[settings.url] = xhr;

            contentType = xhr.getResponseHeader("Content-Type");

            if (pklib.array.inArray(contentType, xmlContentType)) {
                property = "responseXML";
            }

            settings.done.call(null, xhr[property]);
        }
    }
    /**
     * @param settings {Object}
     * @param xhr {XMLHttpRequest}
     */
    function timeoutHandler(settings, xhr) {
        // pass
    }
    /**
     * @param settings {Object}
     * @param xhr {XMLHttpRequest}
     */
    function requestTimeout(settings, xhr) {
        if (xhr.readyState !== 4) {
            xhr.abort();
            timeoutHandler.call(null, settings, xhr);
        }
    }
    /**
     * @throws XHRError
     * @return {Object}
     */
    function getXhr() {
        var xhr;
        try {
            xhr = new XMLHttpRequest();
        } catch (a) {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (b) {
                try {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (c) {
                    throw new XHRError("pklib.ajax: XHRError: Cannot create XHR object");
                }
            }
        }
        return xhr;
    }

    pklib.ajax = {
        /**
         * Lazy load file.
         * @param config {Object}
         * <pre>
         * {
         *      type {String|default: "get"}
         *      async {Boolean|default: true}
         *      cache {Boolean|default: false}
         *      url {String}
         *      params {Object}
         *      headers {Object}
         *      done {Function}
         * }
         * </pre>
         * @return {XMLHttpRequest}
         */
        load: function (config) {
            var header,
                xhr = null,
                settings = {
                    type: "get",
                    async: true,
                    cache: false,
                    url: null,
                    params: null,
                    timeout: 30000,
                    headers: {},
                    done: function () {
                        // pass
                    }
                };
            settings = pklib.array.mixin(settings, config);
            settings.type = settings.type.toUpperCase();

            if (settings.cache && cache[settings.url]) {
                handler.call(null, settings, cache[settings.url]);
            } else {
                xhr = getXhr();
                xhr.onreadystatechange = handler.bind(null, settings, xhr);
                xhr.open(settings.type, settings.url, settings.async);

                if (settings.headers !== null) {
                    for (header in settings.headers) {
                        if (settings.headers.hasOwnProperty(header)) {
                            xhr.setRequestHeader(header, settings.headers[header]);
                        }
                    }
                }
                xhr.send(settings.params);

                if (typeof xhr.ontimeout === "function") {
                    xhr.ontimeout = timeoutHandler.bind(null, settings, xhr);
                } else {
                    setTimeout(requestTimeout.bind(null, settings, xhr), settings.timeout);
                }

                return xhr;
            }
        }
    };
}(this));

/**
 * Module to service array object.
 * @package pklib.array
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {};

    pklib.array =  {
        /**
         * Check if param is array,
         * @param array {Object}
         * @return {Boolean}
         */
        isArray: function (array) {
            return typeof array === "object" &&
            	array !== null &&
                typeof array.length !== "undefined" &&
                typeof array.slice !== "undefined";
        },
        /**
         * Check if element is in array by loop.
         * @param param
         * @param array {Array}
         * @return {Boolean}
         */
        inArray: function (param, array) {
            var i, len = array.length;
            for (i = 0; i < len; ++i) {
                if (array[i] === param) {
                    return true;
                }
            }
            return false;
        },
        /**
         * Get index of element
         * @param item
         * @param array {Array}
         * @throws {ReferenceError}
         * @return {Boolean}
         */
        index: function (item, array) {
            var i, len = array.length;
            for (i = 0; i < len; ++i) {
                if (array[i] === item) {
                    return i;
                }
            }
            throw new ReferenceError("pklib.array.index: @item not exists");
        },
        /**
         * Unique array. Delete element what was duplicated.
         * @param array {Array}
         * @return {Array}
         */
        unique: function (array) {
            var i, item, temp = [], len = array.length;
            for (i = 0; i < len; ++i) {
                item = array[i];
                if (!this.inArray.call(null, item, temp)) {
                    temp.push(item);
                }
            }
            return temp;
        },
        /**
         * Remove element declarated in infinity params without first.
         * First parameter is array object.
         * @param array {Array}
         * @param {var}
         * @return {Array}
         */
        remove: function (array) {
            var i, param,
                params = Array.prototype.slice.call(arguments, 1),
                len = params.length;

            for (i = 0; i < len; ++i) {
                param = params[i];
                if (this.inArray(param, array)) {
                    array.splice(this.index(param, array), 1);
                }
            }
            return array;
        },
        /**
         * @param target {Array or Object}
         * @param source {Array or Object}
         * @return {Array}
         */
        mixin: function (target, source) {
            var i, len = 0, element, item;

            if (this.isArray(target) && this.isArray(source)) {
                len = source.length;
                for (i = 0; i < len; ++i) {
                    element = source[i];
                    if (!this.inArray(element, target)) {
                        target.push(element);
                    }
                }
                target.sort();
                return target;
            } else {
                for (item in source) {
                    if (source.hasOwnProperty(item)) {
                        target[item] = source[item];
                    }
                }
                return target;
            }
        }
    };
}(this));

/**
 * @package pklib.aspect
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {};

    /**
     * Create method with merge first and second.
     * Second method is run after first.
     * @param fun {Function} The function to bind aspect function
     * @param asp {Function} The aspect function
     * @throws {TypeError}
     * @return {Function}
     */
    pklib.aspect = function (fun, asp) {
        var that = this;
        if (typeof fun !== "function") {
            throw new TypeError("pklib.aspect: @func: not function");
        }
        if (typeof asp !== "function") {
            throw new TypeError("pklib.aspect: @asp: not function");
        }
        return function () {
            asp.call(that);
            return fun.apply(that, arguments);
        };
    };
}(this));

/**
 * Get best information about browser.
 * @package pklib.browser
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {},
        navigator = global.navigator || {},
        browsers = ["msie", "chrome", "safari", "opera", "mozilla", "konqueror"];

    pklib.browser = {
        /**
         * Get browser name by checking userAgent in global object navigator.
         * @return {String}
         */
        getName: function () {
            var i,
                len = browsers.length,
                userAgent = navigator.userAgent.toLowerCase(),
                browser;

            for (i = 0; i < len; ++i) {
                browser = browsers[i];
                if (new RegExp(browser).test(userAgent)) {
                    return browser;
                }
            }
        },
        /**
         * Get browser version by checking userAgent.
         * Parse userAgent to find next 3 characters.
         * @return {String}
         */
        getVersion: function () {
            var i, len = browsers.length, browser, cur,
                userAgent = navigator.userAgent.toLowerCase();

            for (i = 0; i < len; ++i) {
                browser = browsers[i];
                cur = userAgent.indexOf(browser);
                if (cur !== -1) {
                    return userAgent.substr(cur + len + 1, 3);
                }
            }
        }
    };
}(this));

/**
 * Cookie service manager.
 * @package pklib.cookie
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {},
        document = global.document || {};

    pklib.cookie = {
        /**
         * Create cookie file with name, value and day expired.
         * @param name {String}
         * @param value {String}
         * @param days {Number}
         * @return {string}
         */
        create: function (name, value, days) {
            value = value || null;
            var expires = "",
                date = new Date();

            if (typeof days !== "undefined") {
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toGMTString();
            }

            document.cookie = name + "=" + value + expires + "; path=/";

            return this.get(name);
        },
        /**
         * Read cookie by it name.
         * @param name {String}
         * @return {String | null}
         */
        get: function (name) {
            if (typeof name === "undefined") {
                return null;
            }
            name = name + "=";
            var i,
                c,
                ca = document.cookie.split(";"),
                len = ca.length;

            for (i = 0; i < len; ++i) {
                c = ca[i];
                while (c.charAt(0) === " ") {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
        },
        /**
         * Delete cookie by it name.
         * @param name {String}
         * @return {String}
         */
        remove: function (name) {
            return this.create(name, undefined, -1);
        }
    };
}(this));

/**
 * Utils method related css on tags in DOM tree.
 * @package pklib.css
 * @dependence pklib.string. pklib.dom
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {},
        rspace = /\s+/,
        rclass = /[\n\t\r]/g;

    /**
     * @param cssClass {String}
     * @param element {HTMLElement}
     * @throws {TypeError}
     */
    function checkParams(cssClass, element) {
        if (typeof cssClass !== "string") {
            throw new TypeError("pklib.css.addClass: @cssClass: not String");
        }
        if (!pklib.dom.isNode(element)) {
            throw new TypeError("pklib.css.addClass: @element: not HTMLElement");
        }
    }

    pklib.css = {
        /**
         * Add CSS class to element define in second parameter.
         * @param cssClass {String}
         * @param element {HTMLElement}
         * @throws {TypeError}
         */
        addClass: function (cssClass, element) {
            checkParams(cssClass, element);
            var classElement = element.className;
            if (!this.hasClass(cssClass, element)) {
                if (classElement.length) {
                    classElement += " " + cssClass;
                } else {
                    classElement = cssClass;
                }
            }
            element.className = classElement;
        },
        /**
         * Remove CSS class from element define in second parameter.
         * @param cssClass {String}
         * @param element {HTMLElement}
         * @throws {TypeError}
         */
        removeClass: function (cssClass, element) {
            checkParams(cssClass, element);
            var trim = pklib.string.trim,
                c = 0,
                className = "",
                classNames = (element.className || "").split(rspace),
                cl = classNames.length;

            if (classNames) {
                className = (" " + element.className + " ").replace(rclass, " ");
                for (c = 0; c < cl; c++) {
                    className = className.replace(" " + classNames[c] + " ", " ");
                }
                element.className = trim(className);
            } else {
                element.className = "";
            }
        },
        /**
         * Check if element has CSS class
         * @param cssClass {String}
         * @param element {HTMLElement}
         * @throws {TypeError}
         * @return {Boolean}
         */
        hasClass: function (cssClass, element) {
            checkParams(cssClass, element);
            var className = " " + cssClass + " ";
            return ((" " + element.className + " ").replace(rclass, " ").indexOf(className) > -1);
        }
    };
}(this));

/**
 * Helper related with DOM service.
 * @package pklib.dom
 * @dependence pklib.browser, pklib.css, pklib.utils
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {},
        document = global.document || {};

    /**
     * Walking on every element in node
     * @param node {Node}
     * @param func {Function}
     * @returns
     */
    function walk_the_dom(node, func) {
        func(node);
        node = node.firstChild;
        while (node) {
            walk_the_dom(node, func);
            node = node.nextSibling;
        }
    }

    pklib.dom = {
        /**
         * Types of all available node
         */
        nodeTypes: {
            "ELEMENT_NODE": 1,
            "ATTRIBUTE_NODE": 2,
            "TEXT_NODE": 3,
            "CDATA_SECTION_NODE": 4,
            "ENTITY_REFERENCE_NODE": 5,
            "ENTITY_NODE": 6,
            "PROCESSING_INSTRUCTION_NODE": 7,
            "COMMENT_NODE": 8,
            "DOCUMENT_NODE": 9,
            "DOCUMENT_TYPE_NODE": 10,
            "DOCUMENT_FRAGMENT_NODE": 11,
            "NOTATION_NODE": 12
        },
        /**
         * @param node {Node}
         * @return {String}
         */
        isNode: function (node) {
            return ((node && node.nodeType) && node.nodeName) || false;
        },
        /**
         * @param node {Node}
         * @return {String}
         */
        isElement: function (node) {
            return (node && node.nodeType === this.nodeTypes.ELEMENT_NODE) || false;
        },
        /**
         * @param id {String}
         * @param wrapper {HTMLElement}
         * @return {HTMLElement | null}
         */
        byId: function (id) {
            return document.getElementById(id);
        },
        /**
         * @param tag {String}
         * @param element {Element}
         * @return {NodeList}
         */
        byTag: function (tag, element) {
            element = element || document;
            return element.getElementsByTagName(tag);
        },
        /**
         * @param cssClass {String}
         * @param wrapper {HTMLElement}
         * @return {NodeList | Array}
         */
        byClass: function (cssClass, wrapper) {
            wrapper = wrapper || document;
            var results = [];
            if (wrapper.getElementsByClassName) {
                return wrapper.getElementsByClassName(cssClass);
            } else {
                walk_the_dom(wrapper, function (node) {
                    if (pklib.css.hasClass(cssClass, node)) {
                        results.push(node);
                    }
                });
                return results;
            }
        },
        /**
         * Get element from  selector
         * @param {String} selector
         * 
         * TODO: Feature
         */
        /*
        get: function (selector) {
		    function getType(selector) {
		        if (/^\.(\w*)$/.test(selector)) {
		            return "class";
		        } else if (/^\#(\w*)$/.test(selector)) {
		            return "id";
		        } else {
		            return "tag";
		        }
		    }
            try {
                var i,
                    elements = selector.match(/[\.\#\w]+/g),
                    len = elements.length,
                    scope = global,
                    item,
                    type;
                for (i = 0; i < len; ++i) {
                    item = elements[i];
                    type = getType(item);
                    if (type === "class") {
                        scope = this.byClass(item.substr(1), scope);
                    } else if (type === "id") {
                        scope = this.byId(item.substr(1), scope);
                    } else {
                        scope = this.byTag(item, scope);
                    }
                }
            } catch (ignore) {}
        },
        */
        /**
         * @param node {Node}
         * @return {Number | null}
         */
        index: function (node) {
            var i,
                parent = this.parent(node),
                childs = this.children(parent),
                len = childs.length;

            for (i = 0; i < len; ++i) {
                if (childs[i] === node) {
                    return i;
                }
            }
            return null;
        },
        /**
         * @param node {Node}
         * @return {Array}
         */
        children: function (node) {
            var i,
                array = [],
                childs = node.childNodes,
                len = childs.length;

            for (i = 0; i < len; ++i) {
                if (this.isElement(childs[i])) {
                    array.push(childs[i]);
                }
            }
            return array;
        },
        /**
         * @param element {HTMLElement}
         * @param node {Node}
         * @return {HTMLElement}
         */
        insert: function (element, node) {
            if (this.isNode(element)) {
                node.appendChild(element);
            } else if (typeof element === "string") {
                node.innerHTML += element;
            }
            return element;
        },
        /**
         * @param node {Node}
         */
        remove: function () {
            var i, node = null, parent = null,
                args = Array.prototype.slice.call(arguments),
                len = args.length;

            for (i = 0; i < len; ++i) {
                node = args[i];
                if (this.isNode(node)) {
                    parent = node.parentNode;
                    parent.removeChild(node);
                }
            }
        },
        /**
         * @param node {HTMLElement}
         * @return {HTMLElement | null}
         */
        prev: function (node) {
            var pNode = null;
            while (true) {
                pNode = node.previousSibling;
                if (pNode != null && pNode.nodeType !== this.nodeTypes.ELEMENT_NODE) {
                    node = pNode;
                } else {
                    break;
                }
            }
            return pNode;
        },
        /**
         * @param node {HTMLElement}
         * @return {HTMLElement | null}
         */
        next: function (node) {
            var nNode = null;
            while (true) {
                nNode = node.nextSibling;
                if (nNode != null && nNode.nodeType !== this.nodeTypes.ELEMENT_NODE) {
                    node = nNode;
                } else {
                    break;
                }
            }
            return nNode;
        },
        /**
         * @param node {HTMLElement}
         * @return {HTMLElement | null}
         */
        parent: function (node) {
            var parent = null;
            while (true) {
                parent = node.parentNode;
                if (parent != null && parent.nodeType !== this.nodeTypes.ELEMENT_NODE) {
                    node = parent;
                } else {
                    break;
                }
            }
            return parent;
        }
    };
}(this));

/**
 * Helper about manage event on HTMLElement.
 * @package pklib.event
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {};

    pklib.event = {
        /**
         * @param target {HTMLElement}
         * @param eventName {String}
         * @param handler {Function}
         */
        add: function (target, eventName, handler) {
            if (typeof target.events === "undefined") {
                target.events = {};
            }

            var event = target.events[eventName];

            if (typeof event === "undefined") {
                target.events[eventName] = [];
            }
            target.events[eventName].push(handler);

            if (target.attachEvent) {
                target.attachEvent("on" + eventName, handler);
            } else if (target.addEventListener) {
                target.addEventListener(eventName, handler, false);
            }
        },
        /**
         * @param target {HTMLElement}
         * @param eventName {String}
         * @param handler {Function}
         */
        remove: function (target, eventName) {
            if (typeof target.events === "undefined") {
                target.events = {};
            }

            var removeEvent, events, len = 0, i, handler;
            if (target.detachEvent) {
                removeEvent = "detachEvent";
            } else if (target.removeEventListener) {
                removeEvent = "removeEventListener";
            }

            events = target.events[eventName];
            if (typeof events !== "undefined") {
                len = events.length;

                for (i = 0; i < len; ++i) {
                    handler = events[i];
                    target[removeEvent](eventName, handler);
                    delete target.events[eventName];
                }
            }
        },
        /**
         * @param target {HTMLElement}
         * @param eventName {String}
         * @return {Array | undefined}
         */
        get: function (target, eventName) {
            if (typeof target.events === "undefined") {
                target.events = {};
            }
            return target.events[eventName];
        },
        /**
         * @param target {HTMLElement}
         * @param eventName {String}
         * @throws {ReferenceError}
         */
        trigger: function (target, eventName) {
            if (typeof target.events === "undefined") {
                target.events = {};
            }

            var events = target.events[eventName], len, i;
            if (typeof events !== "undefined") {
                len = events.length;

                for (i = 0; i < len; ++i) {
                    events[i].call(target, events[i]);
                }
            } else {
                throw new ReferenceError("pklib.event.trigger: @event " + eventName + ": undefined");
            }
        }
    };
}(this));

/**
 * JS file laoder
 * @package pklib.file
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {},
        document = global.document || {},
        lazy_file = 0;

    function loadjs(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState === "loaded" || script.readyState === "complete") {
                    script.onreadystatechange = null;
                    if (typeof callback === "function") {
                        callback(script);
                    }
                }
            };
        } else {
            script.onload = function () {
                if (typeof callback === "function") {
                    callback(script);
                }
            };
        }
        if (typeof document.head === "undefined") {
            document.head = document.getElementsByTagName("head")[0];
        }
        document.head.appendChild(script);
    }

    pklib.file = {
        /**
         * Lazy load JS files
         * @param files {String | Array}
         * @param callback {Function}
         */
        loadjs: function (files, callback, is_continue) {
            if (typeof files === "string") {
                var src = files;
                loadjs(src, function (script) {
                    if (typeof callback === "function") {
                        callback(script);
                    }
                });
            } else {
                var that = this,
                len = files.length,
                file = files[lazy_file];
        
                if (!is_continue) {
                    lazy_file = 0;
                }
                loadjs(file, function () {
                    if (lazy_file < len - 1) {
                        lazy_file += 1;
                        that.loadjs(files, callback, true);
                    } else {
                        if (typeof callback === "function") {
                            callback();
                        }
                    }
                });
            }
        }
    };
}(this));

/**
 * JSON manager
 * @package pklib.json
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {};

    function getFunctionName(fun) {
        var text = fun.toString().split("\n")[0].replace("function ", "");
        return text.substr(0, text.indexOf("(")) + "()";
    }
    function getLastElement(object) {
        var i,
            len = 0;
        for (i in object) {
            if (object.hasOwnProperty(i)) {
                len += 1;
            }
        }
        return len;
    }
    function getIndent(len) {
        var i,
            fix = "\t",
            source = "";
        for (i = 0; i < len; ++i) {
            source += fix;
        }
        return source;
    }

    pklib.json = {
        /**
         * @param object {Array}
         * @return {String}
         */
        stringify: function (object) {
            var source = "",
                args = Array.prototype.slice.call(arguments),
                index = args[1] || 0,
                i,
                item,
                len = 0;

            // Undefined
            if (typeof object === "undefined") {
                return undefined;
            } else if (object === null) {
                // Null
                return null;
            } else if (typeof object === "boolean") {
                // Boolean
                return object;
            } else if (typeof object === "number") {
                // Number
                return object;
            } else if (typeof object === "string") {
                // String
                return '"' + object + '"';
            } else if (typeof object === "function") {
                // Function
                return getFunctionName(object);
            } else if (typeof object === "object" && typeof object.slice === "function") {
                // Array
                if (object.length === 0) {
                    return "[]";
                }
                source = "[\n" + getIndent(index);
                index += 1;
                len = object.length;
                for (i = 0; i < len; ++i) {
                    source += getIndent(index) + this.stringify(object[i], index);
                    if (i !== len - 1) {
                        source += ",\n";
                    }
                }
                index -= 1;
                source += "\n" + getIndent(index) + "]";
            } else if (typeof object === "object") {
                // Object
                source = "{\n";
                index += 1;
                for (item in object) {
                    if (object.hasOwnProperty(item)) {
                        source += getIndent(index) + '"' + item + '": ' + this.stringify(object[item], index);
                        if (item !== getLastElement(object)) {
                            source += ",\n";
                        }
                    }
                }
                index -= 1;
                source += "\n" + getIndent(index) + "}";
            }

            return source;
        },
        /**
         * @param object {Object}
         * @param toJson {Boolean}
         * @throws {TypeError}
         * @return {String}
         */
        serialize: function (source, toJson) {
            if (typeof source !== "object" || source === null) {
                throw new TypeError("pklib.json.serialize: @source: not object");
            }

            var amp = false,
                item,
                value,
                mtz,
                response = '';

            if (toJson) {
                response += "{";
            }
            for (item in source) {
                if (source.hasOwnProperty(item)) {
                    if (amp) {
                        if (toJson) {
                            response += ',';
                        } else {
                            response += '&';
                        }
                    } else {
                        amp = true;
                    }

                    value = '';
                    if (typeof source[item] !== "undefined" && source[item] !== null) {
                        value = source[item];
                    }

                    mtz = toJson ? '"' : '';
                    response += item;
                    response += toJson ? ':' : '=';
                    response += mtz;
                    response += value + mtz;
                }
            }
            if (toJson) {
                response += "}";
            }

            return response;
        }
    };
}(this));

/**
 * Time analyzer
 * @package pklib.profiler
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {},
        data = {};

    pklib.profiler = {
        /**
         * @param name {String}
         * @return {Number}
         */
        start: function (name) {
            data[name] = new Date();
            return data[name];
        },
        /**
         * @param name {String}
         * @return {Number}
         */
        stop: function (name) {
            data[name] = new Date() - data[name];
            return new Date((new Date()).getTime() + data[name]);
        },
        /**
         * @param name {String}
         * @return {Number}
         */
        getTime: function (name) {
            return data[name];
        }
    };
}(this));

/**
 * String service manager
 * @package pklib.string
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {};

    pklib.string = {
        /**
         * @param source {String}
         * @return {Boolean}
         */
        isString: function (source) {
            return typeof source === "string";
        },
        /**
         * @param source {String}
         * @return {Boolean}
         */
        isLetter: function (source) {
            return typeof source === "string" && /^[a-zA-Z]$/.test(source);
        },
        /**
         * @param source {String}
         * @return {String}
         */
        trim: function (source) {
            return source.replace(/^\s+|\s+$/g, "");
        },
        /**
         * @param source {String}
         * @return {String}
         */
        slug: function (source) {
            var result = source.toLowerCase().replace(/\s/mg, "-");
            result = result.replace(/[^a-zA-Z0-9\-]/mg, function (ch) {
                switch (ch.charCodeAt()) {
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
         * @param source {String}
         * @return {String}
         */
        capitalize: function (source) {
            return source.substr(0, 1).toUpperCase() + source.substring(1, source.length).toLowerCase();
        },
        /**
         * @param source {String}
         * @return {String}
         */
        delimiterSeparatedWords: function (source) {
            return source.replace(/[A-ZĘÓĄŚŁŻŹĆŃ]/g, function (match) {
                return "-" + match.toLowerCase();
            });
        },
        /**
         * @param source {String}
         * @return {String}
         */
        stripTags: function (source) {
            return source.replace(/\\<\\S\\>/g, "");
        },
        /**
         * @param source {String}
         * @return {String}
         */
        camelCase: function (source) {
            while (source.indexOf("-") !== -1) {
                var pos = source.indexOf("-"),
                    pre = source.substr(0, pos),
                    sub = source.substr(pos + 1, 1).toUpperCase(),
                    post = source.substring(pos + 2, source.length);
                source = pre + sub + post;
            }
            return source;
        },
        /**
         * @param source {String}
         * @param length {Number}
         * @return {String}
         */
        slice: function (source, length) {
            var item,
                text = "",
                num = source.length;

            for (item = 0; item < num; item += 1) {
                text += source.substr(item, 1);
                if (item === length - 1) {
                    if (num - length >= 1) {
                        text += "...";
                    }
                    break;
                }
            }
            return text;
        }
    };
}(this));

/**
 * Url helper manager
 * @package pklib.url
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {},
        loc = global.location;

    pklib.url = {
        /**
         * @return {String}
         */
        getProtocol: function () {
            return loc.protocol;
        },
        /**
         * @return {String}
         */
        getHost: function () {
            return loc.host;
        },
        /**
         * @return {String}
         */
        getPort: function () {
            return loc.port || 80;
        },
        /**
         * @return {String}
         */
        getUri: function () {
            return loc.pathname;
        },
        /**
         * @return {Array}
         */
        getParams: function () {
            var i, item, len = 0,
                params = loc.search,
                params_obj = {};
            if (params.substr(0, 1) === "?") {
                params = params.substr(1);
            }
            params = params.split("&");
            len = params.length;
            for (i = 0; i < len; ++i) {
                item = params[i].split("=");
                params_obj[item[0]] = item[1];
            }
            return params_obj;
        },
        /**
         * @param key {String}
         * @return {String}
         */
        getParam: function (key) {
            var params = loc.search,
                i,
                item,
                len = params.length;
            if (params.substr(0, 1) === "?") {
                params = params.substr(1);
            }
            params = params.split("&");
            for (i = 0; i < len; ++i) {
                item = params[i].split("=");
                if (item[0] === key) {
                    return item[1];
                }
            }
        },
        /**
         * @return {String}
         */
        getHash: function () {
            return loc.hash;
        }
    };
}(this));

/**
 * Utils tools
 * @package pklib.utils
 * @dependence pklib.array, pklib.browser, pklib.dom, pklib.event, pklib.string
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {},
        document = global.document || {};

    pklib.utils = {
        ascii: {
            letters: {
                lower: [113, 119, 101, 114, 116, 121, 117, 105, 111, 112, 97, 115, 100, 102, 103, 104, 106, 107, 108, 122, 120, 99, 118, 98, 110, 109],
                upper: [81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 65, 83, 68, 70, 71, 72, 74, 75, 76, 90, 88, 67, 86, 66, 78, 77]
            }
        },
        date: {
            /**
             * @return {string}
             */
            getFullMonth: function () {
                var month = (parseInt(new Date().getMonth(), 10) + 1);
                return (month < 10) ? "0" + month : month;
            }
        },
        action: {
            /**
             * @param obj {HTMLElement}
             */
            clearfocus: function (obj) {
                if (typeof obj !== "undefined") {
                    pklib.event.add(obj, "focus", function () {
                        if (this.value === this.defaultValue) {
                            this.value = "";
                        }
                    });
                    pklib.event.add(obj, "blur", function () {
                        if (this.value === "") {
                            this.value = this.defaultValue;
                        }
                    });
                }
            },
            /**
             * @param area {HTMLElement}
             */
            outerlink: function (area) {
                area = area || document;
                var i,
                    link,
                    links = pklib.dom.byTag("a"),
                    len = links.length,
                    opentrigger = function (evt) {
                        global.open(this.href);
                        evt.preventDefault();
                    };
                for (i = 0; i < len; ++i) {
                    link = links[i];
                    if (link.rel === "outerlink") {
                        pklib.event.add(link, "click", opentrigger.bind(link));
                    }
                }
            },
            /**
             * @param element {HTMLElement}
             * @param text {String}
             */
            confirm: function (element, text) {
                var response;
                if (typeof element !== "undefined") {
                    text = text || "Sure?";

                    pklib.event.add(element, "click", function (evt) {
                        response = global.confirm(text);
                        if (true === response) {
                            return true;
                        } else {
                            evt.preventDefault();
                        }
                    });
                }
            }
        },
        /**
         * @param param {Number}
         * @param animate {Boolean}
         */
        scrollTo: function (param, animate) {
            var interval = null;
            if (true === animate) {
                interval = global.setInterval(function () {
                    document.body.scrollTop -= 5;
                    if (document.body.scrollTop <= 0) {
                        global.clearInterval(interval);
                    }
                }, 1);
            } else {
                document.body.scrollTop = param + "px";
            }
        }
    };
}(this));

/**
 * @package pklib.ui
 * @dependence pklib.string. pklib.dom
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {};

    pklib.ui = {
        /**
         * @param element {HTMLElement}
         * @param wrapper {HTMLElement}
         * @throws {TypeError}
         * @return {Array}
         */
        center: function (element, wrapper) {
            var left = null,
                top = null,
                pus = this.size;

            if (!pklib.dom.isElement(element)) {
                throw new TypeError("pklib.ui.center: @element: not Element");
            }

            if (wrapper === document.body) {
                left = (Math.max(pus.window("width"), pus.document("width")) - pus.object(element, "width")) / 2;
                top = (Math.max(pus.window("height"), pus.document("height")) - pus.object(element, "height")) / 2;
            } else {
                left = (pus.window("width") - pus.object(element, "width")) / 2;
                top = (pus.window("height") - pus.object(element, "height")) / 2;
            }
            element.style.left = left + "px";
            element.style.top = top + "px";
            element.style.position = "absolute";
            return [left, top];
        },
        /**
         * @param element {HTMLElement}
         * @param wrapper {HTMLElement}
         * @return {Array}
         */
        maximize: function (element, wrapper) {
            var width = null,
                height = null,
                pus = pklib.ui.size;

            if (wrapper === document.body) {
                width = Math.max(pus.window("width"), pus.document("width"));
                height = Math.max(pus.window("height"), pus.document("height"));
                if (pklib.browser.getName() === "msie") {
                    width -= 20;
                }
            } else {
                width = pus.object(wrapper, "width");
                height = pus.object(wrapper, "height");
            }
            element.style.width = width;
            element.style.height = height;
            return [width, height];
        }
    };
}(this));
/**
 * Loader adapter.
 * Show animate image (GIF) on special place.
 * @package pklib.loader
 * @dependence pklib.dom, pklib.event, pklib.utils
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {},
        document = global.document || {},
        id = "pklib-loader-wrapper",
        settings = {
            src: "http://pklib.com/img/icons/loader.gif",
            container: null,
            style: {
                width: 31,
                height: 31,
                zIndex: 1010
            },
            center: true
        };

    pklib.ui.loader = {
        /**
         * @type string
         */
        objId: id,
        /**
         * @param {object} config
         * @param {function} callback
         */
        show: function (config, callback) {
            settings.container = document.body;
            settings = pklib.array.mixin(settings, config);

            var loader = document.createElement("img"),
                loaderStyle = loader.style,
                style;

            loader.setAttribute("id", this.objId);
            loader.setAttribute("src", settings.src);
            for (style in settings.style) {
                if (settings.style.hasOwnProperty(style)) {
                    loaderStyle[style] = settings.style[style];
                }
            }
            if (settings.center) {
                pklib.ui.center(loader, settings.container);

                pklib.event.add(global, "resize", function () {
                    pklib.ui.center(loader, settings.container);
                });
            }
            settings.container.appendChild(loader);
            if (typeof callback === "function") {
                callback();
            }
            loader = null;
        },
        /**
         * @param callback {Function}
         */
        close: function (callback) {
            var loader = pklib.dom.byId(this.objId),
                result = false;
            if (loader !== null) {
                loader.parentNode.removeChild(loader);
                this.close(callback);
                result = true;
            }
            if (typeof callback === "function") {
                callback();
            }
            return result;
        }
    };
}(this));

/**
 * Show layer on special place.
 * @package pklib.message
 * @dependence pklib.dom, pklib.event, pklib.utils
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {},
        document = global.document || {},
        id = "pklib-message-wrapper",
        settings = {
            container: null,
            style: {
                width: 300,
                height: 300,
                zIndex: 1010
            }
        };

    pklib.ui.message = {
        /**
         * @type string
         */
        objId: id,
        /**
         * @type null
         */
        content: null,
        /**
         * @param config {Object}
         * @param callback {Function}
         */
        show: function (config, callback) {
            settings.container = document.body;
            settings = pklib.array.mixin(settings, config);

            var message = document.createElement("div"),
                messageStyle = message.style,
                style;

            message.setAttribute("id", this.objId);
            for (style in settings.style) {
                if (settings.style.hasOwnProperty(style)) {
                    messageStyle[style] = settings.style[style];
                }
            }

            if (typeof this.content === "string") {
                message.innerHTML = this.content;
            } else if (pklib.dom.isNode(this.content)) {
                message.appendChild(this.content);
            }

            settings.container.appendChild(message);
            pklib.ui.center(message, settings.container);

            pklib.event.add(global, "resize", function () {
                pklib.ui.center(message, settings.container);
            });
            if (typeof callback === "function") {
                callback();
            }
            return message;
        },
        /**
         * @param callback {Function}
         */
        close: function (callback) {
            var message = pklib.dom.byId(this.objId),
                result = false;
            if (message !== null) {
                message.parentNode.removeChild(message);
                this.close(callback);
                result = true;
            }
            if (typeof callback === "function") {
                callback();
            }
            return result;
        }
    };
}(this));

/**
 * Glass Adapter.
 * Show this on dimensions on browser. 
 * @package pklib.glass
 * @dependence pklib.browser, pklib.dom, pklib.event, pklib.utils
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {},
        document = global.document || {},
        id = "pklib-glass-wrapper",
        settings = {
            container: null,
            style: {
                position: "absolute",
                left: 0,
                top: 0,
                background: "#000",
                opacity: 0.5,
                zIndex: 1000
            }
        };

    if (typeof pklib.ui === "undefined" ) {
        pklib.ui = {};
    }
    
    pklib.ui.glass = {
        /**
         * @type {String}
         */
        objId: id,
        /**
         * @param config {Object}
         * @param callback {Function}
         */
        show: function (config, callback) {
            var that = this,
                glass = document.createElement("div"),
                glassStyle = glass.style,
                style;
            settings.container = document.body;
            settings = pklib.array.mixin(settings, config);
            settings.style.filter = "alpha(opacity=" + parseFloat(settings.style.opacity, 10) * 100 + ")";

            glass.setAttribute("id", this.objId);
            for (style in settings.style) {
                if (settings.style.hasOwnProperty(style)) {
                    glassStyle[style] = settings.style[style];
                }
            }

            settings.container.appendChild(glass);

            pklib.ui.maximize(glass, settings.container);

            pklib.event.add(global, "resize", function () {
                that.close();
                that.show(config, callback);
                pklib.ui.maximize(glass, settings.container);
            });
            if (typeof callback === "function") {
                callback();
            }
            return glass;
        },
        /**
         * @param callback {Function}
         * @return {Boolean}
         */
        close: function (callback) {
            var glass = pklib.dom.byId(this.objId),
                result = false;
            if (glass !== null) {
                glass.parentNode.removeChild(glass);
                this.close(callback);
                result = true;
            }
            if (typeof callback === "function") {
                callback();
            }
            return result;
        }
    };
}(this));

/**
 * @package pklib.ui.size
 */
(function (global) {
    "use strict";
    
    var pklib = global.pklib || {};

    pklib.ui.size = {
        /**
         * @param name {String}
         * @throws {TypeError}
         * @return {Number}
         */
        window: function (name) {
            var clientName;
            if (typeof name === "undefined") {
                throw new TypeError("pklib.ui.size.window: @name: undefined");
            }
            name = pklib.string.capitalize(name);
            clientName = global.document.documentElement["client" + name];
            return (global.document.compatMode === "CSS1Compat" && clientName) || global.document.body["client" + name] || clientName;
        },
        /**
         * @param name {String}
         * @return {Number}
         */
        document: function (name) {
            var clientName,
                scrollBodyName,
                scrollName,
                offsetBodyName,
                offsetName;
            if (typeof name === "undefined") {
                throw new TypeError("pklib.ui.size.document: @name: undefined");
            }
            name = pklib.string.capitalize(name);
            clientName = document.documentElement["client" + name];
            scrollBodyName = document.body["scroll" + name];
            scrollName = document.documentElement["scroll" + name];
            offsetBodyName = document.body["offset" + name];
            offsetName = document.documentElement["offset" + name];
            return Math.max(clientName, scrollBodyName, scrollName, offsetBodyName, offsetName);
        },
        /**
         * @param obj {HTMLElement}
         * @param name {String}
         * @return {number}
         */
        object: function (obj, name) {
            if (typeof name === "undefined" || typeof obj === "undefined") {
                throw new TypeError("pklib.ui.size.object: @name: undefined");
            }
            name = pklib.string.capitalize(name);
            var client = obj["client" + name], scroll = obj["scroll" + name], offset = obj["offset" + name];
            return Math.max(client, scroll, offset);
        }
    };
}(this));

