/**
 * @package pklib.file, pklib.string
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {},
        document = global.document || {},
        /**
         * @private
         * @type Array
         */
        copy_files = [],
        /**
         * @private
         * @function
         * @param {String} url
         * @param {Function} callback
         */
        simple_load_js = function (url, callback) {
            /**
             * Create HTMLElement <script>
             */
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;

            if (typeof script.readyState === "undefined") {
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
            } else {
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
            }

            if (typeof document.head === "undefined") {
                document.head = document.getElementsByTagName("head")[0];
            }

            document.head.appendChild(script);
        };

    /**
     * JS file loader
     * @namespace
     */
    pklib.file = {
        /**
         * Lazy load JS files. Url to files could be with path absolute or not.
         * If you must load more than 1 file use array, to set url to files
         * @memberOf pklib.file
         * @function
         * @param {String|Array} files
         * @param {Function} callback
         */
        loadjs: function (files, callback) {
            var file,
                self = this;

            if (typeof files === "string") {
                file = files;
                simple_load_js(file, function (script) {
                    if (typeof callback === "function") {
                        callback(script);
                    }
                });
            } else if (pklib.array.is_array(files)) {
                if (!copy_files.length) {
                    copy_files = pklib.object.mixin(copy_files, files);
                }

                file = files.shift();

                if (typeof file === "undefined") {
                    if (typeof callback === "function") {
                        callback({
                            src: copy_files[copy_files.length - 1]
                        });

                        copy_files = [];
                    }
                } else {
                    simple_load_js(file, function () {
                        self.loadjs(files, callback);
                    });
                }
            } else {
                throw new TypeError("pklib.file.loadjs: @files not {String} or {Array}");
            }
        }
    };

}(this));
