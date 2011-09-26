/**
 * @package ajax
 * @dependence array, utils
 */
pklib = this.pklib || {};
pklib.ajax = (function() {

    var client = null;
    var settings = {};
    var cache = [];

    function handler() {
        var method = "responseText";

        if(this.readyState === 4) {
            cache[settings.url] = this;

            var ct = this.getResponseHeader("Content-Type");
            var xmlct = ["application/xml", "text/xml"];

            if(pklib.array.inArray(ct, xmlct)) {
                method = "responseXML";
            }

            settings.done.call(null, this[method]);
        }
    }

    return {

        /**
         * Lazy load file.
         *
         * @param {object} config
         * <pre>
         * {
         *      type {string|default /get/}
         *      async {boolean|default true}
         *      cache {boolean|default false}
         *      url {string}
         *      params {array or object}
         *      headers {object}
         *
         *      done {function}
         * }
         * </pre>
         */
        load: function(config) {
            client = null;
            settings = {
                type : "get",
                async : true,
                cache : false,
                url : null,
                params : null,
                headers : {},
    
                done : function(data) {
                    // pass
                }
            };
            settings = pklib.utils.merge(settings, config);
            settings.type = settings.type.toUpperCase();
    
            if(settings.cache && cache[settings.url]) {
                handler.call(cache[settings.url]);
            } else {
                client = new XMLHttpRequest();
                client.onreadystatechange = function() {
                    handler.call(client);
                };
                client.open(settings.type, settings.url, settings.async);
                if(settings.headers != null) {
                    for(var item in settings.headers) {
                        if(settings.headers.hasOwnProperty(item)) {
                            client.setRequestHeader(item, settings.headers[item]);
                        }
                    }
                }
                client.send(settings.params);
            }
        }

    };
})();
