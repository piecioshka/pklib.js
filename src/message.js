/**
 * @package message
 * @dependence dom, event, utils
 */
pklib = this.pklib || {};

/**
 * Show layer on special place.
 */
pklib.message = (function () {

    var doc = document,
        id = "pklib-message-wrapper",
        contents = null,
        settings = {
            container: doc.body,
            style: {
                width: 300,
                height: 300,
                zIndex: 1010
            }
        };

    return {
        objId: id,
        content: contents,
        show: function (config, callback) {
            settings = pklib.array.mixin(settings, config);

            var message = doc.createElement("div"),
                messageStyle = message.style;

            message.setAttribute("id", this.objId);
            for(var style in settings.style) {
                if (settings.style.hasOwnProperty(style)) {
                    messageStyle[style] = settings.style[style];
                }
            }

            if (typeof this.content === "string") {
                message.innerHTML = this.content;
            } else if (typeof this.content === "object") {
                message.appendChild(this.content);
            }

            settings.container.appendChild(message);

            pklib.dom.center(message, settings.container);

            pklib.event.add(window, "resize", function () {
                pklib.dom.center(message, settings.container);
            }); 
            
            (typeof callback === "function") && callback();

            return message;
        },
        
        close: function (callback) {
            var message = pklib.dom.byId(this.objId),
                result = false;

            if (message !== null) {
                message.parentNode.removeChild(message);
                this.close(callback);
                result = true;
            }
            
            (typeof callback === "function") && callback();

            return result;
        }
    };

})();
