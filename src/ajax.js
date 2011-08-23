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
