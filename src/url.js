/**
 * @package url
 */
pklib = this.pklib || {};

/**
 * Url helper manager
 */
pklib.url = (function () {
    
    var loc = window.location;
    
    return {
        getProtocol: function () {
            return loc.protocol;
        },
        getHost: function () {
            return loc.host;
        },
        getPort: function () {
            return loc.port || 80;
        },
        getUri: function () {
            return loc.pathname;
        },
        getParams: function () {
            return loc.search;
        },
        getParam: function (key) {
            var params = loc.search;
            
            if (params.substr(0, 1) == "?") {
                params = params.substr(1);
            }
            
            params = params.split("&");
            
            for (var i = 0, len = params.length; i < len; ++i) {
                var item = params[i].split("=");
                if (item[0] === key) {
                    return item[1];
                }
            }
        },
        getHash: function () {
            return loc.hash;
        }
    }

})();
