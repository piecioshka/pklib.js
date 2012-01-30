/**
 * JS file laoder
 * @package pklib.file, pklib.string
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {},
        document = global.document || {},
        lazy_file = 0;

    function loadjs(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState === "loaded" || script.readyState === "complete") {
                    script.onreadystatechange = null;
                    if (typeof callback === "function") {
                        callback(script);
                    }
                }
            };
        } else {
            script.onload = function () {
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
        loadjs: function (files, callback, is_continue) {
            var that = this, src, len, file;
            if (pklib.string.isString(files)) {
                src = files;
                loadjs(src, function (script) {
                    if (typeof callback === "function") {
                        callback(script);
                    }
                });
            } else {
                len = files.length;
                file = files[lazy_file];

                if (!is_continue) {
                    lazy_file = 0;
                }
                loadjs(file, function () {
                    if (lazy_file < len - 1) {
                        lazy_file += 1;
                        that.loadjs(files, callback, true);
                    } else {
                        if (typeof callback === "function") {
                            callback();
                        }
                    }
                });
            }
        }
    };
}(this));
