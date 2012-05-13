/**
 * @package pklib.ajax
 * @dependence pklib.array, pklib.common
 */
(function (global) {
    "use strict";
    /** @namespace */
    var pklib = global.pklib || {},
        /**
         * Default time what is timeout to use function pklib.ajax
         * @private
         * @constant
         * @type Number
         */
        DEFAULT_TIMEOUT_TIME = 30000,
        /** @constant */
        REQUEST_STATE_UNSENT = 0,
        /** @constant */
        REQUEST_STATE_OPENED = 1,
        /** @constant */
        REQUEST_STATE_HEADERS_RECEIVED = 2,
        /** @constant */
        REQUEST_STATE_LOADING = 3,
        /** @constant */
        REQUEST_STATE_DONE = 4,
        /**
         * Array contain key as url, value as ajax response
         * @private
         * @type Array
         */
        cache = [],
        /**
         * Use when state in request is changed or if used cache is handler to request.
         * @private
         * @function
         * @param {Object} settings
         * @param {XMLHttpRequest} xhr
         */
        handler = function (settings, xhr) {
            var contentType,
                xmlContentType = ["application/xml", "text/xml"],
                property = "responseText";

            if (xhr.readyState === REQUEST_STATE_DONE && xhr.status !== REQUEST_STATE_UNSENT) {
                if (settings.cache) {
                    cache[settings.url] = xhr;
                }

                contentType = xhr.getResponseHeader("Content-Type");

                if (pklib.array.inArray(contentType, xmlContentType)) {
                    property = "responseXML";
                }

                settings.done.call(null, xhr[property]);

                // clear memory
                xhr = null;
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
        timeoutHandler = function (settings, xhr) {
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
        requestTimeout = function (settings, xhr) {
            if (typeof xhr.aborted === "undefined" &&
                    typeof xhr.error === "undefined" &&
                    xhr.readyState === REQUEST_STATE_DONE &&
                    xhr.status === REQUEST_STATE_UNSENT) {
                xhr.abort();
                timeoutHandler.call(null, settings, xhr);
            }
        },
        /**
         * Try to create Internet Explorer XMLHTTPRequest
         * @private
         * @function
         * @throws {Error} If can not create XMLHttpRequest object
         * @returns {Object|Undefined} ActiveXObject object
         */
        get_microsoft_xhr = function () {
            var xhr;
            try {
                xhr = new global.ActiveXObject("Msxml2.XMLHTTP");
            } catch (ignore) {
                try {
                    xhr = new global.ActiveXObject("Microsoft.XMLHTTP");
                } catch (ignored) {
                    throw new Error("pklib.ajax.load: cannot create XMLHTTPRequest object");
                }
            }
            return xhr;
        },
        /**
         * Try to create XMLHTTPRequest
         * @private
         * @function
         * @throws {Error} If can not create XMLHttpRequest object
         * @returns {Object|Undefined} XMLHttpRequest object
         */
        get_xhr = function () {
            var xhr;
            try {
                xhr = new global.XMLHttpRequest();
            } catch (ignore) {
                xhr = get_microsoft_xhr();
            }
            return xhr;
        },
        /**
         * Service to send request to server.
         * With first param, which is hashmap, define params, ex. request url
         * @namespace
         */
        ajax = {
            /**
             * Send request to server on url defined in config.url.
             * Method throw exception when request have timeout on server or if url is not set.
             * Also, every response (if config.cache is true) saved to hashmap by key config.url.
             * Method on first try to can create XmlHttpRequest if browser doesn't support, check
             * if browser support object ActiveXObject which is implemented in Internet Explorer.
             * @memberOf ajax
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
             *          console.log(res);
             *      }
             * });
             * </pre>
             * @throws {ReferenceError} If unset request url
             * @returns {XMLHttpRequest|Null}
             */
            load: function (config) {
                var header,
                    xhr = null,
                    /**
                     * Request settings, contain ex. headers, callback when run after request finish.
                     * Default timeout on request is 30 seconds. This is default timeout from popular web servers
                     * ex. Apache, ngninx.
                     * Default request hasn't any headers.
                     * Default cache is disabled.
                     * Default asynchronous is enable.
                     */
                    settings = {
                        type: "get",
                        async: true,
                        cache: false,
                        url: null,
                        params: null,
                        timeout: DEFAULT_TIMEOUT_TIME,
                        headers: {},
                        /**
                         * Function run after request ended
                         */
                        done: function (/* response */) {
                            // do something with response
                        },
                        error: function () {
                            // do something when appear error in request
                        }
                    };

                settings = pklib.object.mixin(settings, config);
                settings.type = settings.type.toUpperCase();

                if (settings.url === null) {
                    throw new ReferenceError("pklib.ajax.load: undefined request url");
                }

                if (settings.cache && cache[settings.url]) {
                    handler.call(null, settings, cache[settings.url]);
                } else {
                    xhr = get_xhr();
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
                        pklib.common.defer(requestTimeout.bind(null, settings, xhr), settings.timeout);
                    }

                    xhr.onerror = function () {
                        xhr.error = true;
                        settings.error.bind(null, settings, xhr);
                    };
                }
                return xhr;
            },
            /**
             * Stop request setting in param
             * @memberOf ajax
             * @function
             * @param {XMLHttpRequest} xhr XMLHttpRequest object, or ActiveXObject object if Internet Explorer
             */
            stop: function (xhr) {
                xhr.abort();
                xhr.aborted = true;
                // clear memory
                xhr = null;
            }
        };

    pklib.ajax = ajax;
}(this));
