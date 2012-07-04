/**
 * @package pklib.ui.loader
 * @dependence pklib.dom, pklib.event, pklib.utils
 */
(function (global) {
    "use strict";
    /** @namespace */
    var pklib = global.pklib || {},
        document = global.document || {},
        id = "pklib-loader-wrapper",
        settings = {
            src: "",
            container: null,
            style: {
                width: 31,
                height: 31,
                zIndex: 1010
            },
            center: true
        };

    /**
     * Loader adapter.
     * Show animate image (GIF) on special place.
     * @namespace
     */
    pklib.ui.loader = {
        obj_id: id,
        /**
         * @memberOf pklib.ui.loader
         * @function
         * @param {object} config
         * @param {function} callback
         */
        show: function (config, callback) {
            settings.container = document.body;
            settings = pklib.object.mixin(settings, config);

            var loader = document.createElement("img"),
                loaderStyle = loader.style,
                style;

            loader.setAttribute("id", this.obj_id);
            loader.setAttribute("src", settings.src);

            for (style in settings.style) {
                if (settings.style.hasOwnProperty(style)) {
                    loaderStyle[style] = settings.style[style];
                }
            }

            if (settings.center) {
                pklib.ui.center(loader, settings.container);

                pklib.event.add(global, "resize", function () {
                    pklib.ui.center(loader, settings.container);
                });
            }

            settings.container.appendChild(loader);

            if (typeof callback === "function") {
                callback();
            }
            // clear memory
            loader = null;
        },
        /**
         * @memberOf pklib.ui.loader
         * @function
         * @param {Function} callback
         * @returns {Boolean}
         */
        close: function (callback) {
            var loader = pklib.dom.by_id(this.obj_id),
                result = false;
            if (loader !== null) {
                loader.parentNode.removeChild(loader);
                this.close(callback);
                result = true;
            }
            if (typeof callback === "function") {
                callback();
            }
            return result;
        }
    };
}(this));
