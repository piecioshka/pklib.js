/**
 * @package loader
 * @dependence dom, event, utils
 */
pklib = this.pklib || {};

/**
 * Loader adapter.
 * Show animate image (GIF) on special place.
 */
pklib.loader = (function () {

    var doc = document,
        id = "pklib-loader-wrapper",
        settings = {
            src: "http://pklib.com/img/icons/loader.gif",
            container: null,
            style: {
                width: 31,
                height: 31,
                zIndex: 1010
            },
            center: true
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
            settings.container = doc.body;
            settings = pklib.array.mixin(settings, config);

            var loader = doc.createElement("img"),
                loaderStyle = loader.style;

            loader.setAttribute("id", this.objId);
            loader.setAttribute("src", settings.src);
            
            for(var style in settings.style) {
                if (settings.style.hasOwnProperty(style)) {
                    loaderStyle[style] = settings.style[style];
                }
            }
            
            if (settings.center) {
                pklib.dom.center(loader, settings.container);

                pklib.event.add(window, "resize", function () {
                    pklib.dom.center(loader, settings.container);
                });
            }

            settings.container.appendChild(loader); 
            
            (typeof callback === "function") && callback();
            
            delete loader;
        },
        
        /**
         * @param {function} callback
         */
        close: function (callback) {
            var loader = pklib.dom.byId(this.objId),
                result = false;
                
            if (loader !== null) {
                loader.parentNode.removeChild(loader);
                this.close(callback);
                result = true;
            }
            
            (typeof callback === "function") && callback();

            return result;
        }
    };

})();
