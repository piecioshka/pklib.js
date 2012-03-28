/**
 * @package pklib.ajax
 * @dependence pklib.array
 */
(function (global) {
    "use strict";
    /**
     * @constructor
     * @param {String} [message=""]
     */
    function XHRError(message) {
        this.name = "XHRError";
        this.message = message || "";
    }

    XHRError.prototype = new Error();
    XHRError.prototype.constructor = XHRError;

    /** @namespace */
    var pklib = global.pklib || {},
        /**
         * Array containt key as url, value as ajax response
         */
        cache = [],
        /**
         * @param {Object} settings
         * @param {XMLHttpRequest} xhr
         */
        handler = function (settings, xhr) {
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

                xhr = null;
            }
        },
        /**
         * @param {Object} settings
         * @param {XMLHttpRequest} xhr
         * @throws {XHRError} If exists timeout on request
         */
        timeoutHandler = function (settings, xhr) {
            // clear memory
            xhr = null;
            // throw exception
            throw new XHRError("pklib.ajax: XHRError: Timeout on: " + settings.url);
        },
        /**
         * @param {Object} settings
         * @param {XMLHttpRequest} xhr
         * @throws {XHRError} If exists timeout on request
         */
        requestTimeout = function (settings, xhr) {
            if (xhr.readyState !== 4) {
                xhr.abort();
                timeoutHandler.call(null, settings, xhr);
            }
        },
        /**
         * @throws {XHRError} If cannot create XMLHttpRequest object
         * @returns {Object|Undefined} ActiveXObject object
         */
        get_microsoft_xhr = function () {
            var xhr;
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (ignore) {
                try {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (ignored) {
                    throw new XHRError("pklib.ajax: XHRError: Cannot create XHR object");
                }
            }
            return xhr;
        },
        /**
         * @throws {XHRError} If cannot create XMLHttpRequest object
         * @returns {Object|Undefined} XMLHttpRequest object
         */
        get_xhr = function () {
            var xhr;
            try {
                xhr = new XMLHttpRequest();
            } catch (ignore) {
                xhr = get_microsoft_xhr();
            }
            return xhr;
        },
        /**
         * Module to service asynchronous request
         * @namespace
         */
        ajax = {
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
             * @returns {XMLHttpRequest|Null}
             */
            load: function (config) {
                var header,
                    xhr = null,
                    /**
                     * Request settings, contain header,
                     * function run after request ended
                     */
                    settings = {
                        type: "get",
                        async: true,
                        cache: false,
                        url: null,
                        params: null,
                        timeout: 30000,
                        headers: {},
                        /**
                         * Function run after request ended
                         */
                        done: function () {
                            // pass
                        }
                    };

                settings = pklib.object.mixin(settings, config);
                settings.type = settings.type.toUpperCase();

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
                        setTimeout(requestTimeout.bind(null, settings, xhr), settings.timeout);
                    }
                }
                return xhr;
            }
        };

    pklib.ajax = ajax;
}(this));
