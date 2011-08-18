/**
 * @package pklib.file
 */
pklib = this.pklib || {};
pklib.file = (function() {

    var doc = document;

    var __file = {

        load : function(src, callback) {
            var script = doc.createElement("script");
            script.type = "text/javascript";
            script.src = src;

            if (script.readyState) {
                script.onreadystatechange = function() {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        (typeof callback === "function") && callback();
                    }
                };
            } else {
                script.onload = function() {
                    (typeof callback === "function") && callback();
                };
            }

            doc.getElementsByTagName("head")[0].appendChild(script);

        }

    };

    return __file;

})();
