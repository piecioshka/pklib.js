/**
 * @package pklib.glass
 * @dependence pklib.browser, pklib.dom, pklib.event, pklib.utils
 */
(function (global) {
    "use strict";

    // imports
    var document = global.document;
    var pklib = (global.pklib = global.pklib || {});

    var id = "pklib-glass-wrapper",
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
     * @param {Object} config
     * @param {Function} callback
     * @return {HTMLElement}
     */
    function show_glass(config, callback) {
        var glass = document.createElement("div"),
            glassStyle = glass.style,
            style;

        settings.container = document.body;
        settings = pklib.object.mixin(settings, config);
        settings.style.filter = "alpha(opacity=" + parseFloat(settings.style.opacity) * 100 + ")";

        glass.setAttribute("id", pklib.ui.glass.obj_id);

        for (style in settings.style) {
            if (settings.style.hasOwnProperty(style)) {
                glassStyle[style] = settings.style[style];
            }
        }

        settings.container.appendChild(glass);

        pklib.ui.maximize(glass, settings.container);

        pklib.event.add(global, "resize", function () {
            pklib.ui.glass.close();
            pklib.ui.glass.show(config, callback);
            pklib.ui.maximize(glass, settings.container);
        });

        if (typeof callback === "function") {
            callback();
        }

        return glass;
    }

    /**
     * @param {Function} callback
     * @return {boolean}
     */
    function close_glass(callback) {
        var glass = pklib.dom.by_id(pklib.ui.glass.obj_id),
            result = false;

        pklib.event.remove(global, "resize");

        if (glass !== null) {
            glass.parentNode.removeChild(glass);
            close_glass(callback);
            result = true;
        }

        if (typeof callback === "function") {
            callback();
        }

        return result;
    }

    // exports
    pklib.ui.glass = {
        obj_id: id,
        show: show_glass,
        close: close_glass
    };

}(this));

