/**
 * @package pklib.file, pklib.string
 */
(function (global) {
    "use strict";
    /** @namespace */
    var pklib = global.pklib || {},
        document = global.document || {},
        /**
         * @private
         * @function
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
                 * @memberOf script
                 * @function
                 */
                script.onreadystatechange = function () {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        if (typeof callback === "function") {
                            callback(script);
                        }
                    }
                };
            } else {
                /**
                 * Method run when request has ended
                 * @memberOf script
                 * @function
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
             * @memberOf file
             * @function
             * @param {String|Array} files
             * @param {Function} callback
             */
            loadjs: function (files, callback) {
                var file,
                    self = this;

                if (typeof files === "string") {
                    file = files;
                    simpleLoadJS(file, function (script) {
                        if (typeof callback === "function") {
                            callback(script);
                        }
                    });
                } else {
                    file = files.shift();

                    if (typeof file === "undefined") {
                        if (typeof callback === "function") {
                            callback();
                        }
                    }
                    simpleLoadJS(file, function () {
                        self.loadjs(files, callback);
                    });
                }
            }
        };

    pklib.file = file;
}(this));
