/**
 * Module to service asynchronous request.
 * @package ajax
 * @dependence array, utils
 */
(function (win) {
    "use strict";

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
