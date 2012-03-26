/**
 * @package pklib.file, pklib.string
 */
(function (global) {
    "use strict";

    /** @namespace */
    var pklib = global.pklib || {},
        document = global.document || {},

        /**
         * @param {String} url
         * @param {Function} callback
         */
        simpleLoadJS = function (url, callback) {
            /**
             * Create HTMLElement <script>
             */
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;

            if (typeof script.readyState !== "undefined") {
                /**
                 * Method run when request has change state
                 * @static
                 */
                script.onreadystatechange = function () {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        if (typeof callback === "function") {
                            callback(script);
                        }
                    }
                };
            } else if (typeof script.onload !== "undefined") {
                /**
                 * Method run when request has ended
                 * @static
                 */
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
        },

        /**
         * JS file laoder
         * @namespace
         */
        file = {
            /**
             * Lazy load JS files
             * @param {String|Array} files
             * @param {Function} callback
             */
            loadjs: function (files, callback) {
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

    pklib.file = file;
}(this));
