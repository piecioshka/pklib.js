/**
 * @package pklib.glass
 * @dependence pklib.browser, pklib.dom, pklib.event, pklib.utils
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {},
        document = global.document || {},
        id = "pklib-glass-wrapper",
        settings = {
            container: null,
            style: {
                position: "absolute",
                left: 0,
                top: 0,
                background: "#000",
                opacity: 0.5,
                zIndex: 1000
            }
        };

    /**
     * Show glass on dimensions on browser
     * @namespace
     */
    pklib.ui.glass = {
        obj_id: id,
        /**
         * @memberOf pklib.ui.glass
         * @function
         * @param {Object} config
         * @param {Function} callback
         * @returns {HTMLElement}
         */
        show: function (config, callback) {
            var that = this,
                glass = document.createElement("div"),
                glassStyle = glass.style,
                style;
            settings.container = document.body;
            settings = pklib.object.mixin(settings, config);
            settings.style.filter = "alpha(opacity=" + parseFloat(settings.style.opacity) * 100 + ")";

            glass.setAttribute("id", this.obj_id);
            for (style in settings.style) {
                if (settings.style.hasOwnProperty(style)) {
                    glassStyle[style] = settings.style[style];
                }
            }

            settings.container.appendChild(glass);

            pklib.ui.maximize(glass, settings.container);

            pklib.event.add(global, "resize", function () {
                that.close();
                that.show(config, callback);
                pklib.ui.maximize(glass, settings.container);
            });
            if (typeof callback === "function") {
                callback();
            }
            return glass;
        },
        /**
         * @memberOf pklib.ui.glass
         * @function
         * @param {Function} callback
         * @returns {Boolean}
         */
        close: function (callback) {
            var glass = pklib.dom.by_id(this.obj_id),
                result = false;

            pklib.event.remove(global, "resize");

            if (glass !== null) {
                glass.parentNode.removeChild(glass);
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
