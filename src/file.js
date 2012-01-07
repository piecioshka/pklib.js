/**
 * File manager
 * @package file
 */
(function (win) {
    'use strict';

    var pklib = win.pklib || {},
        document = win.document || {};

    pklib.file = (function () {
        var lazy_file = 0;
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
        return {
            /**
             * Lazy load scripts.
             * Append script to HEAD section.
             * @param src {String}
             * @param callback {Function}
             */
            load: function (src, callback) {
                loadjs(src, function (script) {
                    if (typeof callback === "function") {
                        callback(script);
                    }
                });
            },
            /**
             * Lazy load menu files with dependencies which is que 
             * files in array.
             * Append script to HEAD section.
             *
             * @param files {Array}
             * @param callback {Function}
             * @param is_continue {Bool}
             */
            lazy_load: function (files, callback, is_continue) {
                var that = this,
                    len = files.length,
                    file = files[lazy_file];
                if (!is_continue) {
                    lazy_file = 0;
                }
                loadjs(file, function () {
                    if (lazy_file < len - 1) {
                        lazy_file += 1;
                        that.lazy_load(files, callback, true);
                    } else {
                        if (typeof callback === "function") {
                            callback();
                        }
                    }
                });
            }
        };
    }());
}(this));
