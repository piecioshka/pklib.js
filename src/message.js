/**
 * Show layer on special place.
 * @package message
 * @dependence dom, event, utils
 */

(function (win) {
    "use strict";

    var pklib = win.pklib || {},
        document = win.document || {},
        id = "pklib-message-wrapper",
        contents = null,
        settings = {
            container: null,
            style: {
                width: 300,
                height: 300,
                zIndex: 1010
            }
        };

    pklib.message = {
        objId: id,
        content: contents,
        /**
         * @param config {Object}
         * @param callback {Function}
         */
        show: function (config, callback) {
            settings.container = document.body;
            settings = pklib.array.mixin(settings, config);

            var message = document.createElement("div"),
                messageStyle = message.style,
                style;

            message.setAttribute("id", this.objId);
            for (style in settings.style) {
                if (settings.style.hasOwnProperty(style)) {
                    messageStyle[style] = settings.style[style];
                }
            }

            if (typeof this.content === "string") {
                message.innerHTML = this.content;
            } else if (pklib.dom.isNode(this.content)) {
                message.appendChild(this.content);
            }

            settings.container.appendChild(message);

            pklib.dom.center(message, settings.container);

            pklib.event.add(win, "resize", function () {
                pklib.dom.center(message, settings.container);
            });
            if (typeof callback === "function") {
                callback();
            }

            return message;
        },
        /**
         * @param callback {Function}
         */
        close: function (callback) {
            var message = pklib.dom.byId(this.objId),
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
}(this));
