/**
 * @package pklib.loader
 * @dependence pklib.utils
 */
pklib = this.pklib || {};
pklib.loader = (function() {

    var doc = document, 
        id = "pklib-loader-wrapper", 
        settings = {
            src : 'http://pklib.com/img/icons/loader.gif',
            contener : doc.getElementsByTagName("body")[0],
            style : {
                width : 31,
                height : 31,
                zIndex : 1010
            },
            center : true
        };

    var __loader = {
    
        /**
         * @type string
         */ 
        objId : id,
        
        /**
         * @param {object} config
         * @param {function} callback
         */
        show : function(config, callback) {
            settings = pklib.utils.merge(settings, config);

            var loader = doc.createElement("img");
            var loaderStyle = loader.style;

            loader.setAttribute("id", this.objId);
            loader.setAttribute("src", settings.src);
            for ( var style in settings.style) {
                loaderStyle[style] = settings.style[style];
            }
            if (settings.center) {
                pklib.utils.dom.center(loader, settings.contener);

                pklib.utils.event.add(window, "resize", function() {
                    pklib.utils.dom.center(loader, settings.contener);
                });
            }

            settings.contener.appendChild(loader);

            (typeof callback === "function") && callback();

            delete loader;
        },
        
        /**
         * @param {function} callback
         */
        close : function(callback) {
            var loader = doc.getElementById(this.objId);
            var result = false;
            if (loader !== null) {
                loader.parentNode.removeChild(loader);
                this.close(callback);
                result = true;
            }

            (typeof callback === "function") && callback();

            return result;
        }
        
    };

    return __loader;

})();
