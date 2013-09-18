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
            delete xhr.ontimeout;

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
