/**
 * @package pklib.glass
 * @dependence pklib.utils, pklib.browser
 */
pklib = this.pklib || {};
pklib.glass = (function() {

    var doc = document, 
        id = "pklib-glass-wrapper", 
        settings = {
            contener : doc.body,
            style : {
                position : "absolute",
                left : 0,
                top : 0,
                background : "#000",
                opacity : 0.5,
                zIndex : 1000
            }
        };

    var __glass = {
    
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
            for ( var style in settings.style) {
                if(settings.style.hasOwnProperty(style)){
                    glassStyle[style] = settings.style[style];
                }
            }

            settings.contener.appendChild(glass);

            pklib.utils.dom.maximize(glass, settings.contener);

            pklib.utils.event.add(window, "resize", function() {
                that.close();
                that.show(config, callback);
                pklib.utils.dom.maximize(glass, settings.contener);
            });

            (typeof callback === "function") && callback();

            return glass;
        },
        
        /**
         * @param {function} callback
         * @return {boolean}
         */ 
        close : function(callback) {
            var glass = pklib.utils.dom.byId(this.objId);
            var result = false;
            if (glass !== null) {
                glass.parentNode.removeChild(glass);
                arguments.callee(callback);
                result = true;
            }
            
            (typeof callback === "function") && callback();

            return result;
        }
        
    };

    return __glass;

})();
