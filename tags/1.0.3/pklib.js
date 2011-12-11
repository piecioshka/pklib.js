/**
 * pklib JavaScript library v1.0.3
 * 
 * Copyright (c) 2011 Piotr Kowalski, http://pklib.com/
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
 * Date: Fri Dec 9 00:43:02 GMT 2011
 */

(function (win) {
    'use strict';
    win.pklib = {
        author: "Piotr Kowalski",
        www: "http://pklib.com/",
        version: "1.0.3"
    };
}(this));

/**
 * Module to service asynchronous request.
 * @package ajax
 * @dependence array, utils
 */
(function (win) {
    'use strict';
    var pklib = win.pklib || {},
        cache = [];

    function handler(settings, xhr) {
        var ct,
            xmlct,
            method = "responseText";

        if (xhr.readyState === 4) {
            cache[settings.url] = xhr;

            ct = xhr.getResponseHeader("Content-Type");
            xmlct = ["application/xml", "text/xml"];

            if (pklib.array.inArray(ct, xmlct)) {
                method = "responseXML";
            }

            settings.done.call(null, xhr[method]);
        }
    }

    function getXhr() {
        var xhr;
        try {
            xhr = new XMLHttpRequest();
        } catch (f) {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (a) {
                try {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (b) {
                    // not support ajax
                    return null;
                }
            }
        }
        return xhr;
    }

    pklib.ajax = {

        /**
         * Lazy load file.
         *
         * @param config {Object}
         * <pre>
         * {
         *      type {String|default /get/}
         *      async {Boolean|default true}
         *      cache {Boolean|default false}
         *      url {String}
         *      params {Array or Object}
         *      headers {Object}
         *      done {Function}
         * }
         * </pre>
         */
        load: function (config) {
            var header,
                client = null,
                settings = {
                    type: "get",
                    async: true,
                    cache: false,
                    url: null,
                    params: null,
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
                client = getXhr();
                client.onreadystatechange = function () {
                    handler.call(null, settings, client);
                };
                client.open(settings.type, settings.url, settings.async);
                if (settings.headers !== null) {
                    for (header in settings.headers) {
                        if (settings.headers.hasOwnProperty(header)) {
                            client.setRequestHeader(header, settings.headers[header]);
                        }
                    }
                }
                client.send(settings.params);
            }
        }

    };
}(this));

/**
 * Module to service array object.
 * @package array
 */
(function (win) {
    'use strict';
    var pklib = win.pklib || {};

    pklib.array =  {

        /**
         * Check if object is array,
         * Check by:
         * - typeof object
         * - not null
         * - typeof object.length
         * - typeof object.slice
         * 
         * @param obj {HTMLElement}
         * @return {Boolean}
         */
        isArray: function (obj) {
            return typeof obj === "object" && obj !== null && typeof obj.length !== "undefined" && typeof obj.slice !== "undefined";
        },
        /**
         * Check if element is in array by loop.
         * 
         * @param {var) param
         * @param {Array} array
         * @return {Boolean}
         */
        inArray: function (param, array) {
            var i = 0,
                len = array.length;
            for (i = 0; i < len; i += 1) {
                if (array[i] === param) {
                    return true;
                }
            }
            return false;
        },
        /**
         * Unique array. Delete element what was duplicated.
         * 
         * @param array {Array}
         * @return {Array}
         */
        unique: function (array) {
            var i,
                temp = [],
                item,
                len = array.length;
            for (i = 0; i < len; i += 1) {
                item = array[i];
                if (this.inArray.call(null, item, temp) === false) {
                    temp.push(item);
                }
            }
            return temp;
        },
        /**
         * Remove element declarated in infinity params without first.
         * First parameter is array object.
         * 
         * @param array {Array}
         * @param {var}
         * @return {Array}
         */
        remove: function (array) {
            var i,
                param,
                params = Array.prototype.splice.call(arguments, 1),
                len = params.length,
                inside;
            for (i = 0; i < len; i += 1) {
                param = params[i];
                inside = this.inArray(param, array);
                if (inside !== false) {
                    array.splice(inside, 1);
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
            var i,
                len = 0,
                element,
                item;
            if (this.isArray(target) && this.isArray(source)) {
                len = source.length;
                for (i = 0; i < len; i += 1) {
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
 * @package aspect
 */
(function (win) {
    'use strict';
    var pklib = win.pklib || {};

    /**
     * Create method with merge first and second.
     * Second method is run after first.
     *
     * @param fun {Function} The function to bind aspect function
     * @param asp {Function} The aspect function
     */
    pklib.aspect = function (fun, asp) {
        var that = this;
        if (typeof fun !== "function" || typeof asp !== "function") {
            throw new TypeError("Params are not functions");
        }
        return function () {
            asp.call(that);
            return fun.apply(that, arguments);
        };
    };
}(this));

/**
 * Get best information about browser.
 * @package browser
 */
(function (win) {
    'use strict';
    var pklib = win.pklib || {},
        navigator = win.navigator || {},
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

            for (i = 0; i < len; i += 1) {
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
            var i,
                len = browsers.length,
                userAgent = navigator.userAgent.toLowerCase(),
                browser,
                cur;

            for (i = 0; i < len; i += 1) {
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
 * @package cookie
 */
(function (win) {
    'use strict';
    var pklib = win.pklib || {},
        document = win.document || {};

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

            return this.read(name);
        },
        /**
         * Read cookie by it name.
         * @param name {String}
         * @return {Null or String}
         */
        read: function (name) {
            if (typeof name === "undefined") {
                return null;
            }
            name = name + "=";
            var i,
                c,
                ca = document.cookie.split(";"),
                len = ca.length;

            for (i = 0; i < len; i += 1) {
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
        erase: function (name) {
            return this.create(name, undefined, -1);
        }
    };
}(this));
/**
 * Utils method related css on tags in DOM tree.
 * @package css
 * @dependence string
 */
(function (win) {
    'use strict';
    var pklib = win.pklib || {};

    pklib.css = {
        /**
         * Add CSS class to element define in second parameter.
         * @param element {HTMLElement}
         * @param cssClass {String}
         */
        addClass: function (cssClass, element) {
            if (typeof element === "undefined" || element === null || typeof cssClass === "undefined") {
                throw new TypeError("pklib.css.addClass: Element is undefined/null or cssClass is undefined");
            }
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
         * @param element {HTMLElement}
         * @param cssClass {String}
         */
        removeClass: function (cssClass, element) {
            if (typeof element === "undefined" || element === null || typeof cssClass === "undefined") {
                throw new TypeError("pklib.css.removeClass: Element is undefined/null or cssClass is undefined");
            }
            var regexp = new RegExp("(\\s" + cssClass + ")|(" + cssClass + "\\s)|" + cssClass, "i");
            element.className = pklib.string.trim(element.className.replace(regexp, ""));
        },
        /**
         * Check if element has CSS class
         * @param element {HTMLElement}
         * @param cssClass {String}
         * @return {Boolean}
         */
        hasClass: function (cssClass, element) {
            if (typeof element === "undefined" || element === null || typeof cssClass === "undefined") {
                throw new TypeError("pklib.css.hasClass: Element is undefined/null or cssClass is undefined");
            }
            var regexp = new RegExp("(\\s" + cssClass + ")|(" + cssClass + "\\s)|" + cssClass, "i");
            return regexp.test(element.className);
        }
    };
}(this));

/**
 * Helper related with DOM service.
 * @package dom
 * @dependence browser, css, utils
 */
(function (win) {
    'use strict';
    var pklib = win.pklib || {},
        document = win.document || {};

    function walk_the_dom(node, func) {
        func(node);
        node = node.firstChild;
        while (node) {
            walk_the_dom(node, func);
            node = node.nextSibling;
        }
    }

    function getType(selector) {
        if (/^\.(\w*)$/.test(selector)) {
            return "class";
        } else if (/^\#(\w*)$/.test(selector)) {
            return "id";
        } else {
            return "tag";
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
         * @param {HTMLElement} element
         * @return {String}
         */
        isNode: function (element) {
            return ((element && element.nodeType) && element.nodeName) || null;
        },
        /**
         * @param id {String}
         * @param container {HTMLElement}
         * @return {HTMLElement}
         */
        byId: function (id, container) {
            container = container || document;
            return container.getElementById(id);
        },
        /**
         * @param tag {String}
         * @param container {HTMLElement}
         * @return {NodeList}
         */
        byTag: function (tag, container) {
            container = container || document;
            return container.getElementsByTagName(tag);
        },
        /**
         * @param cssClass {String}
         * @param container {HTMLElement}
         * @return {NodeList or array}
         */
        byClass: function (cssClass, container) {
            container = container || document;
            var results = [];
            if (container.getElementsByClassName) {
                return container.getElementsByClassName(cssClass);
            } else {
                walk_the_dom(container, function (node) {
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
         */
        get: function (selector) {
            try {
                var i,
                    elements = selector.match(/[\.\#\w]+/g),
                    len = elements.length,
                    scope = win,
                    item,
                    type;
                for (i = 0; i < len; i += 1) {
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
        /**
         * @param element {HTMLElement}
         * @return {Null or Number}
         */
        index: function (element) {
            var i,
                parent = element.parentNode,
                elements = this.children(parent),
                len = elements.length,
                item;
            for (i = 0; i < len; i += 1) {
                item = elements[i];
                if (item === element) {
                    return i;
                }
            }
            return null;
        },
        /**
         * @param element {HTMLElement}
         * @return {Array}
         */
        children: function (element) {
            var i,
                array = [],
                childs = element.childNodes,
                len = childs.length;
            for (i = 0; i < len; i += 1) {
                if (childs[i].nodeType === this.nodeTypes.ELEMENT_NODE) {
                    array.push(childs[i]);
                }
            }
            return array;
        },
        /**
         * @param element {HTMLElement}
         * @param container {HTMLElement}
         * @return {Array}
         */
        center: function (element, container) {
            var left = null,
                top = null;
            if (container === document.body) {
                left = (Math.max(pklib.utils.size.window("width"), pklib.utils.size.document("width")) - pklib.utils.size.object(element, "width")) / 2;
                top = (Math.max(pklib.utils.size.window("height"), pklib.utils.size.document("height")) - pklib.utils.size.object(element, "height")) / 2;
            } else {
                left = (pklib.utils.size.window("width") - pklib.utils.size.object(element, "width")) / 2;
                top = (pklib.utils.size.window("height") - pklib.utils.size.object(element, "height")) / 2;
            }
            element.style.left = left + "px";
            element.style.top = top + "px";
            element.style.position = "absolute";
            return [left, top];
        },
        /**
         * @param element {HTMLElement}
         * @param container {HTMLElement}
         * @return {Array}
         */
        maximize: function (element, container) {
            var width = null,
                height = null;
            if (container === document.body) {
                width = Math.max(pklib.utils.size.window("width"), pklib.utils.size.document("width"));
                height = Math.max(pklib.utils.size.window("height"), pklib.utils.size.document("height"));
                if (pklib.browser.getName() === "msie") {
                    width -= 20;
                }
            } else {
                width = pklib.utils.size.object(container, "width");
                height = pklib.utils.size.object(container, "height");
            }
            element.style.width = width;
            element.style.height = height;
            return [width, height];
        },
        /**
         * @param element {HTMLElement}
         * @param container {HTMLElement}
         * @return {HTMLElement}
         */
        insert: function (element, container) {
            if (this.isNode(element)) {
                container.appendChild(element);
            } else if (typeof element === "string") {
                container.innerHTML += element;
            }
            return element;
        }
    };
}(this));
/**
 * Helper about manage event on HTMLElement.
 * @package event
 */
(function (win) {
    'use strict';
    var pklib = win.pklib || {};

    pklib.event = {

        /**
         * @param target {HTMLElement}
         * @param eventType {String}
         * @param callback {Function}
         * @param bubbles {Boolean}
         * @return {Event}
         */
        add: function (target, eventType, callback, bubbles) {
            bubbles = bubbles || false;

            if (target.attachEvent) {
                target.attachEvent("on" + eventType, callback);
            } else if (target.addEventListener) {
                target.addEventListener(eventType, callback, bubbles);
            }
        },
        /**
         * @param target {HTMLElement}
         * @param eventType {String}
         * @param callback {Function}
         * @param bubbles {Boolean}
         * @return {boolean}
         */
        remove: function (target, eventType, callback, bubbles) {
            if (target.detachEvent) {
                this.remove = function (target, eventType, callback) {
                    target.detachEvent("on" + eventType, callback);
                    return true;
                };
            } else if (target.removeEventListener) {
                this.remove = function (target, eventType, callback, bubbles) {
                    bubbles = bubbles || false;
                    target.removeEventListener(eventType, callback, bubbles);
                    return true;
                };
            }
            return this.remove(target, eventType, callback, bubbles);
        }
    };
}(this));

/**
 * File manager
 * @package file
 */
(function (win) {
    'use strict';
    var pklib = win.pklib || {},
        document = win.document || {};

    pklib.file = (function () {
        var lazy_file = 0;
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
        return {
            /**
             * Lazy load scripts.
             * Append script to HEAD section.
             * @param src {String}
             * @param callback {Function}
             */
            load: function (src, callback) {
                loadjs(src, function (script) {
                    if (typeof callback === "function") {
                        callback(script);
                    }
                });
            },
            /**
             * Lazy load menu files with dependencies which is que 
             * files in array.
             * Append script to HEAD section.
             *
             * @param files {Array}
             * @param callback {Function}
             * @param is_continue {Bool}
             */
            lazy_load: function (files, callback, is_continue) {
                var that = this,
                    len = files.length,
                    file = files[lazy_file];
                if (!is_continue) {
                    lazy_file = 0;
                }
                loadjs(file, function () {
                    if (lazy_file < len - 1) {
                        lazy_file += 1;
                        that.lazy_load(files, callback, true);
                    } else {
                        if (typeof callback === "function") {
                            callback();
                        }
                    }
                });
            }
        };

    }());

}(this));

/**
 * Glass Adapter.
 * Show this on dimensions on browser. 
 * @package glass
 * @dependence browser, dom, event, utils
 */
(function (win) {
    'use strict';
    var pklib = win.pklib || {},
        document = win.document || {},
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

    pklib.glass = {

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

            pklib.dom.maximize(glass, settings.container);

            pklib.event.add(win, "resize", function () {
                that.close();
                that.show(config, callback);
                pklib.dom.maximize(glass, settings.container);
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
 * JSON manager
 * @package json
 */
(function (win) {
    'use strict';
    var pklib = win.pklib || {};

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
        for (i = 0; i < len; i += 1) {
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
                for (i = 0; i < len; i += 1) {
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
         * @returns {String}
         */
        serialize: function (source, toJson) {
            if (typeof source !== "object" || source === null) {
                throw new TypeError("pklib.json.serialize: Source is null or not object");
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
 * Loader adapter.
 * Show animate image (GIF) on special place.
 * @package loader
 * @dependence dom, event, utils
 */
(function (win) {
    'use strict';
    var pklib = win.pklib || {},
        document = win.document || {},
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

    pklib.loader = {

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
                pklib.dom.center(loader, settings.container);

                pklib.event.add(win, "resize", function () {
                    pklib.dom.center(loader, settings.container);
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
 * @package message
 * @dependence dom, event, utils
 */

(function (win) {
    'use strict';
    var pklib = win.pklib || {},
        document = win.document || {},
        id = "pklib-message-wrapper",
        contents = null,
        settings = {
            container: null,
            style: {
                width: 300,
                height: 300,
                zIndex: 1010
            }
        };

    pklib.message = {
        objId: id,
        content: contents,
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

            pklib.dom.center(message, settings.container);

            pklib.event.add(win, "resize", function () {
                pklib.dom.center(message, settings.container);
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
 * Time analyzer
 * @package pklib.profiler
 */
(function (win) {
    'use strict';
    var pklib = win.pklib || {},
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
 * @package prototypes
 */
Function.prototype.method = function (name, func) {
    'use strict';
    this.prototype[name] = func;
    return this;
};

Function.method("bind", function (that) {
    'use strict';
    var method = this,
        slice = Array.prototype.slice,
        args = slice.apply(arguments, [1]);
    return function () {
        return method.apply(that, args.concat(slice.apply(arguments, [0])));
    };
});
/**
 * String service manager
 * @package string
 */

(function (win) {
    'use strict';
    var pklib = win.pklib || {};

    pklib.string = {
        /**
         * @param source {var}
         * @return {Boolean}
         */
        isString: function (source) {
            return typeof source === "string";
        },
        /**
         * @param source {var}
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
        strip_tags: function (source) {
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
         * @param len {Number}
         * @return {String}
         */
        slice: function (source, len) {
            var item,
                text = "",
                num = source.length;
            for (item = 0; item < num; item += 1) {
                text += source[item];
                if (item === len - 1) {
                    if (num - len >= 1) {
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
 * @package url
 */
(function (win) {
    'use strict';
    var pklib = win.pklib || {},
        loc = win.location;

    pklib.url = {
        getProtocol: function () {
            return loc.protocol;
        },
        getHost: function () {
            return loc.host;
        },
        getPort: function () {
            return loc.port || 80;
        },
        getUri: function () {
            return loc.pathname;
        },
        getParams: function () {
            var params = loc.search,
                params_obj = {},
                i,
                item,
                len = 0;
            if (params.substr(0, 1) === "?") {
                params = params.substr(1);
            }
            params = params.split("&");
            len = params.length;
            for (i = 0; i < len; i += 1) {
                item = params[i].split("=");
                params_obj[item[0]] = item[1];
            }
            return params_obj;
        },
        getParam: function (key) {
            var params = loc.search,
                i,
                item,
                len = params.length;
            if (params.substr(0, 1) === "?") {
                params = params.substr(1);
            }
            params = params.split("&");
            for (i = 0; i < len; i += 1) {
                item = params[i].split("=");
                if (item[0] === key) {
                    return item[1];
                }
            }
        },
        getHash: function () {
            return loc.hash;
        }
    };
}(this));

/**
 * Utils tools
 * @package utils
 * @dependence array, browser, dom, event, string
 */
(function (win) {
    'use strict';
    var pklib = win.pklib || {},
        document = win.document || {};

    pklib.utils = {
        size: {
            /**
             * @param {string} name
             * @returns {number}
             */
            window: function (name) {
                var clientName;
                if (typeof name === "undefined") {
                    throw new TypeError("pklib.utils.size.window: Parameter name is mandatory");
                }
                name = pklib.string.capitalize(name);
                clientName = win.document.documentElement["client" + name];
                return (win.document.compatMode === "CSS1Compat" && clientName) || win.document.body["client" + name] || clientName;
            },
            /**
             * @param {string} name
             * @return {number}
             */
            document: function (name) {
                var clientName,
                    scrollBodyName,
                    scrollName,
                    offsetBodyName,
                    offsetName;
                if (typeof name === "undefined") {
                    throw new TypeError("pklib.utils.size.document: Parameter name is mandatory");
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
             * @param {HTMLElement} obj
             * @param {string} name
             * @return {number}
             */
            object: function (obj, name) {
                if (typeof name === "undefined" || typeof obj === "undefined") {
                    throw new TypeError("pklib.utils.size.object: Parameter name is mandatory");
                }
                name = pklib.string.capitalize(name);
                var client = obj["client" + name], scroll = obj["scroll" + name], offset = obj["offset" + name];
                return Math.max(client, scroll, offset);
            }
        },
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
             * @param {HTMLElement} obj
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
             * @param {HTMLElement} area
             */
            outerlink: function (area) {
                area = area || document;
                var i,
                    e,
                    link,
                    links = pklib.dom.byTag("a"),
                    len = links.length,
                    opentrigger = function (evt) {
                        win.open(this.href);
                        evt.preventDefault();
                    };
                for (i = 0; i < len; i += 1) {
                    link = links[i];
                    if (link.rel === "outerlink") {
                        pklib.event.add(link, "click", opentrigger.bind(link));
                    }
                }
            },
            /**
             * @param {HTMLElement} element
             * @param {string} text
             */
            confirm: function (element, text) {
                var response;
                if (typeof element !== "undefined") {
                    text = text || "Sure?";

                    pklib.event.add(element, "click", function (evt) {
                        response = win.confirm(text);
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
         * @param param
         * @param {boolean} animate
         */
        scrollTo: function (param, animate) {
            var interval = null;
            if (true === animate) {
                interval = win.setInterval(function () {
                    document.body.scrollTop -= 5;
                    if (document.body.scrollTop <= 0) {
                        win.clearInterval(interval);
                    }
                }, 1);
            } else {
                document.body.scrollTop = param;
            }
        }
    };

}(this));

/**
 * Validate module
 * @package validate
 * @dependence array, utils
 */
(function (win) {
    'use strict';
    var pklib = win.pklib || {};

    pklib.validate = {
        /**
         * @param object {Object}
         * @return {Boolean}
         */
        empty: function (object) {
            var iterator = 0,
                item;
            if (object === null) {
                return true;
            } else if (pklib.array.isArray(object)) {
                return (object.length === 0);
            } else {
                switch (typeof object) {
                case "string":
                    return (object === "");
                case "number":
                    return (object === 0);
                case "object":
                    for (item in object) {
                        if (object.hasOwnProperty(item)) {
                            iterator += 1;
                        }
                    }
                    return (iterator === 0);
                }
                return false;
            }
        },
        /**
         * @param config {Object}
         * <pre>
         * {
         *      object {String}
         *      regexp {Object}
         *
         *      error {Function},
         *      success {Function}
         * }
         * </pre>
         *
         * @return {Function}
         */
        regexp: function (config) {
            var exp,
                settings = {
                    object: null,
                    regexp: null,
                    error: function () {
                        // pass
                    },
                    success: function () {
                        // pass
                    }
                };
            if (config === null || typeof config === "udnefined") {
                throw new TypeError("pklib.validate.regexp: Config is undefined");
            }
            settings = pklib.array.mixin(settings, config);

            if (settings.regexp === null) {
                throw new TypeError("pklib.validate.regexp: Regular expressino is neeeded");
            }
            exp = new RegExp(settings.regexp);

            if (settings.object === null) {
                throw new TypeError("pklib.validate.regexp: Object is neeeded");
            }
            if (exp.test(settings.object)) {
                if (typeof settings.success === "function") {
                    return settings.success();
                }
            }
            if (typeof settings.error === "function") {
                return settings.error();
            }
        }
    };
}(this));

