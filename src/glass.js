/**
 * @package glass
 * @dependence browser, dom, event, utils
 */
pklib = this.pklib || {};

/**
 * Glass Adapter.
 * Show this on dimensions on browser. 
 */
pklib.glass = (function () {

    var doc = document,
        id = "pklib-glass-wrapper",
        settings = {
            container: doc.body,
            style: {
                position: "absolute",
                left: 0,
                top: 0,
                background: "#000",
                opacity: 0.5,
                zIndex: 1000
            }
        };

    return {

        /**
         * @type string
         */
        objId: id,

        /**
         * @param {object} config
         * @param {function} callback
         */
        show: function (config, callback) {
            var that = this,
                glass = doc.createElement("div"),
                glassStyle = glass.style;
                
            settings = pklib.array.mixin(settings, config);
            settings.style.filter = "alpha(opacity=" + parseFloat(settings.style.opacity, 10) * 100 + ")";

            glass.setAttribute("id", this.objId);
            for(var style in settings.style) {
                if (settings.style.hasOwnProperty(style)) {
                    glassStyle[style] = settings.style[style];
                }
            }

            settings.container.appendChild(glass);

            pklib.dom.maximize(glass, settings.container);

            pklib.event.add(window, "resize", function () {
                that.close();
                that.show(config, callback);
                pklib.dom.maximize(glass, settings.container);
            });
            
            (typeof callback === "function") && callback();

            return glass;
        },
        
        /**
         * @param {function} callback
         * @return {boolean}
         */
        close: function (callback) {
            var glass = pklib.dom.byId(this.objId),
                result = false;
                
            if (glass !== null) {
                glass.parentNode.removeChild(glass);
                arguments.callee(callback);
                result = true;
            }
            
            (typeof callback === "function") && callback();

            return result;
        }
    };
    
})();
