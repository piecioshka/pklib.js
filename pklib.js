/**
 * pklib JavaScript library v1.2.3
 * 
 * Copyright (c) 2012 Piotr Kowalski, http://pklib.com/
 *
 * MIT License
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
 * Date: ptk 28 lut 12:38:06 2014 CET
 */

/*jslint continue: true, nomen: true, plusplus: true, regexp: true, vars: true, white: true, indent: 4 */
/*global document, XMLHttpRequest, ActiveXObject, setInterval, clearInterval, setTimeout, clearTimeout */

var pklib = {
    VERSION: "1.2.3"
};

if (typeof Function.prototype.bind !== "function") {
    /**
     * Creates a new function that, when called, itself calls this function in the context of the provided this value,
     * with a given sequence of arguments preceding any provided when the new function was called.
     *
     * Method of "Function"
     * Implemented in JavaScript 1.8.5
     * ECMAScript Edition ECMAScript 5th Edition
     *
     * @param {*} that Context
     * @return {Function}
     */
    Function.prototype.bind = function (that) {
        "use strict";

        var method = this,
            slice = [].slice,
            args = slice.apply(arguments, [1]);

        return function () {
            return method.apply(that, args.concat(slice.apply(arguments, [0])));
        };
    };
}

/**
 * @requires pklib.array
 * @requires pklib.common
 * @requires pklib.object
 */
(function (global) {
    "use strict";

    // imports
    var pklib = (global.pklib = global.pklib || {});

    // Default time what is timeout to use function pklib.ajax
    var DEFAULT_TIMEOUT_TIME = 30 * 1000; // 30 second

    var REQUEST_STATE_UNSENT = 0;
    var REQUEST_STATE_OPENED = 1;
    var REQUEST_STATE_HEADERS_RECEIVED = 2;
    var REQUEST_STATE_LOADING = 3;
    var REQUEST_STATE_DONE = 4;

    // Array contain key as url, value as ajax response
    var cache = [];

    /**
     * When success request.
     * @param {Object} settings
     * @param {XMLHttpRequest} xhr
     */
    function success_handler(settings, xhr) {
        var contentType,
            xmlContentType = ["application/xml", "text/xml"],
            property = "responseText";

        if (settings.cache) {
            cache[settings.url] = xhr;
        }

        contentType = xhr.getResponseHeader("Content-Type");

        if (pklib.array.in_array(contentType, xmlContentType)) {
            property = "responseXML";
        }

        settings.done.call(null, xhr[property]);

        // clear memory
        xhr = null;
    }

    /**
     * When error request.
     * @param {Object} settings
     * @param {XMLHttpRequest} xhr
     */
    function error_handler(settings, xhr) {
        // check if error handler is run yet
        if (!xhr._run_error_handler) {
            // NO, so we run error handler first time
            settings.error(settings, xhr);

            // set flag to no run error handler
            xhr._run_error_handler = true;
        }
    }

    /**
     * Use when state in request is changed or if used cache is handler
     * to request.
     * @param {Object} settings
     * @param {XMLHttpRequest} xhr
     */
    function state_change_handler(settings, xhr) {
        var status = 0;

        if (xhr.readyState === REQUEST_STATE_DONE && xhr.status !== REQUEST_STATE_UNSENT) {
            if (xhr.status !== undefined) {
                status = xhr.status;
            }

            clearTimeout(xhr.ontimeout);
            if (xhr.ontimeout) {
                delete xhr.ontimeout;
            }

            if ((status >= 200 && status < 300) || status === 304) {
                // success
                success_handler(settings, xhr);
            } else {
                // error
                error_handler_with_abort(settings, xhr);
            }
        }
    }

    function error_handler_with_abort(settings, xhr) {
        xhr.abort();

        error_handler(settings, xhr);
    }

    /**
     * Handler to unusually situation - timeout.
     * @param {Object} settings
     * @param {XMLHttpRequest} xhr
     */
    function timeout_handler(settings, xhr) {
        error_handler(settings, xhr);
    }

    /**
     * Try to create Internet Explorer XMLHttpRequest.
     * @return {ActiveXObject|undefined}
     * @throws {Error} If cannot create XMLHttpRequest object.
     */
    function create_microsoft_xhr() {
        var xhr;
        try {
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (ignore) {
            try {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (ignored) {
                throw new Error("pklib.ajax.load: can't create XMLHttpRequest object");
            }
        }
        return xhr;
    }

    /**
     * Try to create XMLHttpRequest.
     * @return {XMLHttpRequest|undefined}
     * @throws {Error} If cannot create XMLHttpRequest object.
     */
    function create_xhr() {
        var xhr;
        try {
            xhr = new XMLHttpRequest();
        } catch (ignore) {
            xhr = create_microsoft_xhr();
        }
        return xhr;
    }

    /**
     * Add headers to xhr object.
     * @param {Object} settings
     * @param {XMLHttpRequest} xhr
     */
    function add_headers_to_xhr(settings, xhr) {
        var header,
            headers = settings.headers;

        if (headers !== null) {
            for (header in headers) {
                if (headers.hasOwnProperty(header)) {
                    xhr.setRequestHeader(header, headers[header]);
                }
            }
        }
    }

    /**
     * Add timeout service to xhr object.
     * @param {Object} settings
     * @param {XMLHttpRequest} xhr
     */
    function add_timeout_service_to_xhr(settings, xhr) {
        xhr.ontimeout = setTimeout(function () {
            timeout_handler(settings, xhr);
        }, settings.timeout);
    }

    /**
     * Check is response on this request is in cache.
     * @param {Object} settings
     * @return {boolean}
     */
    function is_response_in_cache(settings) {
        return cache[settings.url];
    }

    /**
     * Return object what is default configuration of request.
     * @return {Object} Default configuration.
     */
    function get_default_settings() {
        /**
         * Request settings, contain ex. headers, callback when run after
         * request finish. Default timeout on request is 30 seconds.
         * This is default timeout from popular web servers, ex. Apache, nginx.
         * Default request hasn't any headers.
         * Default cache is disabled.
         * Default asynchronous is enable.
         */
        return {
            type: "get",
            async: true,
            cache: false,
            url: null,
            params: null,
            timeout: DEFAULT_TIMEOUT_TIME,
            headers: {},
            /**
             * Function run after request ended
             * In params exists only: response
             */
            done: function () {
                // do something when success request
            },
            error: function () {
                // do something when appear error in request
            }
        };
    }

    /**
     * @module pklib.ajax
     * @type {{load: Function, stop: Function}}
     */
    pklib.ajax = {
        /**
         * Send request to server on url defined in config.url.
         * Method throw exception when request have timeout on server or if
         * url is not set. Also, every response (if config.cache is true)
         * saved to hashmap by key config.url. Method on first try to can
         * create XMLHttpRequest if browser doesn't support, check if browser
         * support object ActiveXObject which is implemented in Internet
         * Explorer.
         * @param {Object} config
         * {
         *      {string} [type="get"]
         *      {boolean} [async=true]
         *      {boolean} [cache=false]
         *      {string} url
         *      {Object} [params]
         *      {Object} [headers]
         *      {Function} [done]
         *      {Function} [error]
         * }
         * @example
         * pklib.ajax.load({
         *      type: "post",
         *      async: false,
         *      cache:  true,
         *      url: "http://example.org/check-item.php",
         *      params: { id: 33 },
         *      headers: {
         *          "User-Agent": "tv"
         *      },
         *      done: function (res) {
         *          // pass
         *      }
         * });
         * @return {XMLHttpRequest|null}
         * @throws {Error} If unset request url.
         */
        load: function (config) {
            var xhr = null,
                settings = get_default_settings();

            settings = pklib.object.mixin(settings, config);
            settings.type = settings.type.toUpperCase();

            // simple assert to check "url" is set
            pklib.common.assert(settings.url !== null, "pklib.ajax.load: @url is not defined");

            // check if we use "cache" flag in request
            if (settings.cache && is_response_in_cache(settings)) {
                // YES, we use, so we can return response from cache object
                state_change_handler.call(null, settings, cache[settings.url]);
            } else {
                // NO, is normal request to server
                xhr = create_xhr();
                xhr.onreadystatechange = state_change_handler.bind(null, settings, xhr);

                try {
                    xhr.open(settings.type, settings.url, settings.async);
                } catch (open_exception) {
                    // error
                    error_handler_with_abort(settings, xhr);

                    return xhr;
                }

                add_headers_to_xhr(settings, xhr);
                add_timeout_service_to_xhr(settings, xhr);

                try {
                    xhr.send(settings.params);
                } catch (send_exception) {
                    // error
                    error_handler_with_abort(settings, xhr);

                    return xhr;
                }
            }

            return xhr;
        },

        /**
         * Stop request setting in param.
         * @param {XMLHttpRequest|ActiveXObject} xhr XMLHttpRequest object,
         *     or ActiveXObject object if Internet Explorer.
         */
        stop: function (xhr) {
            xhr.abort();

            // clear memory
            xhr = null;
        }
    };

}(this));
(function (global) {
    "use strict";

    // imports
    var pklib = (global.pklib = global.pklib || {});
    var to_string = Object.prototype.toString;

    /**
     * Check if param is array.
     * @param {Object} array
     * @return {boolean}
     */
    function is_array(array) {
        return array !== null &&
            typeof array === "object" &&
            to_string.call(array) === "[object Array]" &&
            typeof array.length === "number" &&
            typeof array.slice === "function";
    }

    /**
     * Check if element is in array by loop.
     * @param {*} param
     * @param {Array} array
     * @return {boolean}
     */
    function in_array(param, array) {
        var i, len = array.length;
        for (i = 0; i < len; ++i) {
            if (array[i] === param) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get index of element.
     * If couldn't find searching element, return null value.
     * @param {*} item
     * @param {Array} array
     * @return {number|null}
     */
    function index(item, array) {
        var i, len = array.length;
        for (i = 0; i < len; ++i) {
            if (array[i] === item) {
                return i;
            }
        }
        return null;
    }

    /**
     * Unique array. Delete element what was duplicated.
     * @param {Array} array
     * @return {Array}
     */
    function unique(array) {
        var i, item, temp = [],
            len = array.length;

        for (i = 0; i < len; ++i) {
            item = array[i];
            if (!in_array.call(null, item, temp)) {
                temp.push(item);
            }
        }
        return temp;
    }

    /**
     * Remove element declared in infinity params without first.
     * First parameter is array object.
     * @param {Array} array
     * @return {Array}
     */
    function remove(array) {
        var i, param,
            params = [].slice.call(arguments, 1),
            len = params.length;

        for (i = 0; i < len; ++i) {
            param = params[i];
            if (in_array(param, array)) {
                array.splice(index(param, array), 1);
            }
        }
        return array;
    }

    /**
     * @module pklib.array
     * @type {{is_array: Function, in_array: Function, index: Function, unique: Function, remove: Function}}
     */
    pklib.array = {
        is_array: is_array,
        in_array: in_array,
        index: index,
        unique: unique,
        remove: remove
    };

}(this));
/**
 * @requires pklib.common
 */
(function (global) {
    "use strict";

    // imports
    var pklib = (global.pklib = global.pklib || {});

    /**
     * Bind function to aspect.
     * Create method with merge first and second.
     * Second method is run after first.
     * @module pklib.aspect
     * @param {Function} fun The function to bind aspect function.
     * @param {Function} asp The aspect function.
     * @param {string} [when="before"] Place to aspect function.
     * @return {Function}
     * @throws {TypeError} If any param is not function.
     */
    pklib.aspect = function (fun, asp, when) {

        // private
        var self = this, result;
        var assert = pklib.common.assert;

        assert(typeof fun === "function", "pklib.aspect: @func: not {Function}");
        assert(typeof asp === "function", "pklib.aspect: @asp: not {Function}");

        when = when || "before";

        return function () {
            if (when === "before") {
                asp.call(self);
            }

            result = fun.apply(self, arguments);

            if (when === "after") {
                result = asp.call(self);
            }

            return result;
        };
    };

}(this));
(function (global) {
    "use strict";

    // imports
    var pklib = (global.pklib = global.pklib || {});

    /**
     * Basic test function. Simple assertion 2 variables.
     * @param {boolean} expression Object what is true.
     * @param {string} comment Message to throw in error.
     * @throws {Error} Condition it's not true.
     */
    function assert(expression, comment) {
        if (expression !== true) {
            throw new Error(comment);
        }
    }

    /**
     * Deferred function about some milliseconds.
     * If milliseconds is 0 that it's hack for some platforms to use function
     * in "next" thread.
     * @param {Function} defer_function Function what would be deferred.
     * @param {number} [milliseconds] Time to deferred function
     */
    function defer(defer_function, milliseconds) {
        milliseconds = milliseconds || 0;
        setTimeout(defer_function, milliseconds);
    }

    /**
     * Interval checking first function until returns true, run after this
     * second function callback.
     * @param {Function} condition Function returns {@type boolean} status.
     * @param {Function} callback
     */
    function checking(condition, callback) {
        var interval,
            interval_time = 100;

        assert(typeof condition === "function", "pklib.common.checking: @condition: not {Function}");
        assert(typeof callback === "function", "pklib.common.checking: @callback: not {Function}");

        if (condition()) {
            callback();
        } else {
            interval = setInterval(function () {
                if (condition()) {
                    clearInterval(interval);
                    callback();
                }
            }, interval_time);
        }
    }

    /**
     * @module pklib.common
     * @type {{assert: Function, defer: Function, checking: Function}}
     */
    pklib.common = {
        assert: assert,
        defer: defer,
        checking: checking
    };

}(this));
(function (global) {
    "use strict";

    // imports
    var document = global.document;
    var pklib = (global.pklib = global.pklib || {});

    /**
     * Read cookie by it name.
     * @param {string|undefined} name
     * @return {string|null}
     */
    function get_cookie(name) {
        if (name === undefined) {
            return null;
        }
        name += "=";
        var i, c,
            ca = document.cookie.split(";"),
            len = ca.length;

        for (i = 0; i < len; ++i) {
            c = ca[i];
            while (c.charAt(0) === " ") {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(name) === 0) {
                return decodeURIComponent(c.substring(name.length, c.length));
            }
        }
        return null;
    }

    /**
     * Create cookie file with name, value and day expired.
     * @param {string} name
     * @param {string} [value]
     * @param {number} [days]
     * @return {string}
     */
    function create_cookie(name, value, days) {
        var expires = "",
            date = new Date();

        value = value || null;

        if (days !== undefined) {
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }

        document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";

        return get_cookie(name);
    }

    /**
     * Delete cookie by it name.
     * @param {string} name
     * @return {string}
     */
    function remove_cookie(name) {
        return create_cookie(name, undefined, -1);
    }

    /**
     * @module pklib.cookie
     * @type {{create: Function, get: Function, remove: Function}}
     */
    pklib.cookie = {
        create: create_cookie,
        get: get_cookie,
        remove: remove_cookie
    };

}(this));
/**
 * @requires pklib.common
 * @requires pklib.string
 * @requires pklib.dom
 */
(function (global) {
    "use strict";

    // imports
    var pklib = (global.pklib = global.pklib || {});

    /**
     * RegExp use to delete white chars.
     */
    var rclass = /[\n\t\r]/g;

    /**
     * Check typeof params.
     * @param {string} css_class
     * @param {HTMLElement} element
     * @param {string} call_func_name
     * @throws {TypeError} If first param is not string, or second param is
     *     not Node.
     */
    function check_params(css_class, element, call_func_name) {
        var assert = pklib.common.assert;
        var is_element = pklib.dom.is_element;
        var prefix = "pklib.css." + call_func_name;
        assert(typeof css_class === "string", prefix + ": @css_class: not {string}");
        assert(is_element(element), prefix + ": @element: not {HTMLElement}");
    }

    /**
     * Check if element has CSS class.
     * @param {string} css_class
     * @param {HTMLElement} element
     * @return {boolean}
     * @throws {TypeError} If first param is not string, or second param is not
     *     Node
     */
    function has_class(css_class, element) {
        check_params(css_class, element, "has_class");
        var className = " " + css_class + " ";
        return ((" " + element.className + " ").replace(rclass, " ").indexOf(className) > -1);
    }

    /**
     * Add CSS class to element define in second parameter.
     * @param {string} css_class
     * @param {HTMLElement} element
     * @throws {TypeError} If first param is not string, or second param is
     *     not Node.
     */
    function add_class(css_class, element) {
        check_params(css_class, element, "add_class");
        var class_element = element.className;
        if (!has_class(css_class, element)) {
            if (class_element.length) {
                class_element += " " + css_class;
            } else {
                class_element = css_class;
            }
        }
        element.className = class_element;
    }

    /**
     * Remove CSS class from element define in second parameter.
     * @param {string} css_class
     * @param {HTMLElement} element
     * @throws {TypeError} If first param is not string, or second param is
     *     not Node.
     */
    function remove_class(css_class, element) {
        check_params(css_class, element, "remove_class");
        var regexp = new RegExp("(\\s" + css_class + ")|(" + css_class + "\\s)|" + css_class, "i");
        element.className = pklib.string.trim(element.className.replace(regexp, ""));
    }

    /**
     * @module pklib.css
     * @type {{add_class: Function, remove_class: Function, has_class: Function}}
     */
    pklib.css = {
        add_class: add_class,
        remove_class: remove_class,
        has_class: has_class
    };

}(this));
/**
 * @requires pklib.browser
 * @requires pklib.css
 * @requires pklib.string
 * @requires pklib.utils
 */
(function (global) {
    "use strict";

    // imports
    var document = global.document;
    var pklib = (global.pklib = global.pklib || {});
    var to_string = Object.prototype.toString;

    /**
     * Types of all available node.
     */
    var node_types = {
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
    };

    /**
     * Walking on every node in node.
     * @param {HTMLElement} node
     * @param {Function} func Run on every node.
     */
    function walk_the_dom(node, func) {
        if (!!node) {
            func(node);
            node = node.firstChild;
            while (node) {
                walk_the_dom(node, func);
                node = node.nextSibling;
            }
        }
    }

    /**
     * Check if param is Node, with use assertions.
     * @param {Node} node
     * @return {string}
     */
    function is_node(node) {
        return node && node.nodeType && node.nodeName &&
            to_string.call(node) === "[object Node]";
    }

    /**
     * Check if param is NodeList, with use assertions.
     * @param {NodeList} node_list
     * @return {boolean}
     */
    function is_node_list(node_list) {
        var list = ["[object HTMLCollection]", "[object NodeList]"];
        return pklib.array.in_array(to_string.call(node_list), list);
    }

    /**
     * Check if param is instanceOf Element.
     * @param {HTMLElement} node
     * @return {boolean}
     */
    function is_element(node) {
        return (node && node.nodeType === node_types.ELEMENT_NODE) || false;
    }

    /**
     * Check visibility of Node, with use assertions.
     * @param {HTMLElement} node
     * @return {boolean}
     */
    function is_visible(node) {
        pklib.common.assert(is_element(node), "pklib.dom.is_visible: @node is not HTMLElement");

        return node.style.display !== "none" &&
            node.style.visibility !== "hidden" &&
            node.offsetWidth !== 0 &&
            node.offsetHeight !== 0;
    }

    /**
     * Get element by attribute ID.
     * @param {string} id
     * @return {HTMLElement|null}
     */
    function by_id(id) {
        return document.getElementById(id);
    }

    /**
     * Get elements by tag name.
     * @param {string} tag
     * @param {Element} [element]
     * @return {NodeList}
     */
    function by_tag(tag, element) {
        return (element || document).getElementsByTagName(tag);
    }

    /**
     * Get elements by attribute CLASS.
     * @param {string} css_class
     * @param {HTMLElement} [wrapper]
     * @return {Array}
     */
    function by_class(css_class, wrapper) {
        var results = [];

        wrapper = wrapper || document;

        walk_the_dom(wrapper, function (node) {
            if (is_element(node) && pklib.css.has_class(css_class, node)) {
                results.push(node);
            }
        });
        return results;
    }

    /**
     * Get index of node relative siblings.
     * @param {HTMLElement} node
     * @return {number|null}
     */
    function index(node) {
        pklib.common.assert(is_element(node), "pklib.dom.index: @node is not HTMLElement");

        var i,
            parent = pklib.dom.parent(node),
            children = pklib.dom.children(parent),
            len = children.length;

        for (i = 0; i < len; ++i) {
            if (children[i] === node) {
                return i;
            }
        }
        return null;
    }

    /**
     * Get children of element filter by Element type.
     * @param {HTMLElement} node
     * @return {Array}
     */
    function children(node) {
        pklib.common.assert(is_element(node), "pklib.dom.children: @node is not HTMLElement");

        var i,
            array = [],
            childNodes = node.childNodes,
            len = childNodes.length;

        for (i = 0; i < len; ++i) {
            if (is_element(childNodes[i])) {
                array.push(childNodes[i]);
            }
        }
        return array;
    }

    /**
     * Insert data to Node. Maybe param is string so insert will be exec
     * by innerHTML, but if param is Node inserting with appendChild().
     * @param {HTMLElement|string} element
     * @param {HTMLElement} node
     * @return {HTMLElement}
     */
    function insert(element, node) {
        if (is_element(element)) {
            node.appendChild(element);
        } else if (pklib.string.is_string(element)) {
            node.innerHTML += element;
        }
        return element;
    }

    /**
     * Remove Element specified in params.
     * @param {...HTMLElement} items
     */
    function remove(items) {
        var i, node = null, parent = null,
            args = [].slice.call(arguments),
            len = args.length;

        for (i = 0; i < len; ++i) {
            node = args[i];
            if (is_element(node)) {
                parent = node.parentNode;
                parent.removeChild(node);
            }
        }
    }

    /**
     * Get prev Node what will be Element.
     * @param {HTMLElement} node
     * @return {HTMLElement|null}
     */
    function prev(node) {
        var prev_node;

        pklib.common.assert(is_element(node), "pklib.dom.prev: @node is not HTMLElement");

        while (true) {
            prev_node = node.previousSibling;
            if (prev_node !== undefined &&
                    prev_node !== null &&
                    prev_node.nodeType !== node_types.ELEMENT_NODE) {
                node = prev_node;
            } else {
                break;
            }
        }
        return prev_node;
    }

    /**
     * Get next Node what will be Element.
     * @param {HTMLElement} node
     * @return {HTMLElement|null}
     */
    function next(node) {
        var next_node;

        pklib.common.assert(is_element(node), "pklib.dom.next: @node is not HTMLElement");

        while (true) {
            next_node = node.nextSibling;
            if (next_node !== undefined &&
                    next_node !== null &&
                    next_node.nodeType !== node_types.ELEMENT_NODE) {
                node = next_node;
            } else {
                break;
            }
        }
        return next_node;
    }

    /**
     * Get parent element what will by Element, but if parent is not exists
     *     returns null.
     * @param {HTMLElement} node
     * @return {HTMLElement|null}
     */
    function parent(node) {
        var parent_node;

        pklib.common.assert(is_element(node), "pklib.dom.parent: @node is not HTMLElement");

        while (true) {
            parent_node = node.parentNode;
            if (parent_node !== undefined &&
                    parent_node !== null &&
                    parent_node.nodeType !== node_types.ELEMENT_NODE) {
                node = parent_node;
            } else {
                break;
            }
        }
        return parent_node;
    }

    /**
     * @module pklib.dom
     * @type {{is_node: Function, is_node_list: Function, is_element: Function, is_visible: Function, by_id: Function, by_tag: Function, by_class: Function, index: Function, children: Function, insert: Function, remove: Function, prev: Function, next: Function, parent: Function}}
     */
    pklib.dom = {
        is_node: is_node,
        is_node_list: is_node_list,
        is_element: is_element,
        is_visible: is_visible,
        by_id: by_id,
        by_tag: by_tag,
        by_class: by_class,
        index: index,
        children: children,
        insert: insert,
        remove: remove,
        prev: prev,
        next: next,
        parent: parent
    };

}(this));
(function (global) {
    "use strict";

    // imports
    var pklib = (global.pklib = global.pklib || {});

    /**
     * Add event to Element.
     * @param {HTMLElement} target
     * @param {string} event_name
     * @param {Function} handler
     */
    function add_event(target, event_name, handler) {
        if (target.events === undefined) {
            target.events = {};
        }

        var event = target.events[event_name];

        if (event === undefined) {
            target.events[event_name] = [];
        }

        target.events[event_name].push(handler);

        if (target.attachEvent) {
            // IE browser
            target.attachEvent("on" + event_name, handler);
        } else if (target.addEventListener) {
            // other browser
            target.addEventListener(event_name, handler, false);
        } else {
            // for very old browser
            target["on" + event_name] = handler;
        }
    }

    /**
     * Remove event from Element.
     * @param {HTMLElement} target
     * @param {string} event_name
     */
    function remove_event(target, event_name) {
        var removeEvent, events, len, i, handler;

        if (target.events === undefined) {
            target.events = {};
        }

        if (target.detachEvent) {
            // IE browser
            removeEvent = "detachEvent";
        } else if (target.removeEventListener) {
            // other browser
            removeEvent = "removeEventListener";
        }

        if (removeEvent === undefined) {
            // for old browser
            delete target["on" + event_name];
        } else {
            events = target.events[event_name];

            if (events !== undefined) {
                len = events.length;

                for (i = 0; i < len; ++i) {
                    handler = events[i];
                    target[removeEvent](event_name, handler);
                    delete target.events[event_name];
                }
            }
        }
    }

    /**
     * Get array with events with concrete name.
     * @param {HTMLElement} target
     * @param {string} event_name
     * @return {Array|undefined}
     */
    function get_event(target, event_name) {
        if (target.events === undefined) {
            target.events = {};
        }
        return target.events[event_name];
    }

    /**
     * Run events on Element.
     * @param {HTMLElement} target
     * @param {string} event_name
     */
    function trigger(target, event_name) {
        var events, len, i;

        if (target.events === undefined) {
            target.events = {};
        }

        events = target.events[event_name];

        if (events !== undefined) {
            len = events.length;

            for (i = 0; i < len; ++i) {
                events[i].call(target, events[i]);
            }
        }
    }

    /**
     * @module pklib.event
     * @type {{add: Function, remove: Function, get: Function, trigger: Function}}
     */
    pklib.event = {
        add: add_event,
        remove: remove_event,
        get: get_event,
        trigger: trigger
    };

}(this));
/**
 * @requires pklib.array
 * @requires pklib.object
 */
(function (global) {
    "use strict";

    // imports
    var document = global.document;
    var pklib = (global.pklib = global.pklib || {});

    // private
    var copy_files = [];

    /**
     * @param {string} url
     * @param {Function} callback
     */
    function simple_load_js(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;

        function success_callback() {
            if (typeof callback === "function") {
                callback(script);
            }
        }

        function readystatechange() {
            if (script.readyState === "loaded" || script.readyState === "complete") {
                script.onreadystatechange = null;
                success_callback();
            }
        }

        if (script.readyState === undefined) {
            script.onload = success_callback;
        } else {
            script.onreadystatechange = readystatechange;
        }

        if (document.head === undefined) {
            document.head = document.getElementsByTagName("head")[0];
        }

        document.head.appendChild(script);
    }

    /**
     * Load JS files. Url to files could be with path absolute or not.
     * If you must load more than 1 file use array, to set url to files.
     * @param {string|Array} files
     * @param {Function} callback
     */
    function load_js_file(files, callback) {
        var file;

        if (typeof files === "string") {
            file = files;
            simple_load_js(file, function (script) {
                if (typeof callback === "function") {
                    callback(script);
                }
            });
        } else if (pklib.array.is_array(files)) {
            if (!copy_files.length) {
                copy_files = pklib.object.mixin(copy_files, files);
            }

            file = files.shift();

            if (file === undefined) {
                if (typeof callback === "function") {
                    callback({
                        src: copy_files[copy_files.length - 1]
                    });

                    copy_files = [];
                }
            } else {
                simple_load_js(file, function () {
                    load_js_file(files, callback);
                });
            }
        } else {
            throw new Error("pklib.file.loadjs: @files not {string} or {Array}");
        }
    }

    /**
     * @module pklib.file
     * @type {{loadjs: Function}}
     */
    pklib.file = {
        loadjs: load_js_file
    };

}(this));
/**
 * @requires pklib.array
 */
(function (global) {
    "use strict";

    // imports
    var pklib = (global.pklib = global.pklib || {});
    var is_array = pklib.array.is_array;
    var in_array = pklib.array.in_array;
    var to_string = Object.prototype.toString;

    /**
     * Check if param is object.
     * @param {Object} it
     * @return {boolean}
     */
    function is_object(it) {
        return it &&
            to_string.call(it) === "[object Object]" &&
            typeof it === "object" &&
            typeof it.hasOwnProperty === "function" &&
            typeof it.isPrototypeOf === "function";
    }

    /**
     * Mix two params, from second to first param. Return first param mixin
     *     with second param.
     * @param {Array|Object} target
     * @param {Array|Object} source
     * @return {Array|Object}
     */
    function mixin(target, source) {
        var i, len, element, item;

        if (is_array(target) && is_array(source)) {
            len = source.length;

            for (i = 0; i < len; ++i) {
                element = source[i];

                if (!in_array(element, target)) {
                    target.push(element);
                }
            }
        } else {
            for (item in source) {
                if (source.hasOwnProperty(item)) {
                    if (is_object(target[item])) {
                        target[item] = mixin(target[item], source[item]);
                    } else {
                        target[item] = source[item];
                    }
                }
            }
        }
        return target;
    }

    /**
     * Check if object is empty (contains non-value).
     * @param {Object} obj
     * @returns {boolean}
     */
    function is_empty(obj) {
        var i, items = 0;

        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                items++;
            }
        }
        return !items;
    }

    /**
     * @module pklib.object
     * @type {{is_object: Function, mixin: Function, is_empty: Function}}
     */
    pklib.object = {
        is_object: is_object,
        mixin: mixin,
        is_empty: is_empty
    };

}(this));
(function (global) {
    "use strict";

    // imports
    var pklib = (global.pklib = global.pklib || {});

    // private
    var data = {};

    /**
     * @param {string} name
     * @return {number}
     */
    function start(name) {
        data[name] = new Date();
        return data[name];
    }

    /**
     * @param {string} name
     * @return {number}
     */
    function stop(name) {
        data[name] = new Date() - data[name];
        return (new Date((new Date()).getTime() + data[name])).getTime();
    }

    /**
     * @param {string} name
     * @return {number}
     */
    function get_time(name) {
        return data[name];
    }

    /**
     * @module pklib.profiler
     * @type {{start: Function, stop: Function, get_time: Function}}
     */
    pklib.profiler = {
        start: start,
        stop: stop,
        get_time: get_time
    };

}(this));
/**
 * @requires pklib.common
 */
(function (global) {
    "use strict";

    // imports
    var document = global.document;
    var pklib = (global.pklib = global.pklib || {});

    /**
     * @param {string} source
     * @return {boolean}
     */
    function is_string(source) {
        return typeof source === "string";
    }

    /**
     * @param {string} source
     * @return {boolean}
     */
    function is_letter(source) {
        return is_string(source) && (/^[a-zA-Z]$/).test(source);
    }

    /**
     * @param {string} source
     * @return {string}
     */
    function trim(source) {
        return source.replace(/^\s+|\s+$/g, "");
    }

    /**
     * @param {string} source
     * @return {string}
     */
    function slug(source) {
        var result = source.toLowerCase().replace(/\s/mg, "-");
        result = result.replace(/[^a-zA-Z0-9\-]/mg, function (ch) {
            switch (ch.charCodeAt(0)) {
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
    }

    /**
     * @param {string} source
     * @return {string}
     */
    function capitalize(source) {
        return source.substr(0, 1).toUpperCase() + source.substring(1, source.length);
    }

    /**
     * @param {string} source
     * @return {string}
     */
    function delimiter_separated_words(source) {
        return source.replace(/[A-ZĘÓĄŚŁŻŹĆŃ]/g, function (match) {
            return "-" + match.toLowerCase();
        });
    }

    /**
     * @param {string} source
     * @return {string}
     */
    function strip_tags(source) {
        pklib.common.assert(typeof source === "string", "pklib.string.strip_tags: param @source is not a string");

        if (source && source.length !== 0) {
            var dummy = document.createElement("div");
            dummy.innerHTML = source;
            return dummy.textContent || dummy.innerText;
        }
        return source;
    }

    /**
     * @param {string} source
     * @return {string}
     */
    function camel_case(source) {
        var pos, pre, sub, post;

        while (source.indexOf("-") !== -1) {
            pos = source.indexOf("-");
            pre = source.substr(0, pos);
            sub = source.substr(pos + 1, 1).toUpperCase();
            post = source.substring(pos + 2, source.length);
            source = pre + sub + post;
        }
        return source;
    }

    /**
     * @param {string} source Text to slice.
     * @param {number} length number of chars what string will be slice.
     * @param {boolean} [is_force] Force mode. If slice will be end in middle.
     *     of word, use this to save it, or algorithm slice to last space.
     * @return {string}
     */
    function slice(source, length, is_force) {
        pklib.common.assert(typeof source === "string", "pklib.string.slice: param @source is not a string");

        // jeśli długość przycinania jest większa niż długość całego tekstu
        // to zwracamy przekazany tekst
        if (source.length < length) {
            return source;
        }

        // ucinamy tyle tekstu ile jest wskazane w parametrze length
        var text = source.slice(0, length), last_space;

        // sprawdzamy czy nie ucięliśmy w połowie wyrazu:
        // * tj. czy kolejnym znakiem nie jest spacja
        if (source[length] === " ") {
            return text + "...";
        }

        // * ostatnim znakiem w uciętym tekście jest spacja
        if (text[length - 1] === " ") {
            return trim(text) + "...";
        }

        // jeśli nie ma wymuszenia przycinania wyrazu w jego części
        // to sprawdzamy czy możemy przyciąć do ostatniej spacji w przyciętym tekście
        if (!is_force) {
            // niestety ucięliśmy tekst w połowie wyrazu
            // postępujemy zgodnie z instrukcja, że odnajdujemy ostatnią spację
            // i obcinamy fraze do tej spacji 
            last_space = text.lastIndexOf(" ");

            // spacja została znaleziona, więc przycinamy frazę do spacji
            if (last_space !== -1) {
                return text.slice(0, last_space) + "...";
            }
        }

        // włączony tryb "force" albo spacja nie została odnaleziona więc aby nie zwracać 
        // w pustej wartości, ucinamy wyraz w tym miejscu w którym jest
        return text + "...";
    }

    /**
     * Replace tags in string to defined data.
     * ${NAME} - replace by value of object["NAME"]
     * @param {string} str Some string to replace by objects.
     * @param {Object} obj Object what will serve data to replace.
     * @example
     * %{car} is the best!
     * pklib.string.format("%{car} is the best", { car: "Ferrari" });
     * //=> Ferrari is the best!
     */
    function format(str, obj) {
        var name;

        for (name in obj) {
            if (obj.hasOwnProperty(name)) {
                str = str.replace(new RegExp("%{" + name + "}", "ig"), obj[name]);
            }
        }
        return str;
    }

    /**
     * Left padding any chars.
     * @param {string} staff Object what be padding on the left.
     * @param {number} nr_fill Padding size.
     * @param {string} add_char Char what be added.
     */
    function lpad(staff, nr_fill, add_char) {
        var i, string = staff.toString();

        for (i = string.length; i < nr_fill; ++i) {
            string = add_char + string;
        }
        return string;
    }

    /**
     * Right padding any chars.
     * @param {string} staff Object what be padding on the right.
     * @param {number} nr_fill Padding size.
     * @param {string} add_char Char what be added.
     */
    function rpad(staff, nr_fill, add_char) {
        var i, string = staff.toString();

        for (i = string.length; i < nr_fill; ++i) {
            string += add_char;
        }
        return string;
    }

    /**
     * @module pklib.string
     * @type {{is_string: Function, is_letter: Function, trim: Function, slug: Function, capitalize: Function, delimiter_separated_words: Function, strip_tags: Function, camel_case: Function, slice: Function, format: Function, lpad: Function, rpad: Function}}
     */
    pklib.string = {
        is_string: is_string,
        is_letter: is_letter,
        trim: trim,
        slug: slug,
        capitalize: capitalize,
        delimiter_separated_words: delimiter_separated_words,
        strip_tags: strip_tags,
        camel_case: camel_case,
        slice: slice,
        format: format,
        lpad: lpad,
        rpad: rpad
    };

}(this));

/**
 * @requires pklib.string
 * @requires pklib.dom
 */
(function (global) {
    "use strict";

    // imports
    var document = global.document;
    var pklib = (global.pklib = global.pklib || {});

    /**
     * @param {HTMLElement} element
     * @param {HTMLElement} wrapper
     * @return {Array}
     * @throws {TypeError} If first param is not HTMLElement.
     */
    function center(element, wrapper) {
        var left = null,
            top = null,
            pus = pklib.ui.size;

        pklib.common.assert(pklib.dom.is_element(element), "pklib.ui.center: @element: not {HTMLElement}");

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
    }

    /**
     * @param {HTMLElement} element
     * @param {HTMLElement} wrapper
     * @return {Array}
     */
    function maximize(element, wrapper) {
        var width = null,
            height = null,
            pus = pklib.ui.size;

        if (wrapper === document.body) {
            width = Math.max(pus.window("width"), pus.document("width"));
            height = Math.max(pus.window("height"), pus.document("height"));
            if (pklib.browser.get_name() === "msie") {
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

    /**
     * @param {number} param
     * @param {boolean} animate
     */
    function scroll_to(param, animate) {
        var interval = null;
        if (animate) {
            interval = setInterval(function () {
                document.body.scroll_top -= 5;
                if (document.body.scroll_top <= 0) {
                    clearInterval(interval);
                }
            }, 1);
        } else {
            document.body.scroll_top = param + "px";
        }
    }

    /**
     * @module pklib.ui
     * @type {{center: Function, maximize: Function, scroll_to: Function}}
     */
    pklib.ui = {
        center: center,
        maximize: maximize,
        scroll_to: scroll_to
    };

}(this));
/**
 * @requires pklib.browser
 * @requires pklib.dom
 * @requires pklib.event
 * @requires pklib.utils
 */
(function (global) {
    "use strict";

    // imports
    var document = global.document;
    var pklib = (global.pklib = global.pklib || {});

    var id = "pklib-glass-wrapper",
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

    /**
     * @param {Object} config
     * @param {Function} callback
     * @return {HTMLElement}
     */
    function show_glass(config, callback) {
        var glass = document.createElement("div"),
            glassStyle = glass.style,
            style;

        settings.container = document.body;
        settings = pklib.object.mixin(settings, config);
        settings.style.filter = "alpha(opacity=" + parseFloat(settings.style.opacity) * 100 + ")";

        glass.setAttribute("id", pklib.ui.glass.obj_id);

        for (style in settings.style) {
            if (settings.style.hasOwnProperty(style)) {
                glassStyle[style] = settings.style[style];
            }
        }

        settings.container.appendChild(glass);

        pklib.ui.maximize(glass, settings.container);

        pklib.event.add(global, "resize", function () {
            pklib.ui.glass.close();
            pklib.ui.glass.show(config, callback);
            pklib.ui.maximize(glass, settings.container);
        });

        if (typeof callback === "function") {
            callback();
        }
        return glass;
    }

    /**
     * @param {Function} callback
     * @return {boolean}
     */
    function close_glass(callback) {
        var glass = pklib.dom.by_id(pklib.ui.glass.obj_id),
            result = false;

        pklib.event.remove(global, "resize");

        if (glass !== null) {
            glass.parentNode.removeChild(glass);
            close_glass(callback);
            result = true;
        }

        if (typeof callback === "function") {
            callback();
        }
        return result;
    }

    /**
     * @module pklib.ui.glass
     * @type {{obj_id: string, show: Function, close: Function}}
     */
    pklib.ui.glass = {
        obj_id: id,
        show: show_glass,
        close: close_glass
    };

}(this));

/**
 * @requires pklib.dom
 * @requires pklib.event
 * @requires pklib.utils
 */
(function (global) {
    "use strict";

    // imports
    var document = global.document;
    var pklib = (global.pklib = global.pklib || {});

    var id = "pklib-loader-wrapper",
        settings = {
            src: "",
            container: null,
            style: {
                width: 31,
                height: 31,
                zIndex: 1010
            },
            center: true
        };

    /**
     * @param {object} config
     * @param {function} callback
     */
    function show_loader(config, callback) {
        var loader = document.createElement("img"),
            loaderStyle = loader.style,
            style;

        settings.container = document.body;
        settings = pklib.object.mixin(settings, config);

        loader.setAttribute("id", pklib.ui.loader.obj_id);
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
        // clear memory
        loader = null;
    }

    /**
     * @param {Function} callback
     * @return {boolean}
     */
    function close_loader(callback) {
        var loader = pklib.dom.by_id(pklib.ui.loader.obj_id),
            result = false;

        if (loader !== null) {
            loader.parentNode.removeChild(loader);
            close_loader(callback);
            result = true;
        }

        if (typeof callback === "function") {
            callback();
        }
        return result;
    }

    /**
     * @module pklib.ui.loader
     * @type {{obj_id: string, show: Function, close: Function}}
     */
    pklib.ui.loader = {
        obj_id: id,
        show: show_loader,
        close: close_loader
    };

}(this));
/**
 * @requires pklib.dom
 * @requires pklib.event
 * @requires pklib.string
 * @requires pklib.utils
 */
(function (global) {
    "use strict";

    // imports
    var document = global.document;
    var pklib = (global.pklib = global.pklib || {});

    // private
    var id = "pklib-message-wrapper",
        settings = {
            container: null,
            style: {
                width: 300,
                height: 300,
                zIndex: 1010
            }
        };

    /**
     * @param {Object} config
     * @param {Function} callback
     * @return {HTMLElement}
     */
    function show_message(config, callback) {
        var message = document.createElement("div"),
            messageStyle = message.style,
            style;

        settings.container = document.body;
        settings = pklib.object.mixin(settings, config);

        message.setAttribute("id", pklib.ui.message.obj_id);

        for (style in settings.style) {
            if (settings.style.hasOwnProperty(style)) {
                messageStyle[style] = settings.style[style];
            }
        }

        pklib.dom.insert(pklib.ui.message.content, message);

        settings.container.appendChild(message);
        pklib.ui.center(message, settings.container);

        pklib.event.add(global, "resize", function () {
            pklib.ui.center(message, settings.container);
        });

        if (typeof callback === "function") {
            callback();
        }
        return message;
    }

    /**
     * @param {Function} callback
     * @return {boolean}
     */
    function close_message(callback) {
        var message = pklib.dom.by_id(pklib.ui.message.obj_id),
            result = false;

        if (message !== null) {
            message.parentNode.removeChild(message);
            close_message(callback);
            result = true;
        }

        if (typeof callback === "function") {
            callback();
        }
        return result;
    }

    /**
     * @module pklib.ui.message
     * @type {{obj_id: string, content: null, show: Function, close: Function}}
     */
    pklib.ui.message = {
        obj_id: id,
        content: null,
        show: show_message,
        close: close_message
    };

}(this));

/**
 * @requires pklib.string
 */
(function (global) {
    "use strict";

    // imports
    var document = global.document;
    var pklib = (global.pklib = global.pklib || {});

    /**
     * @param {string} name
     * @return {number}
     * @throws {TypeError} Name is not *string* value.
     */
    function size_of_window(name) {
        var clientName;
        pklib.common.assert(typeof name === "string", "pklib.ui.size.window: @name: not {string}");

        name = pklib.string.capitalize(name);
        clientName = document.documentElement["client" + name];
        return (document.compatMode === "CSS1Compat" && clientName) ||
            document.body["client" + name] ||
            clientName;
    }

    /**
     * @param {string} name
     * @return {number}
     */
    function size_of_document(name) {
        var clientName,
            scrollBodyName,
            scrollName,
            offsetBodyName,
            offsetName;

        pklib.common.assert(typeof name === "string", "pklib.ui.size.document: @name: not {string}");

        name = pklib.string.capitalize(name);
        clientName = document.documentElement["client" + name];
        scrollBodyName = document.body["scroll" + name];
        scrollName = document.documentElement["scroll" + name];
        offsetBodyName = document.body["offset" + name];
        offsetName = document.documentElement["offset" + name];
        return Math.max(clientName, scrollBodyName, scrollName, offsetBodyName, offsetName);
    }

    /**
     * @param {HTMLElement} obj
     * @param {string} name
     * @return {number}
     */
    function size_of_object(obj, name) {
        pklib.common.assert(typeof name === "string", "pklib.ui.size.object: @name: not {string}");
        pklib.common.assert(pklib.dom.is_element(obj), "pklib.ui.size.object: @obj: not {HTMLElement}");

        name = pklib.string.capitalize(name);
        var client = obj["client" + name],
            scroll = obj["scroll" + name],
            offset = obj["offset" + name];
        return Math.max(client, scroll, offset);
    }

    /**
     * @module pklib.ui.size
     * @type {{window: Function, document: Function, object: Function}}
     */
    pklib.ui.size = {
        window: size_of_window,
        document: size_of_document,
        object: size_of_object
    };

}(this));

(function (global) {
    "use strict";

    // imports
    var pklib = (global.pklib = global.pklib || {});

    /**
     * Get all params, and return in JSON object.
     * @param {?string} [url]
     * @return {Object}
     */
    function get_params(url) {
        var i,
            item,
            len,
            key_value_section,
            params,
            params_list = {};

        if (typeof url === "string") {
            params = url.match(/\?(.*)/)[0] || "";
        } else {
            params = global.location.search;
        }

        if (params.substr(0, 1) === "?") {
            params = params.substr(1);
        }

        params = params.split("&");
        len = params.length;

        for (i = 0; i < len; ++i) {
            key_value_section = params[i];
            if (key_value_section.length > 0) {
                item = key_value_section.split("=");
                params_list[item[0]] = item[1];
            }
        }
        return params_list;
    }

    /**
     * Get concrete param from URL.
     * If param if not defined return null.
     * @param {string} key
     * @param {?string} url
     * @return {string}
     */
    function get_param(key, url) {
        var params,
            i,
            item,
            len;

        if (typeof url === "string") {
            params = url.match(/\?(.*)/)[0] || "";
        } else {
            params = global.location.search;
        }

        if (params.substr(0, 1) === "?") {
            params = params.substr(1);
        }

        params = params.split("&");
        len = params.length;

        for (i = 0; i < len; ++i) {
            item = params[i].split("=");
            if (item[0] === key) {
                return item[1];
            }
        }
        return null;
    }

    /**
     * @module pklib.url
     * @type {{get_params: Function, get_param: Function}}
     */
    pklib.url = {
        get_params: get_params,
        get_param: get_param
    };

}(this));

/**
 * @requires pklib.common
 * @requires pklib.dom
 * @requires pklib.event
 */
(function (global) {
    "use strict";

    // imports
    var document = global.document;
    var pklib = (global.pklib = global.pklib || {});
    var add_event = pklib.event.add;

    /**
     * @param {Event} evt
     */
    function open_trigger(evt) {
        var url = "";

        if (evt.originalTarget &&
                typeof evt.originalTarget === "object" &&
                evt.originalTarget.href !== undefined) {
            url = evt.originalTarget.href;
        } else if (evt.toElement &&
                typeof evt.toElement === "object" &&
                evt.toElement.href !== undefined) {
            url = evt.toElement.href;
        } else if (evt.srcElement &&
                typeof evt.srcElement === "object" &&
                evt.srcElement !== undefined) {
            url = evt.srcElement.href;
        }

        global.open(url);

        try {
            evt.preventDefault();
        } catch (ignore) {
            global.event.returnValue = false;
        }
        return false;
    }

    /**
     * @param {HTMLElement} obj
     */
    function clear_focus(obj) {
        if (pklib.dom.is_element(obj)) {
            add_event(obj, "focus", function () {
                if (obj.value === obj.defaultValue) {
                    obj.value = "";
                }
            });
            add_event(obj, "blur", function () {
                if (obj.value === "") {
                    obj.value = obj.defaultValue;
                }
            });
        }
    }

    /**
     * @param {HTMLElement} [area]
     */
    function outerlink(area) {
        var i, len,
            link, links;

        area = area || document;

        links = pklib.dom.by_tag("a", area);
        len = links.length;

        for (i = 0; i < len; ++i) {
            link = links[i];
            if (link.rel === "outerlink") {
                add_event(link, "click", open_trigger.bind(link));
            }
        }
    }

    /**
     * @param {HTMLElement} element
     * @param {string} [text]
     */
    function confirm(element, text) {
        var response;
        if (element !== undefined) {
            text = text || "Sure?";

            add_event(element, "click", function (evt) {
                response = global.confirm(text);
                if (!response) {
                    try {
                        evt.preventDefault();
                    } catch (ignore) {
                        global.event.returnValue = false;
                    }

                    return false;
                }
                return true;
            });
        }
    }

    /**
     * @module pklib.utils
     * @type {{ascii: {letters: {lower: Array, upper: Array}}, action: {clearfocus: Function, outerlink: Function, confirm: Function}}}
     */
    pklib.utils = {
        /**
         * numbers of chars in ASCII system
         */
        ascii: {
            letters: {
                lower: [113, 119, 101, 114, 116, 121, 117, 105, 111, 112, 97,
                    115, 100, 102, 103, 104, 106, 107, 108, 122, 120, 99, 118,
                    98, 110, 109],
                upper: [81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 65, 83, 68,
                    70, 71, 72, 74, 75, 76, 90, 88, 67, 86, 66, 78, 77]
            }
        },

        action: {
            clearfocus: clear_focus,
            outerlink: outerlink,
            confirm: confirm
        }
    };

}(this));
