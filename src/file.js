/**
 * @package file
 */
pklib = this.pklib || {};

/**
 * File manager
 */
pklib.file = (function () {

    return {

        /**
         * Lazy load scripts.
         * Append script to HEAD section.
         *
         * @param {string} src
         * @param {function} callback
         */
        load: function (src, callback) {
            var doc = document,
                script = doc.createElement("script");
                
            doc.head = doc.head || document.getElementsByTagName("head")[0];
                
            script.type = "text/javascript";
            script.src = src;

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

            doc.head.appendChild(script);
        }
    };

})();
