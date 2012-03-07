/**
 * JS file laoder
 * @package pklib.file, pklib.string
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {},
        document = global.document || {};

    function simpleLoadJS(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        if (script.readyState) {
            script.onreadystatechange = function onreadystatechange() {
                if (script.readyState === "loaded" || script.readyState === "complete") {
                    script.onreadystatechange = null;
                    if (typeof callback === "function") {
                        callback(script);
                    }
                }
            };
        } else {
            script.onload = function onload() {
                if (typeof callback === "function") {
                    callback(script);
                }
            };
        }
        if (typeof document.head === "undefined") {
            document.head = document.getElementsByTagName("head")[0];
        }
        document.head.appendChild(script);
    }

    pklib.file = {
        /**
         * Lazy load JS files
         * @param files {String | Array}
         * @param callback {Function}
         */
        loadjs: function loadjs(files, callback) {
            if (typeof files === "string") {
                simpleLoadJS(files, function (script) {
                    if (typeof callback === "function") {
                        callback(script);
                    }
                });
            } else {
                var that = this,
                    file = files.shift();
        
                if (typeof file === "undefined") {
                    if (typeof callback === "function") {
                        callback();
                    }
                }
                simpleLoadJS(file, function () {
                    that.loadjs(files, callback);
                });
            }
        }
    };
}(this));
