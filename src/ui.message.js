/**
 * @package pklib.message
 * @dependence pklib.dom, pklib.event, pklib.string, pklib.utils
 */
(function (global) {
    "use strict";
    /** @namespace */
    var pklib = global.pklib || {},
        document = global.document || {},
        id = "pklib-message-wrapper",
        settings = {
            container: null,
            style: {
                width: 300,
                height: 300,
                zIndex: 1010
            }
        },
        /**
         * Show layer on special place.
         * @namespace
         */
        message = {
            /** @field */
            obj_id: id,
            /** @field */
            content: null,
            /**
             * @memberOf message
             * @function
             * @param {Object} config
             * @param {Function} callback
             * @returns {HTMLElement}
             */
            show: function (config, callback) {
                settings.container = document.body;
                settings = pklib.object.mixin(settings, config);

                var message = document.createElement("div"),
                    messageStyle = message.style,
                    style;

                message.setAttribute("id", this.obj_id);
                for (style in settings.style) {
                    if (settings.style.hasOwnProperty(style)) {
                        messageStyle[style] = settings.style[style];
                    }
                }

                pklib.dom.insert(this.content, message);

                settings.container.appendChild(message);
                pklib.ui.center(message, settings.container);

                pklib.event.add(global, "resize", function () {
                    pklib.ui.center(message, settings.container);
                });
                if (typeof callback === "function") {
                    callback();
                }
                return message;
            },
            /**
             * @memberOf message
             * @function
             * @param {Function} callback
             * @returns {Boolean}
             */
            close: function (callback) {
                var message = pklib.dom.by_id(this.obj_id),
                    result = false;
                if (message !== null) {
                    message.parentNode.removeChild(message);
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
    pklib.ui.message = message;
}(this));
