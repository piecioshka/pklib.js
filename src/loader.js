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

    var _center = function(obj, contener) {
        if (contener === doc.getElementsByTagName("body")[0]) {
            var left = (Math.max(pklib.utils.size.window("width"), pklib.utils.size.document("width")) - pklib.utils.size.obj(obj, "width")) / 2;
            var top = (Math.max(pklib.utils.size.window("height"), pklib.utils.size.document("height")) - pklib.utils.size.obj(obj, "height")) / 2;
            pklib.utils.scrollTo(top);
        } else {
            var left = (pklib.utils.size.obj(contener, "width") - pklib.utils.size.obj(obj, "width")) / 2;
            var top = (pklib.utils.size.obj(contener, "height") - pklib.utils.size.obj(obj, "height")) / 2;
        }
        obj.style.left = left + "px";
        obj.style.top = top + "px";
        obj.style.position = "absolute";
        return [ left, top ];
    };

    var obj = {
        objId : id,
        show : function(config, callback) {
            settings = pklib.utils.merge(settings, config);

            var loader = doc.createElement("img");
            var loaderStyle = loader.style;

            loader.setAttribute("id", obj.objId);
            loader.setAttribute("src", settings.src);
            for ( var style in settings.style) {
                loaderStyle[style] = settings.style[style];
            }
            if (settings.center) {
                _center(loader, settings.contener);

                pklib.utils.addEvent(window, "resize", function() {
                    _center(loader, settings.contener);
                });
            }

            settings.contener.appendChild(loader);

            (typeof callback === "function") && callback();

            delete loader;
        },
        close : function(callback) {
            var loader = doc.getElementById(obj.objId);
            var result = false;
            if (loader !== null) {
                loader.parentNode.removeChild(loader);
                obj.close(callback);
                result = true;
            }
            (typeof callback === "function") && callback();

            return result;
        }
    };

    return obj;

})();
