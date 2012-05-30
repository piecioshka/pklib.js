/**
 * @package pklib.loader
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
        },
        /**
         * Loader adapter.
         * Show animate image (GIF) on special place.
         * @namespace
         */
        loader = {
            /** @field */
            objId: id,
            /**
             * @memberOf loader
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

                loader.setAttribute("id", this.objId);
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
             * @memberOf loader
             * @function
             * @param {Function} callback
             * @returns {Boolean}
             */
            close: function (callback) {
                var loader = pklib.dom.by_id(this.objId),
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

    pklib.ui = global.pklib.ui || {};
    pklib.ui.loader = loader;
}(this));
