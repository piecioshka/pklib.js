/**
 * @package file
 */
pklib = this.pklib || {};

/**
 * File manager
 */
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
                    (typeof callback === "function") && callback(script);
                }
            };
        } else {
            script.onload = function () {
                (typeof callback === "function") && callback(script);
            };
        }
        
        document.head = document.head || document.getElementsByTagName("head")[0];
        document.head.appendChild(script);
    }

    return {

        /**
         * Lazy load scripts.
         * Append script to HEAD section.
         *
         * @param {string} src
         * @param {function} callback
         */
        load: function (src, callback) {
            loadjs(src, function (script) {
                (typeof callback === "function") && callback(script);
            });
        },
        
        /**
         * Lazy load menu files with dependencies which is que 
         * files in array.
         * Append script to HEAD section.
         *
         * @param {array} files
         * @param {function} callback
         * @param {bool} __continue__
         */
        lazy_load: function (files, callback, __continue__) {
            var that = this,
                len = files.length,
                file = files[lazy_file];
            
            if (!__continue__) {
                lazy_file = 0;
            }
            
            loadjs(file, function () {
                if (lazy_file < len - 1) {
                    lazy_file++;
                    that.lazy_load(files, callback, true);
                } else {
                    (typeof callback === "function") && callback();
                }
            });
        }
        
    };

})();
