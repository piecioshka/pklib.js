/**
 * @package pklib.message
 * @dependence pklib.utils
 */
pklib = this.pklib || {};
pklib.message = (function() {

    var doc = document, 
        id = "pklib-message-wrapper", 
        contents = null, 
        settings = {
            contener : doc.getElementsByTagName("body")[0],
            style : {
                width : 300,
                height : 300,
                zIndex : 1010
            }
        };

    var __message = {
        objId : id,
        content : contents,
        show : function(config, callback) {
            settings = pklib.utils.merge(settings, config);

            var message = doc.createElement("div");
            var messageStyle = message.style;

            message.setAttribute("id", this.objId);
            for ( var style in settings.style) {
                messageStyle[style] = settings.style[style];
            }

            if (typeof this.content === "string") {
                message.innerHTML = this.content;
            } else if (typeof this.content === "object") {
                message.appendChild(this.content);
            }

            settings.contener.appendChild(message);

            pklib.utils.dom.center(message, settings.contener);

            pklib.utils.event.add(window, "resize", function() {
                pklib.utils.dom.center(message, settings.contener);
            });

            (typeof callback === "function") && callback();

            return message;
        },
        close : function(callback) {
            var message = doc.getElementById(this.objId);
            var result = false;
            
            if (message !== null) {
                message.parentNode.removeChild(message);
                this.close(callback);
                result = true;
            }
            
            (typeof callback === "function") && callback();

            return result;
        }
    };

    return __message;

})();
