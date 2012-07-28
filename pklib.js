/**
 * pklib JavaScript library v1.1.0
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
 * Date: Wed Jul 18 00:41:11 CEDT 2012
 */

/*jslint plusplus: true, regexp: true */
/*global setInterval, clearInterval, setTimeout */

(function (global) {
    "use strict";

    /********************************************************************************/
    /* THIS CONTRUCTION IS FOR BETTER VIEW IN DOCUMENTATION*/
    /********************************************************************************/

    /**
     * Global object, contain modules
     * @namespace
     * @type {Object}
     */
    var pklib = {
        author: "Piotr Kowalski",
        www: "http://pklib.com/",
        version: "1.1.0"
    };

    global.pklib = pklib;

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
 * @package pklib.ajax
 * @dependence pklib.array, pklib.common
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {},
        /**
         * Default time what is timeout to use function pklib.ajax
         * @private
         * @constant
         * @type {Number}
         */
        DEFAULT_TIMEOUT_TIME = 30000,

        /**
         * @private
         * @constant
         * @type {Number}
         */
        REQUEST_STATE_UNSENT = 0,

        // REQUEST_STATE_OPENED = 1,
        // REQUEST_STATE_HEADERS_RECEIVED = 2,
        // REQUEST_STATE_LOADING = 3,
        /**
         * @private
         * @constant
         * @type {Number}
         */
        REQUEST_STATE_DONE = 4,

        /**
         * Array contain key as url, value as ajax response
         * @private
         * @type {Array}
         */
        cache = [],

        /********************************************************************************/
        // private handlers & util functions
        /********************************************************************************/

        /**
         * When success request
         * @private
         * @function
         * @param {Object} settings
         * @param {XMLHttpRequest} xhr
         */
        success_handler = function (settings, xhr) {
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
        },

        /**
         * When error request
         * @private
         * @function
         * @param {Object} settings
         * @param {XMLHttpRequest} xhr
         */
        error_handler = function (settings, xhr) {
            xhr.error = true;
            settings.error.call(null, settings, xhr);
        },

        /**
         * Use when state in request is changed or if used cache is handler to request.
         * @private
         * @function
         * @param {Object} settings
         * @param {XMLHttpRequest} xhr
         */
        handler = function (settings, xhr) {
            var status = 0;

            if (xhr.readyState === REQUEST_STATE_DONE) {
                if (typeof xhr.status !== "undefined") {
                    status = xhr.status;
                }

                if ((status >= 200 && status < 300) || status === 304) {
                    // success
                    success_handler(settings, xhr);
                } else {
                    // error
                    error_handler(settings, xhr);
                }
            }
        },

        /**
         * Handler to unusually situation - timeout.
         * @private
         * @function
         * @param {Object} settings
         * @param {XMLHttpRequest} xhr
         * @throws {Error} If exists timeout on request
         */
        timeout_handler = function (settings, xhr) {
            // clear memory
            xhr = null;
            // throw exception
            throw new Error("pklib.ajax.load: timeout on url: " + settings.url);
        },

        /**
         * Method use when request has timeout
         * @private
         * @function
         * @param {Object} settings
         * @param {XMLHttpRequest} xhr
         * @throws {Error} If exists timeout on request
         */
        request_timeout = function (settings, xhr) {
            if (typeof xhr.aborted === "undefined" &&
                    typeof xhr.error === "undefined" &&
                    xhr.readyState === REQUEST_STATE_DONE &&
                    xhr.status === REQUEST_STATE_UNSENT) {
                xhr.abort();
                timeout_handler.call(null, settings, xhr);
            }
        },

        /**
         * Try to create Internet Explorer XMLHttpRequest
         * @private
         * @function
         * @throws {Error} If can not create XMLHttpRequest object
         * @returns {ActiveXObject|Undefined}
         */
        create_microsoft_xhr = function () {
            var xhr;
            try {
                xhr = new global.ActiveXObject("Msxml2.XMLHTTP");
            } catch (ignore) {
                try {
                    xhr = new global.ActiveXObject("Microsoft.XMLHTTP");
                } catch (ignored) {
                    throw new Error("pklib.ajax.load: can't create XMLHttpRequest object");
                }
            }
            return xhr;
        },

        /**
         * Try to create XMLHttpRequest
         * @private
         * @function
         * @throws {Error} If can not create XMLHttpRequest object
         * @returns {XMLHttpRequest|Undefined}
         */
        create_xhr = function () {
            var xhr;
            try {
                xhr = new global.XMLHttpRequest();
            } catch (ignore) {
                xhr = create_microsoft_xhr();
            }
            return xhr;
        },

        /**
         * Add headers to xhr object
         * @private
         * @function
         * @param {Object} settings
         * @param {XMLHttpRequest} xhr
         */
        add_headers_to_xhr = function (settings, xhr) {
            var header,
                headers = settings.headers;

            if (headers !== null) {
                for (header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header, headers[header]);
                    }
                }
            }
        },

        /**
         * Add timeout service to xhr object
         * @private
         * @function
         * @param {Object} settings
         * @param {XMLHttpRequest} xhr
         */
        add_timeout_service_to_xhr = function (settings, xhr) {
            if (typeof xhr.ontimeout === "function") {
                xhr.ontimeout = timeout_handler.bind(null, settings, xhr);
            } else {
                pklib.common.defer(request_timeout.bind(null, settings, xhr), settings.timeout);
            }
        },

        /**
         * Add error service to xhr object
         * @private
         * @function
         * @param {Object} settings
         * @param {XMLHttpRequest} xhr
         */
        add_error_service_to_xhr = function (settings, xhr) {
            xhr.onerror = function () {
                error_handler(settings, xhr);
            };
        },

        /**
         * Check is response on this request is in cache
         * @private
         * @function
         * @param {Object} settings
         * @returns {Boolean}
         */
        is_response_in_cache = function (settings) {
            return settings.cache && cache[settings.url];
        },

        /**
         * Return object what is default configuration of request
         * @private
         * @function
         * @returns {Object} Default configuration
         */
        set_default_settings = function () {
            /**
             * Request settings, contain ex. headers, callback when run after request finish.
             * Default timeout on request is 30 seconds. This is default timeout from popular web servers
             * ex. Apache, ngninx.
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
        },

        /**
         * Check url in request is defined.
         * Throw error if is undefined
         * @private
         * @function
         * @param {Object} settings
         * @throws {Error} If unset request url
         */
        check_if_url_is_defined = function (settings) {
            pklib.common.assert(settings.url !== null, "pklib.ajax.load: undefined request url");
        };

    /**
     * Service to send request to server.
     * With first param, which is hashmap, define params, ex. request url
     * @namespace
     */
    pklib.ajax = {
        /**
         * Send request to server on url defined in config.url.
         * Method throw exception when request have timeout on server or if url is not set.
         * Also, every response (if config.cache is true) saved to hashmap by key config.url.
         * Method on first try to can create XMLHttpRequest if browser doesn't support, check
         * if browser support object ActiveXObject which is implemented in Internet Explorer.
         * @memberOf pklib.ajax
         * @function
         * @param {Object} config
         * <pre>
         * {
         *      {String} [type="get"]
         *      {Boolean} [async=true]
         *      {Boolean} [cache=false]
         *      {String} url
         *      {Object} [params]
         *      {Object} [headers]
         *      {Function} [done]
         *      {Function} [error]
         * }
         * </pre>
         * @example
         * <pre>
         * pklib.ajax.load({
         *      type: "post",
         *      async: false,
         *      cache:  true,
         *      url: "http://example.org/check-item.php",
         *      params: {
         *          id: 33
         *      },
         *      headers: {
         *          "User-Agent": "tv"
         *      },
         *      done: function (res) {
         *          // pass
         *      }
         * });
         * </pre>
         * @throws {Error} If unset request url
         * @returns {XMLHttpRequest|Null}
         */
        load: function (config) {
            var xhr = null,
                settings = set_default_settings();

            settings = pklib.object.mixin(settings, config);
            settings.type = settings.type.toUpperCase();

            check_if_url_is_defined(settings);

            if (is_response_in_cache(settings)) {
                handler.call(null, settings, cache[settings.url]);
            } else {
                xhr = create_xhr();
                xhr.onreadystatechange = handler.bind(null, settings, xhr);
                xhr.open(settings.type, settings.url, settings.async);

                add_headers_to_xhr(settings, xhr);

                add_timeout_service_to_xhr(settings, xhr);
                add_error_service_to_xhr(settings, xhr);
                xhr.send(settings.params);
            }
            return xhr;
        },

        /**
         * Stop request setting in param
         * @memberOf pklib.ajax
         * @function
         * @param {XMLHttpRequest|ActiveXObject} xhr XMLHttpRequest object, or ActiveXObject object if Internet Explorer
         */
        stop: function (xhr) {
            xhr.abort();
            xhr.aborted = true;
            // clear memory
            xhr = null;
        }
    };

}(this));
/**
 * @package pklib.array
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {};

    /**
     * Module to service array object
     * @namespace
     */
    pklib.array =  {
        /**
         * Check if param is array
         * @memberOf pklib.array
         * @function
         * @param {Object} array
         * @returns {Boolean}
         */
        is_array: function (array) {
            try {
                pklib.common.assert(typeof array === "object" &&
                    array !== null &&
                    typeof array.length !== "undefined" &&
                    typeof array.slice !== "undefined");
                return true;
            } catch (ignore) {
                return false;
            }
        },

        /**
         * Check if element is in array by loop
         * @memberOf pklib.array
         * @function
         * @param {Object} param
         * @param {Array} array
         * @returns {Boolean}
         */
        in_array: function (param, array) {
            var i, len = array.length;
            for (i = 0; i < len; ++i) {
                if (array[i] === param) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Get index of element.
         * If couldn't find searching element, return null value
         * @memberOf pklib.array
         * @function
         * @param {Object} item
         * @param {Array} array
         * @returns {Number|Null}
         */
        index: function (item, array) {
            var i, len = array.length;
            for (i = 0; i < len; ++i) {
                if (array[i] === item) {
                    return i;
                }
            }
            return null;
        },

        /**
         * Unique array. Delete element what was duplicated
         * @memberOf pklib.array
         * @function
         * @param {Array} array
         * @returns {Array}
         */
        unique: function (array) {
            var i, item, temp = [],
                len = array.length;

            for (i = 0; i < len; ++i) {
                item = array[i];
                if (!pklib.array.in_array.call(null, item, temp)) {
                    temp.push(item);
                }
            }
            return temp;
        },

        /**
         * Remove element declared in infinity params without first.
         * First parameter is array object
         * @memberOf pklib.array
         * @function
         * @param {Array} array
         * @returns {Array}
         */
        remove: function (array) {
            var i, param,
                params = Array.prototype.slice.call(arguments, 1),
                len = params.length;

            for (i = 0; i < len; ++i) {
                param = params[i];
                if (pklib.array.in_array(param, array)) {
                    array.splice(pklib.array.index(param, array), 1);
                }
            }
            return array;
        }
    };

}(this));
/**
 * @package pklib.aspect
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {};

    /**
     * Bind function to aspect.
     * Create method with merge first and second.
     * Second method is run after first
     * @function
     * @param {Function} fun The function to bind aspect function
     * @param {Function} asp The aspect function
     * @param {String} [when="before"] Place to aspect function
     * @throws {TypeError} If any param is not function
     * @returns {Function}
     */
    pklib.aspect = function (fun, asp, when) {
        var that = this,
            result;

        pklib.common.assert(typeof fun === "function", "pklib.aspect: @func: not {Function}");
        pklib.common.assert(typeof asp === "function", "pklib.aspect: @asp: not {Function}");

        when = when || "before";

        return function () {
            if (when === "before") {
                asp.call(that);
            }

            result = fun.apply(that, arguments);

            if (when === "after") {
                result = asp.call(that);
            }
            return result;
        };
    };

}(this));
/**
 * @package pklib.browser
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {},
        /**
         * Array with browsers name
         * @private
         * @type {Array}
         */
        browsers = ["msie", "chrome", "safari", "opera", "mozilla", "konqueror"];

    /**
     * Get best information about browser
     * @namespace
     */
    pklib.browser = {
        /**
         * Get browser name by checking userAgent in global object navigator
         * @memberOf pklib.browser
         * @function
         * @returns {String}
         */
        get_name: function () {
            var i, browser,
                len = browsers.length,
                userAgent = global.navigator.userAgent.toLowerCase();

            for (i = 0; i < len; ++i) {
                browser = browsers[i];
                if (new RegExp(browser).test(userAgent)) {
                    return browser;
                }
            }
            return "undefined";
        },

        /**
         * Get browser version by checking userAgent.
         * Parse userAgent to find next 3 characters
         * @memberOf pklib.browser
         * @function
         * @returns {String|Null}
         */
        get_version: function () {
            var i, len = browsers.length, browser, cur,
                user_agent = global.navigator.userAgent.toLowerCase();

            for (i = 0; i < len; ++i) {
                browser = browsers[i];
                cur = user_agent.indexOf(browser);
                if (cur !== -1) {
                    return user_agent.substr(cur + len + 1, 3);
                }
            }
            return null;
        }
    };

}(this));
/**
 * @package pklib.common
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {};

    /**
     * Common stuff
     * @namespace
     */
    pklib.common = {
        /**
         * Basic test function. Simple assertion 2 variables
         * @memberOf pklib.common
         * @function
         * @param {Object} expression Object what is true
         * @param {String} comment Message to throw in error
         * @throws {Error}
         */
        assert: function (expression, comment) {
            if (expression !== true) {
                throw new Error(comment);
            }
        },

        /**
         * Deferred function about some milliseconds.
         * If milliseconds is 0 that it's hack for some platforms to use function in "next" thread
         * @memberOf pklib.common
         * @function
         * @param {Function} defer_function Function what would be deferred
         * @param {Number} milliseconds Time to deferred function
         */
        defer: function (defer_function, milliseconds) {
            milliseconds = milliseconds || 0;
            setTimeout(defer_function, milliseconds);
        },

        /**
         * Interval checking first function until returns true,
         * run after this second function callback
         * @memberOf pklib.common
         * @param {Function} condition Function returns {Boolean} status
         * @param {Function} callback
         */
        checking: function (condition, callback) {
            var interval,
                interval_time = 100;

            pklib.common.assert(typeof condition === "function", "pklib.common.checking: @condition: not {Function}");
            pklib.common.assert(typeof callback === "function", "pklib.common.checking: @callback: not {Function}");

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
    };

}(this));
/**
 * @package pklib.cookie
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {},
        document = global.document || {};

    /**
     * Cookie service manager
     * @namespace
     */
    pklib.cookie = {
        /**
         * Create cookie file with name, value and day expired
         * @memberOf pklib.cookie
         * @function
         * @param {String} name
         * @param {String} value
         * @param {Number} days
         * @returns {String}
         */
        create: function (name, value, days) {
            var expires = "",
                date = new Date();

            value = value || null;

            if (typeof days !== "undefined") {
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toGMTString();
            }

            document.cookie = name + "=" + value + expires + "; path=/";

            return pklib.cookie.get(name);
        },

        /**
         * Read cookie by it name
         * @memberOf pklib.cookie
         * @function
         * @param {String} name
         * @returns {String|Null}
         */
        get: function (name) {
            if (typeof name === "undefined") {
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
                    return c.substring(name.length, c.length);
                }
            }
            return null;
        },

        /**
         * Delete cookie by it name
         * @memberOf pklib.cookie
         * @function
         * @param {String} name
         * @returns {String}
         */
        remove: function (name) {
            return pklib.cookie.create(name, undefined, -1);
        }
    };

}(this));
/**
 * @package pklib.css
 * @dependence pklib.string. pklib.dom
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {},
        /**
         * RegExp use to delete white chars
         * @private
         * @type {RegExp}
         */
        rclass = /[\n\t\r]/g,

        /**
         * Check typeof params
         * @private
         * @function
         * @param {String} css_class
         * @param {HTMLElement} element
         * @throws {TypeError} If first param is not string, or second param is not Node
         */
        check_params = function (css_class, element, call_func_name) {
            var prefix = "pklib.css." + call_func_name;
            pklib.common.assert(typeof css_class === "string", prefix + ": @css_class: not {String}");
            pklib.common.assert(pklib.dom.is_element(element), prefix + ": @element: not {HTMLElement}");
        };

    /**
     * Utils method related css on tags in DOM tree
     * @namespace
     */
    pklib.css = {
        /**
         * Add CSS class to element define in second parameter
         * @memberOf pklib.css
         * @function
         * @param {String} css_class
         * @param {HTMLElement} element
         * @throws {TypeError} If first param is not string, or second param is not Node
         */
        add_class: function (css_class, element) {
            check_params(css_class, element, "add_class");
            var class_element = element.className;
            if (!pklib.css.has_class(css_class, element)) {
                if (class_element.length) {
                    class_element += " " + css_class;
                } else {
                    class_element = css_class;
                }
            }
            element.className = class_element;
        },

        /**
         * Remove CSS class from element define in second parameter
         * @memberOf pklib.css
         * @function
         * @param {String} css_class
         * @param {HTMLElement} element
         * @throws {TypeError} If first param is not string, or second param is not Node
         */
        remove_class: function (css_class, element) {
            check_params(css_class, element, "remove_class");
            var regexp = new RegExp("(\\s" + css_class + ")|(" + css_class + "\\s)|" + css_class, "i");
            element.className = pklib.string.trim(element.className.replace(regexp, ""));
        },

        /**
         * Check if element has CSS class
         * @memberOf pklib.css
         * @function
         * @param {String} css_class
         * @param {HTMLElement} element
         * @throws {TypeError} If first param is not string, or second param is not Node
         * @returns {Boolean}
         */
        has_class: function (css_class, element) {
            check_params(css_class, element, "has_class");
            var className = " " + css_class + " ";
            return ((" " + element.className + " ").replace(rclass, " ").indexOf(className) > -1);
        }
    };

}(this));
/**
 * @package pklib.date
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {};

    /**
     * Utils stack to Date object
     * @namespace
     */
    pklib.date = {
        /**
         * Simple return month in string and file 0 at first place if month smaller than 10
         * @memberOf pklib.date
         * @function
         * @returns {String}
         */
        get_full_month: function () {
            var month = (parseInt(new Date().getMonth(), 10) + 1);

            if (month < 10) {
                month = "0" + month;
            }

            return String(month);
        }
    };

}(this));
/**
 * @package pklib.dom
 * @dependence pklib.browser, pklib.css, pklib.string, pklib.utils
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {},
        document = global.document || {},

        /**
         * Walking on every element in node
         * @private
         * @function
         * @param {HTMLElement} node
         * @param {Function} func Run on every node
         */
        walk_the_dom = function (node, func) {
            if (!!node) {
                func(node);
                node = node.firstChild;
                while (node) {
                    walk_the_dom(node, func);
                    node = node.nextSibling;
                }
            }
        };

    /**
     * Helper related with DOM service
     * @namespace
     */
    pklib.dom = {
        /**
         * Types of all available node
         */
        node_types: {
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
         * @memberOf pklib.dom
         * @function
         * @param {Node} node
         * @returns {String}
         */
        is_node: function (node) {
            try {
                pklib.common.assert(Boolean(node && node.nodeType && node.nodeName));
                pklib.common.assert(Object.prototype.toString.call(node) === "[object Node]");
                return true;
            } catch (ignore) {
                return false;
            }
        },

        /**
         * @memberOf pklib.dom
         * @function
         * @param {NodeList} node_list
         * @returns {String}
         */
        is_node_list: function (node_list) {
            try {
                pklib.common.assert(Object.prototype.toString.call(node_list) === "[object NodeList]");
                return true;
            } catch (ignore) {
                return false;
            }
        },

        /**
         * @memberOf pklib.dom
         * @function
         * @param {HTMLElement} node
         * @returns {String}
         */
        is_element: function (node) {
            return (node && node.nodeType === pklib.dom.node_types.ELEMENT_NODE) || false;
        },

        /**
         * @memberOf pklib.dom
         * @function
         * @param {HTMLElement} node
         * @returns {Boolean}
         */
        is_visible: function (node) {
            pklib.common.assert(pklib.dom.is_element(node), "pklib.dom.is_visible: @node is not HTMLElement");

            return node.style.display !== "none" &&
                node.style.visibility !== "hidden" &&
                node.offsetWidth !== 0 &&
                node.offsetHeight !== 0;
        },

        /**
         * @memberOf pklib.dom
         * @function
         * @param {String} id
         * @returns {HTMLElement|Null}
         */
        by_id: function (id) {
            return document.getElementById(id);
        },

        /**
         * @memberOf pklib.dom
         * @function
         * @param {String} tag
         * @param {Element} element
         * @returns {NodeList}
         */
        by_tag: function (tag, element) {
            element = element || document;
            return element.getElementsByTagName(tag);
        },

        /**
         * @memberOf pklib.dom
         * @function
         * @param {String} css_class
         * @param {HTMLElement} wrapper
         * @returns {NodeList|Array}
         */
        by_class: function (css_class, wrapper) {
            var results;

            wrapper = wrapper || document;

            if (wrapper.getElementsByClassName) {
                results = wrapper.getElementsByClassName(css_class);
            } else {
                results = [];
                walk_the_dom(wrapper, function (node) {
                    if (pklib.dom.is_element(node) && pklib.css.has_class(css_class, node)) {
                        results.push(node);
                    }
                });
            }
            return results;
        },

        /**
         * @memberOf pklib.dom
         * @function
         * @param {HTMLElement} node
         * @returns {Number|Null}
         */
        index: function (node) {
            var i,
                parent = pklib.dom.parent(node),
                childs = pklib.dom.children(parent),
                len = childs.length;

            for (i = 0; i < len; ++i) {
                if (childs[i] === node) {
                    return i;
                }
            }
            return null;
        },

        /**
         * @memberOf pklib.dom
         * @function
         * @param {HTMLElement} node
         * @returns {Array}
         */
        children: function (node) {
            var i,
                array = [],
                childs = node.childNodes,
                len = childs.length;

            for (i = 0; i < len; ++i) {
                if (pklib.dom.is_element(childs[i])) {
                    array.push(childs[i]);
                }
            }
            return array;
        },

        /**
         * @memberOf pklib.dom
         * @function
         * @param {HTMLElement|String} element
         * @param {HTMLElement} node
         * @returns {HTMLElement}
         */
        insert: function (element, node) {
            if (pklib.dom.is_element(element)) {
                node.appendChild(element);
            } else if (pklib.string.is_string(element)) {
                node.innerHTML += element;
            }
            return element;
        },

        /**
         * @memberOf pklib.dom
         * @function
         * @param {HTMLElement}
         */
        remove: function () {
            var i, node = null, parent = null,
                args = Array.prototype.slice.call(arguments),
                len = args.length;

            for (i = 0; i < len; ++i) {
                node = args[i];
                if (pklib.dom.is_element(node)) {
                    parent = node.parentNode;
                    parent.removeChild(node);
                }
            }
        },

        /**
         * @memberOf pklib.dom
         * @function
         * @param {HTMLElement} node
         * @returns {HTMLElement|Null}
         */
        prev: function (node) {
            var pNode;
            while (true) {
                pNode = node.previousSibling;
                if (typeof pNode !== "undefined" &&
                        pNode !== null &&
                        pNode.nodeType !== pklib.dom.node_types.ELEMENT_NODE) {
                    node = pNode;
                } else {
                    break;
                }
            }
            return pNode;
        },

        /**
         * @memberOf pklib.dom
         * @function
         * @param {HTMLElement} node
         * @returns {HTMLElement|Null}
         */
        next: function (node) {
            var nNode;
            while (true) {
                nNode = node.nextSibling;
                if (typeof nNode !== "undefined" &&
                        nNode !== null &&
                        nNode.nodeType !== pklib.dom.node_types.ELEMENT_NODE) {
                    node = nNode;
                } else {
                    break;
                }
            }
            return nNode;
        },

        /**
         * @memberOf pklib.dom
         * @function
         * @param {HTMLElement} node
         * @returns {HTMLElement|Null}
         */
        parent: function (node) {
            var prNode;
            while (true) {
                prNode = node.parentNode;
                if (typeof prNode !== "undefined" &&
                        prNode !== null &&
                        prNode.nodeType !== pklib.dom.node_types.ELEMENT_NODE) {
                    node = prNode;
                } else {
                    break;
                }
            }
            return prNode;
        }
    };

}(this));
/**
 * @package pklib.event
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {};

    /**
     * Helper about manage event on HTMLElement
     * @namespace
     */
    pklib.event = {
        /**
         * @memberOf pklib.event
         * @function
         * @param {HTMLElement} target
         * @param {String} event_name
         * @param {Function} handler
         */
        add: function (target, event_name, handler) {
            if (typeof target.events === "undefined") {
                target.events = {};
            }

            var event = target.events[event_name];

            if (typeof event === "undefined") {
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
        },

        /**
         * @memberOf pklib.event
         * @function
         * @param {HTMLElement} target
         * @param {String} event_name
         */
        remove: function (target, event_name) {
            var removeEvent, events, len, i, handler;

            if (typeof target.events === "undefined") {
                target.events = {};
            }

            if (target.detachEvent) {
                // IE browser
                removeEvent = "detachEvent";
            } else if (target.removeEventListener) {
                // other browser
                removeEvent = "removeEventListener";
            }

            if (typeof removeEvent === "undefined") {
                // for old browser
                delete target["on" + event_name];
            } else {
                events = target.events[event_name];

                if (typeof events !== "undefined") {
                    len = events.length;

                    for (i = 0; i < len; ++i) {
                        handler = events[i];
                        target[removeEvent](event_name, handler);
                        delete target.events[event_name];
                    }
                }
            }
        },

        /**
         * @memberOf pklib.event
         * @function
         * @param {HTMLElement} target
         * @param {String} event_name
         * @returns {Array|Undefined}
         */
        get: function (target, event_name) {
            if (typeof target.events === "undefined") {
                target.events = {};
            }
            return target.events[event_name];
        },

        /**
         * @memberOf pklib.event
         * @function
         * @param {HTMLElement} target
         * @param {String} event_name
         */
        trigger: function (target, event_name) {
            var events, len, i;

            if (typeof target.events === "undefined") {
                target.events = {};
            }

            events = target.events[event_name];

            if (typeof events !== "undefined") {
                len = events.length;

                for (i = 0; i < len; ++i) {
                    events[i].call(target, events[i]);
                }
            }
        }
    };

}(this));
/**
 * @package pklib.file, pklib.string
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {},
        document = global.document || {},

        /**
         * @private
         * @type {Array}
         */
        copy_files = [],

        /**
         * @private
         * @function
         * @param {String} url
         * @param {Function} callback
         */
        simple_load_js = function (url, callback) {
            /**
             * Create HTMLElement <script>
             */
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;

            if (typeof script.readyState === "undefined") {
                /**
                 * Method run when request has ended
                 * @memberOf script
                 * @function
                 */
                script.onload = function () {
                    if (typeof callback === "function") {
                        callback(script);
                    }
                };
            } else {
                /**
                 * Method run when request has change state
                 * @memberOf script
                 * @function
                 */
                script.onreadystatechange = function () {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        if (typeof callback === "function") {
                            callback(script);
                        }
                    }
                };
            }

            if (typeof document.head === "undefined") {
                document.head = document.getElementsByTagName("head")[0];
            }

            document.head.appendChild(script);
        };

    /**
     * JS file loader
     * @namespace
     */
    pklib.file = {
        /**
         * Lazy load JS files. Url to files could be with path absolute or not.
         * If you must load more than 1 file use array, to set url to files
         * @memberOf pklib.file
         * @function
         * @param {String|Array} files
         * @param {Function} callback
         */
        loadjs: function (files, callback) {
            var file,
                self = this;

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

                if (typeof file === "undefined") {
                    if (typeof callback === "function") {
                        callback({
                            src: copy_files[copy_files.length - 1]
                        });

                        copy_files = [];
                    }
                } else {
                    simple_load_js(file, function () {
                        self.loadjs(files, callback);
                    });
                }
            } else {
                throw new TypeError("pklib.file.loadjs: @files not {String} or {Array}");
            }
        }
    };

}(this));
/**
 * @package pklib.object
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {};

    /**
     * Module to service object
     * @namespace
     */
    pklib.object =  {
        /**
         * Check if is object
         * @memberOf pklib.object
         * @function
         * @param {Object} obj
         * @returns {Boolean}
         */
        is_object: function (obj) {
            return obj && typeof obj === "object" &&
                typeof obj.hasOwnProperty === "function" &&
                typeof obj.isPrototypeOf === "function" &&
                typeof obj.length === "undefined";
        },

        /**
         * @memberOf pklib.object
         * @function
         * @param {Array|Object} target
         * @param {Array|Object} source
         * @returns {Array}
         */
        mixin: function (target, source) {
            var i, len, element, item;

            if (pklib.array.is_array(target) && pklib.array.is_array(source)) {
                len = source.length;
                for (i = 0; i < len; ++i) {
                    element = source[i];
                    if (!pklib.array.in_array(element, target)) {
                        target.push(element);
                    }
                }
                target.sort();
            } else {
                for (item in source) {
                    if (source.hasOwnProperty(item)) {
                        if (pklib.object.is_object(target[item])) {
                            target[item] = pklib.object.mixin(target[item], source[item]);
                        } else {
                            target[item] = source[item];
                        }
                    }
                }
            }
            return target;
        }
    };

}(this));
/**
 * @package pklib.profiler
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {},
        data = {};

    /**
     * Time analyzer
     * @namespace
     */
    pklib.profiler = {
        /**
         * @memberOf pklib.profiler
         * @function
         * @param {String} name
         * @returns {Number}
         */
        start: function (name) {
            data[name] = new Date();
            return data[name];
        },

        /**
         * @memberOf pklib.profiler
         * @function
         * @param {String} name
         * @returns {Number}
         */
        stop: function (name) {
            data[name] = new Date() - data[name];
            return new Date((new Date()).getTime() + data[name]);
        },

        /**
         * @memberOf pklib.profiler
         * @function
         * @param {String} name
         * @returns {Number}
         */
        get_time: function (name) {
            return data[name];
        }
    };

}(this));
/**
 * @package pklib.string
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {},
        document = global.document || {};

    /**
     * String service manager
     * @namespace
     */
    pklib.string = {
        /**
         * @memberOf pklib.string
         * @function
         * @param {String} source
         * @returns {Boolean}
         */
        is_string: function (source) {
            return typeof source === "string";
        },

        /**
         * @memberOf pklib.string
         * @function
         * @param {String} source
         * @returns {Boolean}
         */
        is_letter: function (source) {
            return pklib.string.is_string(source) && /^[a-zA-Z]$/.test(source);
        },

        /**
         * @memberOf pklib.string
         * @function
         * @param {String} source
         * @returns {String}
         */
        trim: function (source) {
            return source.replace(/^\s+|\s+$/g, "");
        },

        /**
         * @memberOf pklib.string
         * @function
         * @param {String} source
         * @returns {String}
         */
        slug: function (source) {
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
        },

        /**
         * @memberOf pklib.string
         * @function
         * @param {String} source
         * @returns {String}
         */
        capitalize: function (source) {
            return source.substr(0, 1).toUpperCase() + source.substring(1, source.length).toLowerCase();
        },

        /**
         * @memberOf pklib.string
         * @function
         * @param {String} source
         * @returns {String}
         */
        delimiter_separated_words: function (source) {
            return source.replace(/[A-ZĘÓĄŚŁŻŹĆŃ]/g, function (match) {
                return "-" + match.toLowerCase();
            });
        },

        /**
         * @memberOf pklib.string
         * @function
         * @param {String} source
         * @returns {String}
         */
        strip_tags: function (source) {
            pklib.common.assert(typeof source === "string", "pklib.string.strip_tags: param @source is not a string");
            if (source && source.length !== 0) {
                var dummy = document.createElement("div");
                dummy.innerHTML = source;
                return dummy.textContent || dummy.innerText;
            }
            return source;
        },

        /**
         * @memberOf pklib.string
         * @function
         * @param {String} source
         * @returns {String}
         */
        camel_case: function (source) {
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
         * @memberOf pklib.string
         * @function
         * @param {String} source
         * @param {Number} length
         * @returns {String}
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
 * @package pklib.ui
 * @dependence pklib.string. pklib.dom
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {},
        document = global.document || {};

    /**
     * User Interface
     * @namespace
     */
    pklib.ui = {
        /**
         * @memberOf pklib.ui
         * @function
         * @param {HTMLElement} element
         * @param {HTMLElement} wrapper
         * @throws {TypeError} If first param is not HTMLElement
         * @returns {Array}
         */
        center: function (element, wrapper) {
            var left = null,
                top = null,
                pus = this.size;

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
        },

        /**
         * @memberOf pklib.ui
         * @function
         * @param {HTMLElement} element
         * @param {HTMLElement} wrapper
         * @returns {Array}
         */
        maximize: function (element, wrapper) {
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
        },

        /**
         * @memberOf pklib.ui
         * @function
         * @param {Number} param
         * @param {Boolean} animate
         */
        scroll_to: function (param, animate) {
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
    };

}(this));
/**
 * @package pklib.glass
 * @dependence pklib.browser, pklib.dom, pklib.event, pklib.utils
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
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

    /**
     * Show glass on dimensions on browser
     * @namespace
     */
    pklib.ui.glass = {
        /**
         * @memberOf pklib.ui.glass
         * @type {String}
         */
        obj_id: id,

        /**
         * @memberOf pklib.ui.glass
         * @function
         * @param {Object} config
         * @param {Function} callback
         * @returns {HTMLElement}
         */
        show: function (config, callback) {
            var that = this,
                glass = document.createElement("div"),
                glassStyle = glass.style,
                style;
            settings.container = document.body;
            settings = pklib.object.mixin(settings, config);
            settings.style.filter = "alpha(opacity=" + parseFloat(settings.style.opacity) * 100 + ")";

            glass.setAttribute("id", this.obj_id);
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
         * @memberOf pklib.ui.glass
         * @function
         * @param {Function} callback
         * @returns {Boolean}
         */
        close: function (callback) {
            var glass = pklib.dom.by_id(this.obj_id),
                result = false;

            pklib.event.remove(global, "resize");

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
 * @package pklib.ui.loader
 * @dependence pklib.dom, pklib.event, pklib.utils
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {},
        document = global.document || {},
        id = "pklib-loader-wrapper",
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
     * Loader adapter.
     * Show animate image (GIF) on special place.
     * @namespace
     */
    pklib.ui.loader = {
        /**
         * @memberOf pklib.ui.glass
         * @type {String}
         */
        obj_id: id,

        /**
         * @memberOf pklib.ui.loader
         * @function
         * @param {object} config
         * @param {function} callback
         */
        show: function (config, callback) {
            settings.container = document.body;
            settings = pklib.object.mixin(settings, config);

            var loader = document.createElement("img"),
                loaderStyle = loader.style,
                style;

            loader.setAttribute("id", this.obj_id);
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
        },

        /**
         * @memberOf pklib.ui.loader
         * @function
         * @param {Function} callback
         * @returns {Boolean}
         */
        close: function (callback) {
            var loader = pklib.dom.by_id(this.obj_id),
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
 * @package pklib.ui.message
 * @dependence pklib.dom, pklib.event, pklib.string, pklib.utils
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
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

    /**
     * Show layer on special place.
     * @namespace
     */
    pklib.ui.message = {
        /**
         * @memberOf pklib.ui.glass
         * @type {String}
         */
        obj_id: id,

        /**
         * @memberOf pklib.ui.glass
         * @type {HTMLElement}
         */
        content: null,

        /**
         * @memberOf pklib.ui.message
         * @function
         * @param {Object} config
         * @param {Function} callback
         * @returns {HTMLElement}
         */
        show: function (config, callback) {
            settings.container = document.body;
            settings = pklib.object.mixin(settings, config);

            var message = document.createElement("div"),
                messageStyle = message.style,
                style;

            message.setAttribute("id", this.obj_id);
            for (style in settings.style) {
                if (settings.style.hasOwnProperty(style)) {
                    messageStyle[style] = settings.style[style];
                }
            }

            pklib.dom.insert(this.content, message);

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
         * @memberOf pklib.ui.message
         * @function
         * @param {Function} callback
         * @returns {Boolean}
         */
        close: function (callback) {
            var message = pklib.dom.by_id(this.obj_id),
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
 * @package pklib.ui.size
 * @dependence pklib.string
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {},
        document = global.document || {};

    /**
     * Check ui dimensions
     * @namespace
     */
    pklib.ui.size = {
        /**
         * @memberOf pklib.ui.size
         * @function
         * @param {String} name
         * @throws {TypeError}
         * @returns {Number}
         */
        window: function (name) {
            var clientName;
            pklib.common.assert(typeof name === "string", "pklib.ui.size.window: @name: not {String}");

            name = pklib.string.capitalize(name);
            clientName = document.documentElement["client" + name];
            return (document.compatMode === "CSS1Compat" && clientName) ||
                document.body["client" + name] ||
                clientName;
        },

        /**
         * @memberOf pklib.ui.size
         * @function
         * @param {String} name
         * @returns {Number}
         */
        document: function (name) {
            var clientName,
                scrollBodyName,
                scrollName,
                offsetBodyName,
                offsetName;

            pklib.common.assert(typeof name === "string", "pklib.ui.size.document: @name: not {String}");

            name = pklib.string.capitalize(name);
            clientName = document.documentElement["client" + name];
            scrollBodyName = document.body["scroll" + name];
            scrollName = document.documentElement["scroll" + name];
            offsetBodyName = document.body["offset" + name];
            offsetName = document.documentElement["offset" + name];
            return Math.max(clientName, scrollBodyName, scrollName, offsetBodyName, offsetName);
        },

        /**
         * @memberOf pklib.ui.size
         * @function
         * @param {HTMLElement} obj
         * @param {String} name
         * @returns {Number}
         */
        object: function (obj, name) {
            pklib.common.assert(typeof name === "string", "pklib.ui.size.object: @name: not {String}");
            pklib.common.assert(pklib.dom.is_element(obj), "pklib.ui.size.object: @obj: not {HTMLElement}");

            name = pklib.string.capitalize(name);
            var client = obj["client" + name],
                scroll = obj["scroll" + name],
                offset = obj["offset" + name];
            return Math.max(client, scroll, offset);
        }
    };

}(this));
/**
 * @package pklib.url
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {},
        /**
         * Document.location object
         * @private
         * @type {Object}
         */
        loc = global.location || {};

    /**
     * Url helper manager
     * @namespace
     */
    pklib.url = {
        /**
         * @memberOf pklib.url
         * @function
         * @returns {String}
         */
        get_protocol: function () {
            return loc.protocol;
        },

        /**
         * @memberOf pklib.url
         * @function
         * @returns {String}
         */
        get_host: function () {
            return loc.host;
        },

        /**
         * @memberOf pklib.url
         * @function
         * @returns {String}
         */
        get_port: function () {
            return loc.port || 80;
        },

        /**
         * @memberOf pklib.url
         * @function
         * @returns {String}
         */
        get_uri: function () {
            return loc.pathname;
        },

        /**
         * Get all params, and return in JSON object
         * @memberOf pklib.url
         * @function
         * @returns {Object}
         */
        get_params: function () {
            var i,
                item,
                len,
                params = loc.search,
                params_list = {};

            if (params.substr(0, 1) === "?") {
                params = params.substr(1);
            }

            params = params.split("&");
            len = params.length;

            for (i = 0; i < len; ++i) {
                item = params[i].split("=");
                params_list[item[0]] = item[1];
            }
            return params_list;
        },

        /**
         * Get concrete param from URL.
         * If param if not defined return null
         * @memberOf pklib.url
         * @function
         * @param {String} key
         * @returns {String}
         */
        get_param: function (key) {
            var params = loc.search,
                i,
                item,
                len;

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
        },

        /**
         * @memberOf pklib.url
         * @function
         * @returns {String}
         */
        get_hash: function () {
            return loc.hash;
        }
    };

}(this));
/**
 * @package pklib.utils
 * @dependence pklib.common, pklib.dom, pklib.event
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {},
        document = global.document || {},

        /**
         * @private
         * @function
         * @param {Event} evt
         */
        opentrigger = function (evt) {
            var url = "";

            if (evt.originalTarget &&
                    typeof evt.originalTarget === "object" &&
                    typeof evt.originalTarget.href !== "undefined") {
                url = evt.originalTarget.href;
            } else if (evt.toElement &&
                    typeof evt.toElement === "object" &&
                    typeof evt.toElement.href !== "undefined") {
                url = evt.toElement.href;
            } else if (evt.srcElement &&
                    typeof evt.srcElement === "object" &&
                    typeof typeof evt.srcElement !== "undefined") {
                url = evt.srcElement.href;
            }

            global.open(url);

            try {
                evt.preventDefault();
            } catch (ignore) {
                global.event.returnValue = false;
            }

            return false;
        };

    /**
     * Utils tools
     * @namespace
     */
    pklib.utils = {
        /**
         * Numbers of chars in ASCII system
         * @memberOf pklib.utils
         * @field
         * @namespace
         */
        ascii: {
            /**
             * @memberOf pklib.utils.ascii
             * @field
             * @namespace
             */
            letters: {
                /**
                 * @memberOf pklib.utils.ascii.letters
                 * @field
                 * @type {Array}
                 */
                lower: [113, 119, 101, 114, 116, 121, 117, 105, 111, 112, 97, 115, 100, 102, 103, 104, 106, 107, 108, 122, 120, 99, 118, 98, 110, 109],

                /**
                 * @memberOf pklib.utils.ascii.letters
                 * @field
                 * @type {Array}
                 */
                upper: [81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 65, 83, 68, 70, 71, 72, 74, 75, 76, 90, 88, 67, 86, 66, 78, 77]
            }
        },

        /**
         * @memberOf pklib.utils
         * @namespace
         */
        action: {
            /**
             * @memberOf pklib.utils.action
             * @function
             * @param {HTMLElement} obj
             */
            clearfocus: function (obj) {
                if (pklib.dom.is_element(obj)) {
                    pklib.event.add(obj, "focus", function () {
                        if (obj.value === obj.defaultValue) {
                            obj.value = "";
                        }
                    });
                    pklib.event.add(obj, "blur", function () {
                        if (obj.value === "") {
                            obj.value = obj.defaultValue;
                        }
                    });
                }
            },

            /**
             * @memberOf pklib.utils.action
             * @function
             * @param {HTMLElement} area
             */
            outerlink: function (area) {
                var i, len,
                    link, links;

                area = area || document;

                links = pklib.dom.by_tag("a", area);
                len = links.length;

                for (i = 0; i < len; ++i) {
                    link = links[i];
                    if (link.rel === "outerlink") {
                        pklib.event.add(link, "click", opentrigger.bind(link));
                    }
                }
            },

            /**
             * @memberOf pklib.utils.action
             * @function
             * @param {HTMLElement} element
             * @param {String} [text="Sure?"]
             */
            confirm: function (element, text) {
                var response;
                if (typeof element !== "undefined") {
                    text = text || "Sure?";

                    pklib.event.add(element, "click", function (evt) {
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
        }
    };

}(this));
