/**
 * @package glass
 * @dependence browser, dom, event, utils
 */
pklib = this.pklib || {};
pklib.glass = (function() {

    var doc = document;
    var id = "pklib-glass-wrapper";
    var settings = {
        container : doc.body,
        style : {
            position : "absolute",
            left : 0,
            top : 0,
            background : "#000",
            opacity : 0.5,
            zIndex : 1000
        }
    };

    return {

        /**
         * @type string
         */
        objId : id,

        /**
         * @param {object} config
         * @param {function} callback
         */
        show : function(config, callback) {
            var that = this;
            settings = pklib.utils.merge(settings, config);
            settings.style.filter = "alpha(opacity=" + parseFloat(settings.style.opacity, 10) * 100 + ")";

            var glass = doc.createElement("div");
            var glassStyle = glass.style;

            glass.setAttribute("id", this.objId);
            for(var style in settings.style) {
                if(settings.style.hasOwnProperty(style)) {
                    glassStyle[style] = settings.style[style];
                }
            }

            settings.container.appendChild(glass);

            pklib.dom.maximize(glass, settings.container);

            pklib.event.add(window, "resize", function() {
                that.close();
                that.show(config, callback);
                pklib.dom.maximize(glass, settings.container);
            });
            ( typeof callback === "function") && callback();

            return glass;
        },
        /**
         * @param {function} callback
         * @return {boolean}
         */
        close : function(callback) {
            var glass = pklib.dom.byId(this.objId);
            var result = false;
            if(glass !== null) {
                glass.parentNode.removeChild(glass);
                arguments.callee(callback);
                result = true;
            }( typeof callback === "function") && callback();

            return result;
        }
    };
    
})();
