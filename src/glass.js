/**
 * @package pklib.glass
 * @dependence pklib.utils, pklib.browser
 */
pklib = this.pklib || {};
pklib.glass = (function() {

    var doc = document, 
        id = "pklib-glass-wrapper", 
        settings = {
            contener : doc.getElementsByTagName("body")[0],
            style : {
                position : 'absolute',
                left : 0,
                top : 0,
                background : '#000',
                opacity : 0.5,
                zIndex : 1000
            }
        };

    var _fill = function(obj, contener) {
        if (contener === doc.getElementsByTagName("body")[0]) {
            var width = Math.max(pklib.utils.size.window("width"), pklib.utils.size.document("width"));
            var height = Math.max(pklib.utils.size.window("height"), pklib.utils.size.document("height"));
            if (pklib.browser.getName() === "msie") {
                width -= 20;
            }
        } else {
            var width = pklib.utils.size.obj(contener, "width");
            var height = pklib.utils.size.obj(contener, "height");
        }
        obj.style.width = width;
        obj.style.height = height;
        return [ width, height ];
    };

    var __glass = {
        objId : id,
        show : function(config, callback) {
            settings = pklib.utils.merge(settings, config);
            settings.style.filter = 'alpha(opacity=' + parseFloat(settings.style.opacity, 10) * 100 + ')';

            var glass = doc.createElement("div");
            var glassStyle = glass.style;

            glass.setAttribute("id", __glass.objId);
            for ( var style in settings.style) {
                glassStyle[style] = settings.style[style];
            }

            if (typeof __glass.content === "string") {
                glass.innerHTML = __glass.content;
            } else if (typeof __glass.content === "object") {
                glass.appendChild(__glass.content);
            }

            settings.contener.appendChild(glass);

            _fill(glass, settings.contener);

            pklib.utils.event.add(window, "resize", function() {
                __glass.close();
                __glass.show(config, callback);
                _fill(glass, settings.contener);
            });

            (typeof callback === "function") && callback();

            return glass;
        },
        close : function(callback) {
            var glass = doc.getElementById(__glass.objId);
            var result = false;
            if (glass !== null) {
                glass.parentNode.removeChild(glass);
                __glass.close(callback);
                result = true;
            }
            (typeof callback === "function") && callback();

            return result;
        }
    };

    return __glass;

})();
