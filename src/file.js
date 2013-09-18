/**
 * @requires pklib.array, pklib.object
 */
(function (global) {
    "use strict";

    // imports
    var document = global.document;
    var pklib = (global.pklib = global.pklib || {});

    // private
    var copy_files = [];

    /**
     * @param {string} url
     * @param {Function} callback
     */
    function simple_load_js(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;

        function success_callback() {
            if (typeof callback === "function") {
                callback(script);
            }
        }

        function readystatechange() {
            if (script.readyState === "loaded" || script.readyState === "complete") {
                script.onreadystatechange = null;
                success_callback();
            }
        }

        if (script.readyState === undefined) {
            script.onload = success_callback;
        } else {
            script.onreadystatechange = readystatechange;
        }

        if (document.head === undefined) {
            document.head = document.getElementsByTagName("head")[0];
        }

        document.head.appendChild(script);
    }

    /**
     * Load JS files. Url to files could be with path absolute or not.
     * If you must load more than 1 file use array, to set url to files.
     * @param {string|Array} files
     * @param {Function} callback
     */
    function load_js_file(files, callback) {
        var file;

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

            if (file === undefined) {
                if (typeof callback === "function") {
                    callback({
                        src: copy_files[copy_files.length - 1]
                    });

                    copy_files = [];
                }
            } else {
                simple_load_js(file, function () {
                    load_js_file(files, callback);
                });
            }
        } else {
            throw new Error("pklib.file.loadjs: @files not {string} or {Array}");
        }
    }

    /**
     * @module pklib.file
     * @type {{loadjs: Function}}
     */
    pklib.file = {
        loadjs: load_js_file
    };

}(this));
