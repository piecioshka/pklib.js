/*jslint continue: true, nomen: true, plusplus: true, regexp: true, vars: true, white: true, indent: 4 */
/*global document, XMLHttpRequest, ActiveXObject, setInterval, clearInterval, setTimeout, clearTimeout, navigator */

/** pklib JavaScript library v2.0.0 - MIT License */

(function (root) {
    'use strict';

    // imports
    var document = root.document;

    // prototypes
    var ObjectProto = Object.prototype;
    var ArrayProto = Array.prototype;

    // shortcuts
    var toString = ObjectProto.toString;

    // Helpers.
    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Basic test function. Simple assertion 2 variables.
     *
     * @param {boolean} expression Object what is true.
     * @param {string} comment Message to throw in error.
     * @throws {Error} Condition it's not true.
     */
    function assert(expression, comment) {
        if (!expression) {
            throw new Error(comment);
        }

        assert.count++;
    }

    assert.count = 0;

    // Library.
    // -----------------------------------------------------------------------------------------------------------------

    var pklib = {
        VERSION: '1.3'
    };

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
     *
     * @param {Object} settings
     * @param {XMLHttpRequest} xhr
     */
    function successHandler(settings, xhr) {
        var contentType,
            xmlContentType = ['application/xml', 'text/xml'],
            property = 'responseText';

        if (settings.cache) {
            cache[settings.url] = xhr;
        }

        contentType = xhr.getResponseHeader('Content-Type');

        if (inArray(contentType, xmlContentType)) {
            property = 'responseXML';
        }

        settings.done.call(null, xhr[property]);

        // clear memory
        xhr = null;
    }

    /**
     * When error request.
     *
     * @param {Object} settings
     * @param {XMLHttpRequest} xhr
     */
    function errorHandler(settings, xhr) {
        // check if error handler is run yet
        if (!xhr._run_error_handler) {
            // NO, so we run error handler first time
            settings.error(settings, xhr);

            // set flag to no run error handler
            xhr._run_error_handler = true;
        }
    }

    /**
     * Use when state in request is changed or if used cache is handler to request.
     *
     * @param {Object} settings
     * @param {XMLHttpRequest} xhr
     */
    function stateChangeHandler(settings, xhr) {
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
                successHandler(settings, xhr);
            } else {
                // error
                errorHandlerWithAbort(settings, xhr);
            }
        }
    }

    function errorHandlerWithAbort(settings, xhr) {
        xhr.abort();

        errorHandler(settings, xhr);
    }

    /**
     * Handler to unusually situation - timeout.
     *
     * @param {Object} settings
     * @param {XMLHttpRequest} xhr
     */
    function timeoutHandler(settings, xhr) {
        errorHandler(settings, xhr);
    }

    /**
     * Try to create Internet Explorer XMLHttpRequest.
     *
     * @return {ActiveXObject|undefined}
     * @throws {Error} If cannot create XMLHttpRequest object.
     */
    function createMicrosoftXhr() {
        var xhr;
        try {
            xhr = new ActiveXObject('Msxml2.XMLHTTP');
        } catch (ignore) {
            try {
                xhr = new ActiveXObject('Microsoft.XMLHTTP');
            } catch (ignored) {
                throw new Error("pklib.ajax.load: can't create XMLHttpRequest object");
            }
        }
        return xhr;
    }

    /**
     * Try to create XMLHttpRequest.
     *
     * @return {XMLHttpRequest|undefined}
     * @throws {Error} If cannot create XMLHttpRequest object.
     */
    function createXhr() {
        var xhr;
        try {
            xhr = new XMLHttpRequest();
        } catch (ignore) {
            xhr = createMicrosoftXhr();
        }
        return xhr;
    }

    /**
     * Add headers to xhr object.
     *
     * @param {Object} settings
     * @param {XMLHttpRequest} xhr
     */
    function addHeadersToXhr(settings, xhr) {
        var header, headers = settings.headers;

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
     *
     * @param {Object} settings
     * @param {XMLHttpRequest} xhr
     */
    function addTimeoutServiceToXhr(settings, xhr) {
        xhr.ontimeout = setTimeout(function () {
            timeoutHandler(settings, xhr);
        }, settings.timeout);
    }

    /**
     * Check is response on this request is in cache.
     *
     * @param {Object} settings
     * @return {boolean}
     */
    function isResponseInCache(settings) {
        return cache[settings.url];
    }

    /**
     * Return object what is default configuration of request.
     *
     * @return {Object} Default configuration.
     */
    function getDefaultSettings() {
        /**
         * Request settings, contain ex. headers, callback when run after
         * request finish. Default timeout on request is 30 seconds.
         * This is default timeout from popular web servers, ex. Apache, nginx.
         * Default request hasn't any headers.
         * Default cache is disabled.
         * Default asynchronous is enable.
         */
        return {
            type: 'get',
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
         *
         * @param {Object} config
         * {
         *      {string} [type='get']
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
         *      type: 'post',
         *      async: false,
         *      cache:  true,
         *      url: 'http://example.org/check-item.php',
         *      params: { id: 33 },
         *      headers: {
         *          'User-Agent': 'tv'
         *      },
         *      done: function (res) {
         *          // pass
         *      }
         * });
         * @return {XMLHttpRequest|null}
         * @throws {Error} If unset request url.
         */
        load: function (config) {
            var xhr = null, settings = getDefaultSettings();

            settings = mixin(settings, config);
            settings.type = settings.type.toUpperCase();

            // simple assert to check 'url' is set
            assert(settings.url !== null, 'pklib.ajax.load: @url is not defined');

            // check if we use 'cache' flag in request
            if (settings.cache && isResponseInCache(settings)) {
                // YES, we use, so we can return response from cache object
                stateChangeHandler.call(null, settings, cache[settings.url]);
            } else {
                // NO, is normal request to server
                xhr = createXhr();
                xhr.onreadystatechange = stateChangeHandler.bind(null, settings, xhr);

                try {
                    xhr.open(settings.type, settings.url, settings.async);
                } catch (open_exception) {
                    // error
                    errorHandlerWithAbort(settings, xhr);

                    return xhr;
                }

                addHeadersToXhr(settings, xhr);
                addTimeoutServiceToXhr(settings, xhr);

                try {
                    xhr.send(settings.params);
                } catch (send_exception) {
                    // error
                    errorHandlerWithAbort(settings, xhr);

                    return xhr;
                }
            }

            return xhr;
        },

        /**
         * Stop request setting in param.
         *
         * @param {XMLHttpRequest|ActiveXObject} xhr XMLHttpRequest object,
         *     or ActiveXObject object if Internet Explorer.
         */
        stop: function (xhr) {
            xhr.abort();

            // clear memory
            xhr = null;
        }
    };

    /**
     * Check if param is array.
     *
     * @param {Object} array
     * @return {boolean}
     */
    function isArray(array) {
        return array !== null && typeof array === 'object' && toString.call(array) === '[object Array]' &&
            typeof array.length === 'number' && typeof array.slice === 'function';
    }

    /**
     * Check if element is in array by loop.
     *
     * @param {*} param
     * @param {Array} array
     * @return {boolean}
     */
    function inArray(param, array) {
        var i, len = array.length;

        for (i = 0; i < len; ++i) {
            if (array[i] === param) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get index of element. If couldn't find searching element, return null value.
     *
     * @param {*} item
     * @param {Array} array
     * @return {number|null}
     */
    function arrayIndex(item, array) {
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
     *
     * @param {Array} array
     * @return {Array}
     */
    function unique(array) {
        var i, item, temp = [], len = array.length;

        for (i = 0; i < len; ++i) {
            item = array[i];
            if (!inArray.call(null, item, temp)) {
                temp.push(item);
            }
        }
        return temp;
    }

    /**
     * Remove element declared in infinity params without first.
     * First parameter is array object.
     *
     * @param {Array} array
     * @return {Array}
     */
    function arrayRemove(array) {
        var i, param, params = ArrayProto.slice.call(arguments, 1), len = params.length;

        for (i = 0; i < len; ++i) {
            param = params[i];
            if (inArray(param, array)) {
                array.splice(arrayIndex(param, array), 1);
            }
        }
        return array;
    }

    /**
     * @module pklib.array
     */
    pklib.array = {
        isArray: isArray,
        inArray: inArray,
        index: arrayIndex,
        unique: unique,
        remove: arrayRemove
    };

    /**
     * Bind function to aspect.
     * Create method with merge first and second.
     * Second method is run after first.
     *
     * @module pklib.aspect
     * @param {Function} fun The function to bind aspect function.
     * @param {Function} asp The aspect function.
     * @param {string} [when='before'] Place to aspect function.
     * @return {Function}
     * @throws {TypeError} If any param is not function.
     */
    pklib.aspect = function (fun, asp, when) {
        // private
        var self = this, result;

        assert(typeof fun === 'function', 'pklib.aspect: @func: not {Function}');
        assert(typeof asp === 'function', 'pklib.aspect: @asp: not {Function}');

        when = when || 'before';

        return function () {
            if (when === 'before') {
                asp.call(self);
            }

            result = fun.apply(self, arguments);

            if (when === 'after') {
                result = asp.call(self);
            }

            return result;
        };
    };

    /**
     * Deferred function about some milliseconds.
     * If milliseconds is 0 that it's hack for some platforms to use function
     * in 'next' thread.
     *
     * @param {Function} defer_function Function what would be deferred.
     * @param {number} [milliseconds] Time to deferred function
     */
    function defer(defer_function, milliseconds) {
        milliseconds = milliseconds || 0;
        setTimeout(defer_function, milliseconds);
    }

    /**
     * Interval checking first function until returns true, run after this second function callback.
     *
     * @param {Function} condition Function returns {@type boolean} status.
     * @param {Function} callback
     */
    function checking(condition, callback) {
        var interval,
            interval_time = 100;

        assert(typeof condition === 'function', 'pklib.common.checking: @condition: not {Function}');
        assert(typeof callback === 'function', 'pklib.common.checking: @callback: not {Function}');

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
     */
    pklib.common = {
        assert: assert,
        defer: defer,
        checking: checking
    };

    /**
     * Read cookie by it name.
     *
     * @param {string|undefined} name
     * @return {string|null}
     */
    function getCookie(name) {
        if (name === undefined) {
            return null;
        }
        name += '=';
        var i, c,
            ca = document.cookie.split(';'),
            len = ca.length;

        for (i = 0; i < len; ++i) {
            c = ca[i];
            while (c.charAt(0) === ' ') {
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
     *
     * @param {string} name
     * @param {string} [value]
     * @param {number} [days]
     * @return {string}
     */
    function createCookie(name, value, days) {
        var expires = '',
            date = new Date();

        value = value || null;

        if (days !== undefined) {
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }

        document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';

        return getCookie(name);
    }

    /**
     * Delete cookie by it name.
     *
     * @param {string} name
     * @return {string}
     */
    function removeCookie(name) {
        return createCookie(name, undefined, -1);
    }

    /**
     * @module pklib.cookie
     */
    pklib.cookie = {
        create: createCookie,
        get: getCookie,
        remove: removeCookie
    };

    /**
     * RegExp use to delete white chars.
     */
    var rclass = /[\n\t\r]/g;

    /**
     * Check typeof params.
     *
     * @param {string} css_class
     * @param {HTMLElement} element
     * @param {string} call_func_name
     * @throws {TypeError} If first param is not string, or second param is
     *     not Node.
     */
    function checkParams(css_class, element, call_func_name) {
        var prefix = 'pklib.css.' + call_func_name;
        assert(typeof css_class === 'string', prefix + ': @css_class: not {string}');
        assert(isElement(element), prefix + ': @element: not {HTMLElement}');
    }

    /**
     * Check if element has CSS class.
     *
     * @param {string} css_class
     * @param {HTMLElement} element
     * @return {boolean}
     * @throws {TypeError} If first param is not string, or second param is not
     *     Node
     */
    function hasClass(css_class, element) {
        checkParams(css_class, element, 'hasClass');
        var className = ' ' + css_class + ' ';
        return ((' ' + element.className + ' ').replace(rclass, ' ').indexOf(className) > -1);
    }

    /**
     * Add CSS class to element define in second parameter.
     *
     * @param {string} css_class
     * @param {HTMLElement} element
     * @throws {TypeError} If first param is not string, or second param is not Node.
     */
    function addClass(css_class, element) {
        checkParams(css_class, element, 'addClass');
        var class_element = element.className;
        if (!hasClass(css_class, element)) {
            if (class_element.length) {
                class_element += ' ' + css_class;
            } else {
                class_element = css_class;
            }
        }
        element.className = class_element;
    }

    /**
     * Remove CSS class from element define in second parameter.
     *
     * @param {string} css_class
     * @param {HTMLElement} element
     * @throws {TypeError} If first param is not string, or second param is not Node.
     */
    function removeClass(css_class, element) {
        checkParams(css_class, element, 'removeClass');
        var regexp = new RegExp('(\\s' + css_class + ')|(' + css_class + '\\s)|' + css_class, 'i');
        element.className = trim(element.className.replace(regexp, ''));
    }

    /**
     * @module pklib.css
     */
    pklib.css = {
        add_class: addClass,
        remove_class: removeClass,
        has_class: hasClass
    };

    /**
     * Types of all available node.
     */
    var node_types = {
        'ELEMENT_NODE': 1,
        'ATTRIBUTE_NODE': 2,
        'TEXT_NODE': 3,
        'CDATA_SECTION_NODE': 4,
        'ENTITY_REFERENCE_NODE': 5,
        'ENTITY_NODE': 6,
        'PROCESSING_INSTRUCTION_NODE': 7,
        'COMMENT_NODE': 8,
        'DOCUMENT_NODE': 9,
        'DOCUMENT_TYPE_NODE': 10,
        'DOCUMENT_FRAGMENT_NODE': 11,
        'NOTATION_NODE': 12
    };

    /**
     * Walking on every node in node.
     *
     * @param {HTMLElement} node
     * @param {Function} func Run on every node.
     */
    function walkTheDom(node, func) {
        if (!!node) {
            func(node);
            node = node.firstChild;
            while (node) {
                walkTheDom(node, func);
                node = node.nextSibling;
            }
        }
    }

    /**
     * Check if param is Node, with use assertions.
     *
     * @param {Node} node
     * @return {string}
     */
    function isNode(node) {
        return node && node.nodeType && node.nodeName &&
            toString.call(node) === '[object Node]';
    }

    /**
     * Check if param is NodeList, with use assertions.
     *
     * @param {NodeList} node_list
     * @return {boolean}
     */
    function isNodeList(node_list) {
        var list = ['[object HTMLCollection]', '[object NodeList]'];
        return inArray(toString.call(node_list), list);
    }

    /**
     * Check if param is instanceOf Element.
     *
     * @param {HTMLElement} node
     * @return {boolean}
     */
    function isElement(node) {
        return (node && node.nodeType === node_types.ELEMENT_NODE) || false;
    }

    /**
     * Check visibility of Node, with use assertions.
     *
     * @param {HTMLElement} node
     * @return {boolean}
     */
    function isVisible(node) {
        assert(isElement(node), 'pklib.dom.isVisible: @node is not HTMLElement');

        return node.style.display !== 'none' &&
            node.style.visibility !== 'hidden' &&
            node.offsetWidth !== 0 &&
            node.offsetHeight !== 0;
    }

    /**
     * Get element by attribute ID.
     *
     * @param {string} id
     * @return {HTMLElement|null}
     */
    function byId(id) {
        return document.getElementById(id);
    }

    /**
     * Get elements by tag name.
     *
     * @param {string} tag
     * @param {Element} [element]
     * @return {NodeList}
     */
    function byTag(tag, element) {
        return (element || document).getElementsByTagName(tag);
    }

    /**
     * Get elements by attribute CLASS.
     *
     * @param {string} css_class
     * @param {HTMLElement} [wrapper]
     * @return {Array}
     */
    function byClass(css_class, wrapper) {
        var results = [];

        wrapper = wrapper || document;

        walkTheDom(wrapper, function (node) {
            if (isElement(node) && hasClass(css_class, node)) {
                results.push(node);
            }
        });
        return results;
    }

    /**
     * Get index of node relative siblings.
     *
     * @param {HTMLElement} node
     * @return {number|null}
     */
    function nodeIndex(node) {
        assert(isElement(node), 'pklib.dom.index: @node is not HTMLElement');

        var i,
            parent = parent(node),
            children = children(parent),
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
     *
     * @param {HTMLElement} node
     * @return {Array}
     */
    function children(node) {
        assert(isElement(node), 'pklib.dom.children: @node is not HTMLElement');

        var i,
            array = [],
            childNodes = node.childNodes,
            len = childNodes.length;

        for (i = 0; i < len; ++i) {
            if (isElement(childNodes[i])) {
                array.push(childNodes[i]);
            }
        }
        return array;
    }

    /**
     * Insert data to Node. Maybe param is string so insert will be exec
     * by innerHTML, but if param is Node inserting with appendChild().
     *
     * @param {HTMLElement|string} element
     * @param {HTMLElement} node
     * @return {HTMLElement}
     */
    function insert(element, node) {
        if (isElement(element)) {
            node.appendChild(element);
        } else if (isString(element)) {
            node.innerHTML += element;
        }
        return element;
    }

    /**
     * Remove Element specified in params.
     *
     * @param {...HTMLElement} items
     */
    function nodeRemove(items) {
        var i, node = null, parent = null,
            args = ArrayProto.slice.call(arguments),
            len = args.length;

        for (i = 0; i < len; ++i) {
            node = args[i];
            if (isElement(node)) {
                parent = node.parentNode;
                parent.removeChild(node);
            }
        }
    }

    /**
     * Get prev Node what will be Element.
     *
     * @param {HTMLElement} node
     * @return {HTMLElement|null}
     */
    function prev(node) {
        var prev_node;

        assert(isElement(node), 'pklib.dom.prev: @node is not HTMLElement');

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
     *
     * @param {HTMLElement} node
     * @return {HTMLElement|null}
     */
    function next(node) {
        var next_node;

        assert(isElement(node), 'pklib.dom.next: @node is not HTMLElement');

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
     * Get parent element what will by Element, but if parent is not exists returns null.
     *
     * @param {HTMLElement} node
     * @return {HTMLElement|null}
     */
    function parent(node) {
        var parent_node;

        assert(isElement(node), 'pklib.dom.parent: @node is not HTMLElement');

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
     */
    pklib.dom = {
        isNode: isNode,
        isNodeList: isNodeList,
        isElement: isElement,
        isVisible: isVisible,
        byId: byId,
        byTag: byTag,
        byClass: byClass,
        index: nodeIndex,
        children: children,
        insert: insert,
        remove: nodeRemove,
        prev: prev,
        next: next,
        parent: parent
    };

    /**
     * Add event to Element.
     *
     * @param {HTMLElement} target
     * @param {string} event_name
     * @param {Function} handler
     */
    function addEvent(target, event_name, handler) {
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
            target.attachEvent('on' + event_name, handler);
        } else if (target.addEventListener) {
            // other browser
            target.addEventListener(event_name, handler, false);
        } else {
            // for very old browser
            target['on' + event_name] = handler;
        }
    }

    /**
     * Remove event from Element.
     *
     * @param {HTMLElement} target
     * @param {string} event_name
     */
    function removeEvent(target, event_name) {
        var removeEvent, events, len, i, handler;

        if (target.events === undefined) {
            target.events = {};
        }

        if (target.detachEvent) {
            // IE browser
            removeEvent = 'detachEvent';
        } else if (target.removeEventListener) {
            // other browser
            removeEvent = 'removeEventListener';
        }

        if (removeEvent === undefined) {
            // for old browser
            delete target['on' + event_name];
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
     *
     * @param {HTMLElement} target
     * @param {string} event_name
     * @return {Array|undefined}
     */
    function getEvent(target, event_name) {
        if (target.events === undefined) {
            target.events = {};
        }
        return target.events[event_name];
    }

    /**
     * Run events on Element.
     *
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
     */
    pklib.event = {
        add: addEvent,
        remove: removeEvent,
        get: getEvent,
        trigger: trigger
    };

    // private
    var copy_files = [];

    /**
     * @param {string} url
     * @param {Function} callback
     */
    function simpleLoadJS(url, callback) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        function success_callback() {
            if (typeof callback === 'function') {
                callback(script);
            }
        }

        function readystatechange() {
            if (script.readyState === 'loaded' || script.readyState === 'complete') {
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
            document.head = document.getElementsByTagName('head')[0];
        }

        document.head.appendChild(script);
    }

    /**
     * Load JS files. Url to files could be with path absolute or not.
     * If you must load more than 1 file use array, to set url to files.
     *
     * @param {string|Array} files
     * @param {Function} callback
     */
    function loadJSFile(files, callback) {
        var file;

        if (typeof files === 'string') {
            file = files;
            simpleLoadJS(file, function (script) {
                if (typeof callback === 'function') {
                    callback(script);
                }
            });
        } else if (isArray(files)) {
            if (!copy_files.length) {
                copy_files = mixin(copy_files, files);
            }

            file = files.shift();

            if (file === undefined) {
                if (typeof callback === 'function') {
                    callback({
                        src: copy_files[copy_files.length - 1]
                    });

                    copy_files = [];
                }
            } else {
                simpleLoadJS(file, function () {
                    loadJSFile(files, callback);
                });
            }
        } else {
            throw new Error('pklib.file.loadjs: @files not {string} or {Array}');
        }
    }

    /**
     * @module pklib.file
     */
    pklib.file = {
        loadjs: loadJSFile
    };

    /**
     * Check if param is object.
     *
     * @param {Object} it
     * @return {boolean}
     */
    function isObject(it) {
        return it &&
            toString.call(it) === '[object Object]' &&
            typeof it === 'object' &&
            typeof it.hasOwnProperty === 'function' &&
            typeof it.isPrototypeOf === 'function';
    }

    /**
     * Mix two params, from second to first param. Return first param mixin with second param.
     *
     * @param {Array|Object} target
     * @param {Array|Object} source
     * @return {Array|Object}
     */
    function mixin(target, source) {
        var i, len, element, item;

        if (isArray(target) && isArray(source)) {
            len = source.length;

            for (i = 0; i < len; ++i) {
                element = source[i];

                if (!inArray(element, target)) {
                    target.push(element);
                }
            }
        } else {
            for (item in source) {
                if (source.hasOwnProperty(item)) {
                    if (isObject(target[item])) {
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
     *
     * @param {Object} obj
     * @returns {boolean}
     */
    function isEmpty(obj) {
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
     */
    pklib.object = {
        isObject: isObject,
        mixin: mixin,
        isEmpty: isEmpty
    };

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
    function getTime(name) {
        return data[name];
    }

    /**
     * @module pklib.profiler
     */
    pklib.profiler = {
        start: start,
        stop: stop,
        getTime: getTime
    };

    /**
     * @param {string} source
     * @return {boolean}
     */
    function isString(source) {
        return typeof source === 'string';
    }

    /**
     * @param {string} source
     * @return {boolean}
     */
    function isLetter(source) {
        return isString(source) && (/^[a-zA-Z]$/).test(source);
    }

    /**
     * @param {string} source
     * @return {string}
     */
    function trim(source) {
        return source.replace(/^\s+|\s+$/g, '');
    }

    /**
     * @param {string} source
     * @return {string}
     */
    function slug(source) {
        var result = source.toLowerCase().replace(/\s/mg, '-');
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
                return '';
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
    function delimiterSeparatedWords(source) {
        return source.replace(/[A-ZĘÓĄŚŁŻŹĆŃ]/g, function (match) {
            return '-' + match.toLowerCase();
        });
    }

    /**
     * @param {string} source
     * @return {string}
     */
    function stripTags(source) {
        assert(typeof source === 'string', 'pklib.string.stripTags: param @source is not a string');

        if (source && source.length !== 0) {
            var dummy = document.createElement('div');
            dummy.innerHTML = source;
            return dummy.textContent || dummy.innerText;
        }
        return source;
    }

    /**
     * @param {string} source
     * @return {string}
     */
    function camelCase(source) {
        var pos, pre, sub, post;

        while (source.indexOf('-') !== -1) {
            pos = source.indexOf('-');
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
        assert(typeof source === 'string', 'pklib.string.slice: param @source is not a string');

        // jeśli długość przycinania jest większa niż długość całego tekstu
        // to zwracamy przekazany tekst
        if (source.length < length) {
            return source;
        }

        // ucinamy tyle tekstu ile jest wskazane w parametrze length
        var text = source.slice(0, length), last_space;

        // sprawdzamy czy nie ucięliśmy w połowie wyrazu:
        // * tj. czy kolejnym znakiem nie jest spacja
        if (source[length] === ' ') {
            return text + '...';
        }

        // * ostatnim znakiem w uciętym tekście jest spacja
        if (text[length - 1] === ' ') {
            return trim(text) + '...';
        }

        // jeśli nie ma wymuszenia przycinania wyrazu w jego części
        // to sprawdzamy czy możemy przyciąć do ostatniej spacji w przyciętym tekście
        if (!is_force) {
            // niestety ucięliśmy tekst w połowie wyrazu
            // postępujemy zgodnie z instrukcja, że odnajdujemy ostatnią spację
            // i obcinamy fraze do tej spacji 
            last_space = text.lastIndexOf(' ');

            // spacja została znaleziona, więc przycinamy frazę do spacji
            if (last_space !== -1) {
                return text.slice(0, last_space) + '...';
            }
        }

        // włączony tryb 'force' albo spacja nie została odnaleziona więc aby nie zwracać
        // w pustej wartości, ucinamy wyraz w tym miejscu w którym jest
        return text + '...';
    }

    /**
     * Replace tags in string to defined data.
     * ${NAME} - replace by value of object['NAME']
     *
     * @param {string} str Some string to replace by objects.
     * @param {Object} obj Object what will serve data to replace.
     * @example
     * %{car} is the best!
     * pklib.string.format('%{car} is the best', { car: 'Ferrari' });
     * //=> Ferrari is the best!
     */
    function format(str, obj) {
        var name;

        for (name in obj) {
            if (obj.hasOwnProperty(name)) {
                str = str.replace(new RegExp('%{' + name + '}', 'ig'), obj[name]);
            }
        }
        return str;
    }

    /**
     * Left padding any chars.
     *
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
     *
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
     */
    pklib.string = {
        isString: isString,
        isLetter: isLetter,
        trim: trim,
        slug: slug,
        capitalize: capitalize,
        delimiterSeparatedWords: delimiterSeparatedWords,
        stripTags: stripTags,
        camelCase: camelCase,
        slice: slice,
        format: format,
        lpad: lpad,
        rpad: rpad
    };

    /**
     * @param {HTMLElement} element
     * @param {HTMLElement} wrapper
     * @return {Array}
     * @throws {TypeError} If first param is not HTMLElement.
     */
    function center(element, wrapper) {
        var left = null, top = null, pus = pklib.ui.size;

        assert(isElement(element), 'pklib.ui.center: @element: not {HTMLElement}');

        if (wrapper === document.body) {
            left = (Math.max(pus.window('width'), pus.document('width')) - pus.object(element, 'width')) / 2;
            top = (Math.max(pus.window('height'), pus.document('height')) - pus.object(element, 'height')) / 2;
        } else {
            left = (pus.window('width') - pus.object(element, 'width')) / 2;
            top = (pus.window('height') - pus.object(element, 'height')) / 2;
        }
        element.style.left = left + 'px';
        element.style.top = top + 'px';
        element.style.position = 'absolute';
        return [left, top];
    }

    function isIE() {
        return (/msie/).test(navigator.userAgent);
    }

    /**
     * @param {HTMLElement} element
     * @param {HTMLElement} wrapper
     * @return {Array}
     */
    function maximize(element, wrapper) {
        var width = null, height = null, pus = pklib.ui.size;

        if (wrapper === document.body) {
            width = Math.max(pus.window('width'), pus.document('width'));
            height = Math.max(pus.window('height'), pus.document('height'));
            if (isIE()) {
                width -= 20;
            }
        } else {
            width = pus.object(wrapper, 'width');
            height = pus.object(wrapper, 'height');
        }
        element.style.width = width;
        element.style.height = height;
        return [width, height];
    }

    /**
     * @param {number} param
     * @param {boolean} animate
     */
    function scrollTo(param, animate) {
        var interval = null;
        if (animate) {
            interval = setInterval(function () {
                document.body.scroll_top -= 5;
                if (document.body.scroll_top <= 0) {
                    clearInterval(interval);
                }
            }, 1);
        } else {
            document.body.scroll_top = param + 'px';
        }
    }

    /**
     * @module pklib.ui
     */
    pklib.ui = {
        center: center,
        maximize: maximize,
        scrollTo: scrollTo
    };

    var id = 'pklib-glass-wrapper',
        settings = {
            container: null,
            style: {
                position: 'absolute',
                left: 0,
                top: 0,
                background: '#000',
                opacity: 0.5,
                zIndex: 1000
            }
        };

    /**
     * @param {Object} config
     * @param {Function} callback
     * @return {HTMLElement}
     */
    function showGlass(config, callback) {
        var glass = document.createElement('div'),
            glassStyle = glass.style,
            style;

        settings.container = document.body;
        settings = mixin(settings, config);
        settings.style.filter = 'alpha(opacity=' + parseFloat(settings.style.opacity) * 100 + ')';

        glass.setAttribute('id', pklib.ui.glass.objId);

        for (style in settings.style) {
            if (settings.style.hasOwnProperty(style)) {
                glassStyle[style] = settings.style[style];
            }
        }

        settings.container.appendChild(glass);

        maximize(glass, settings.container);

        addEvent(root, 'resize', function () {
            closeGlass();
            showGlass(config, callback);
            maximize(glass, settings.container);
        });

        if (typeof callback === 'function') {
            callback();
        }
        return glass;
    }

    /**
     * @param {Function} [callback]
     * @return {boolean}
     */
    function closeGlass(callback) {
        var glass = byId(pklib.ui.glass.objId),
            result = false;

        removeEvent(root, 'resize');

        if (glass !== null) {
            glass.parentNode.removeChild(glass);
            closeGlass(callback);
            result = true;
        }

        if (typeof callback === 'function') {
            callback();
        }
        return result;
    }

    /**
     * @module pklib.ui.glass
     */
    pklib.ui.glass = {
        objId: id,
        show: showGlass,
        close: closeGlass
    };

    var id = 'pklib-loader-wrapper',
        settings = {
            src: '',
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
    function showLoader(config, callback) {
        var loader = document.createElement('img'),
            loaderStyle = loader.style,
            style;

        settings.container = document.body;
        settings = mixin(settings, config);

        loader.setAttribute('id', pklib.ui.loader.objId);
        loader.setAttribute('src', settings.src);

        for (style in settings.style) {
            if (settings.style.hasOwnProperty(style)) {
                loaderStyle[style] = settings.style[style];
            }
        }

        if (settings.center) {
            center(loader, settings.container);

            addEvent(root, 'resize', function () {
                center(loader, settings.container);
            });
        }

        settings.container.appendChild(loader);

        if (typeof callback === 'function') {
            callback();
        }
        // clear memory
        loader = null;
    }

    /**
     * @param {Function} callback
     * @return {boolean}
     */
    function closeLoader(callback) {
        var loader = byId(pklib.ui.loader.objId),
            result = false;

        if (loader !== null) {
            loader.parentNode.removeChild(loader);
            closeLoader(callback);
            result = true;
        }

        if (typeof callback === 'function') {
            callback();
        }
        return result;
    }

    /**
     * @module pklib.ui.loader
     */
    pklib.ui.loader = {
        objId: id,
        show: showLoader,
        close: closeLoader
    };

    // private
    var id = 'pklib-message-wrapper',
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
    function showMessage(config, callback) {
        var message = document.createElement('div'),
            messageStyle = message.style,
            style;

        settings.container = document.body;
        settings = mixin(settings, config);

        message.setAttribute('id', pklib.ui.message.objId);

        for (style in settings.style) {
            if (settings.style.hasOwnProperty(style)) {
                messageStyle[style] = settings.style[style];
            }
        }

        insert(pklib.ui.message.content, message);

        settings.container.appendChild(message);
        center(message, settings.container);

        addEvent(root, 'resize', function () {
            center(message, settings.container);
        });

        if (typeof callback === 'function') {
            callback();
        }
        return message;
    }

    /**
     * @param {Function} callback
     * @return {boolean}
     */
    function closeMessage(callback) {
        var message = byId(pklib.ui.message.objId),
            result = false;

        if (message !== null) {
            message.parentNode.removeChild(message);
            closeMessage(callback);
            result = true;
        }

        if (typeof callback === 'function') {
            callback();
        }
        return result;
    }

    /**
     * @module pklib.ui.message
     */
    pklib.ui.message = {
        objId: id,
        content: null,
        show: showMessage,
        close: closeMessage
    };

    /**
     * @param {string} name
     * @return {number}
     * @throws {TypeError} Name is not *string* value.
     */
    function getWindowSize(name) {
        var clientName;
        assert(typeof name === 'string', 'pklib.ui.size.window: @name: not {string}');

        name = capitalize(name);
        clientName = document.documentElement['client' + name];
        return (document.compatMode === 'CSS1Compat' && clientName) ||
            document.body['client' + name] ||
            clientName;
    }

    /**
     * @param {string} name
     * @return {number}
     */
    function getDocumentSize(name) {
        var clientName,
            scrollBodyName,
            scrollName,
            offsetBodyName,
            offsetName;

        assert(typeof name === 'string', 'pklib.ui.size.document: @name: not {string}');

        name = capitalize(name);
        clientName = document.documentElement['client' + name];
        scrollBodyName = document.body['scroll' + name];
        scrollName = document.documentElement['scroll' + name];
        offsetBodyName = document.body['offset' + name];
        offsetName = document.documentElement['offset' + name];
        return Math.max(clientName, scrollBodyName, scrollName, offsetBodyName, offsetName);
    }

    /**
     * @param {HTMLElement} obj
     * @param {string} name
     * @return {number}
     */
    function getObjectSize(obj, name) {
        assert(typeof name === 'string', 'pklib.ui.size.object: @name: not {string}');
        assert(isElement(obj), 'pklib.ui.size.object: @obj: not {HTMLElement}');

        name = capitalize(name);

        var client = obj['client' + name],
            scroll = obj['scroll' + name],
            offset = obj['offset' + name];
        return Math.max(client, scroll, offset);
    }

    /**
     * @module pklib.ui.size
     */
    pklib.ui.size = {
        window: getWindowSize,
        document: getDocumentSize,
        object: getObjectSize
    };

    /**
     * Get all params, and return in JSON object.
     *
     * @param {?string} [url]
     * @return {Object}
     */
    function getParams(url) {
        var i,
            item,
            len,
            key_value_section,
            params,
            params_list = {};

        if (typeof url === 'string') {
            params = url.match(/\?(.*)/)[0] || '';
        } else {
            params = root.location.search;
        }

        if (params.substr(0, 1) === '?') {
            params = params.substr(1);
        }

        params = params.split('&');
        len = params.length;

        for (i = 0; i < len; ++i) {
            key_value_section = params[i];
            if (key_value_section.length > 0) {
                item = key_value_section.split('=');
                params_list[item[0]] = item[1];
            }
        }
        return params_list;
    }

    /**
     * Get concrete param from URL.
     * If param if not defined return null.
     *
     * @param {string} key
     * @param {?string} url
     * @return {string}
     */
    function getParam(key, url) {
        var params, i, item, len;

        if (typeof url === 'string') {
            params = url.match(/\?(.*)/)[0] || '';
        } else {
            params = root.location.search;
        }

        if (params.substr(0, 1) === '?') {
            params = params.substr(1);
        }

        params = params.split('&');
        len = params.length;

        for (i = 0; i < len; ++i) {
            item = params[i].split('=');
            if (item[0] === key) {
                return item[1];
            }
        }
        return null;
    }

    /**
     * @module pklib.url
     */
    pklib.url = {
        getParams: getParams,
        getParam: getParam
    };

    /**
     * @param {Event} evt
     */
    function openTrigger(evt) {
        var url = '';

        if (evt.originalTarget &&
                typeof evt.originalTarget === 'object' &&
                evt.originalTarget.href !== undefined) {
            url = evt.originalTarget.href;
        } else if (evt.toElement &&
                typeof evt.toElement === 'object' &&
                evt.toElement.href !== undefined) {
            url = evt.toElement.href;
        } else if (evt.srcElement &&
                typeof evt.srcElement === 'object' &&
                evt.srcElement !== undefined) {
            url = evt.srcElement.href;
        }

        root.open(url);

        try {
            evt.preventDefault();
        } catch (ignore) {
            root.event.returnValue = false;
        }
        return false;
    }

    /**
     * @param {HTMLElement} obj
     */
    function clearFocus(obj) {
        if (pklib.dom.is_element(obj)) {
            addEvent(obj, 'focus', function () {
                if (obj.value === obj.defaultValue) {
                    obj.value = '';
                }
            });
            addEvent(obj, 'blur', function () {
                if (obj.value === '') {
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

        links = pklib.dom.by_tag('a', area);
        len = links.length;

        for (i = 0; i < len; ++i) {
            link = links[i];
            if (link.rel === 'outerlink') {
                addEvent(link, 'click', openTrigger.bind(link));
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
            text = text || 'Sure?';

            addEvent(element, 'click', function (evt) {
                response = root.confirm(text);
                if (!response) {
                    try {
                        evt.preventDefault();
                    } catch (ignore) {
                        root.event.returnValue = false;
                    }

                    return false;
                }
                return true;
            });
        }
    }

    /**
     * @module pklib.utils
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
            clearfocus: clearFocus,
            outerlink: outerlink,
            confirm: confirm
        }
    };

    // exports
    root.pklib = pklib;

}(this));
