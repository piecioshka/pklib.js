/**
 * @package pklib.ui.message
 * @dependence pklib.dom, pklib.event, pklib.string, pklib.utils
 */

/**
 * Show layer on special place.
 * @namespace
 */
pklib.ui.message = (function () {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var id = "pklib-message-wrapper",
        settings = {
            container: null,
            style: {
                width: 300,
                height: 300,
                zIndex: 1010
            }
        };

    /**
     * @private
     * @function
     * @param {Object} config
     * @param {Function} callback
     * @returns {HTMLElement}
     */
    function show_message(config, callback) {
        var message = document.createElement("div"),
            messageStyle = message.style,
            style;

        settings.container = document.body;
        settings = pklib.object.mixin(settings, config);

        message.setAttribute("id", pklib.ui.message.obj_id);

        for (style in settings.style) {
            if (settings.style.hasOwnProperty(style)) {
                messageStyle[style] = settings.style[style];
            }
        }

        pklib.dom.insert(pklib.ui.message.content, message);

        settings.container.appendChild(message);
        pklib.ui.center(message, settings.container);

        pklib.event.add(window, "resize", function () {
            pklib.ui.center(message, settings.container);
        });

        if (typeof callback === "function") {
            callback();
        }

        return message;
    }

    /**
     * @private
     * @function
     * @param {Function} callback
     * @returns {Boolean}
     */
    function close_message(callback) {
        var message = pklib.dom.by_id(pklib.ui.message.obj_id),
            result = false;

        if (message !== null) {
            message.parentNode.removeChild(message);
            close_message(callback);
            result = true;
        }

        if (typeof callback === "function") {
            callback();
        }

        return result;
    }

    // public API
    return {
        /**
         * @memberOf pklib.ui.glass
         * @type {String}
         */
        obj_id: id,

        /**
         * @memberOf pklib.ui.glass
         * @type {HTMLElement}
         */
        content: null,

        show: show_message,
        close: close_message
    };
}());

