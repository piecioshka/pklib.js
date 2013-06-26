/**
 * @package pklib.ui.message
 * @dependence pklib.dom, pklib.event, pklib.string, pklib.utils
 */
(function (global) {
    "use strict";

    // imports
    var document = global.document;
    var pklib = (global.pklib = global.pklib || {});

    // private
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
     * @param {Object} config
     * @param {Function} callback
     * @return {HTMLElement}
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

        pklib.event.add(global, "resize", function () {
            pklib.ui.center(message, settings.container);
        });

        if (typeof callback === "function") {
            callback();
        }

        return message;
    }

    /**
     * @param {Function} callback
     * @return {boolean}
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

    // exports
    pklib.ui.message = {
        obj_id: id,

        content: null,

        show: show_message,
        close: close_message
    };

}(this));

