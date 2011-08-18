/**
 * @package app.ajax
 * @dependence pklib.utils
 */
pklib = this.pklib || {};
pklib.cache = [];
pklib.ajax = (function() {

    var client = null, _settings = {}, _states = [];

    function __init() {
        client = null, _settings = {
            type : "get",
            async : true,
            cache : false,
            url : null,
            params : null,
            headers : {
                "Accept-Encoding" : "gzip"
            },

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
        }, _states = [];
    }

    function handler() {
        var method = "responseText";
        
        if (this.readyState === 4) {
            pklib.cache[_settings.url] = this;

            var ct = this.getResponseHeader("Content-Type"),
                xmlct = [ "application/xml", "text/xml" ];

            if (pklib.utils.array.inArray(ct, xmlct)) {
                method = "responseXML";
            }

        }
        _states[this.readyState].call(null, this[method]);
    }

    return function(obj) {

        __init();

        _settings = pklib.utils.merge(_settings, obj);
        _settings.type = _settings.type.toUpperCase();
        _states = [ _settings.unset, _settings.opened, _settings.headersReceived, _settings.loading, _settings.done ];

        if (_settings.cache && pklib.cache[_settings.url]) {
            handler.call(pklib.cache[_settings.url]);
        } else {
            client = new XMLHttpRequest();
            client.onreadystatechange = function(){
                handler.call(client);
            };
            client.open(_settings.type, _settings.url, _settings.async);
            if (_settings.headers != null) {
                for ( var item in _settings.headers ) {
                    client.setRequestHeader(item, _settings.headers[item]);
                }
            }
            client.send(_settings.params);
        }

    };

})();
