/**
 * @module pklib.ui.loader
 * @requires pklib.dom, pklib.event, pklib.utils
 */
(function (global) {
    "use strict";

    // imports
    var document = global.document;
    var pklib = (global.pklib = global.pklib || {});

    var id = "pklib-loader-wrapper",
        settings = {
            src: "",
            container: null,
            style: {
                width: 31,
                height: 31,
                zIndex: 1010
            },
            center: true
        };

    /**
     * @param {object} config
     * @param {function} callback
     */
    function show_loader(config, callback) {
        var loader = document.createElement("img"),
            loaderStyle = loader.style,
            style;

        settings.container = document.body;
        settings = pklib.object.mixin(settings, config);

        loader.setAttribute("id", pklib.ui.loader.obj_id);
        loader.setAttribute("src", settings.src);

        for (style in settings.style) {
            if (settings.style.hasOwnProperty(style)) {
                loaderStyle[style] = settings.style[style];
            }
        }

        if (settings.center) {
            pklib.ui.center(loader, settings.container);

            pklib.event.add(global, "resize", function () {
                pklib.ui.center(loader, settings.container);
            });
        }

        settings.container.appendChild(loader);

        if (typeof callback === "function") {
            callback();
        }
        // clear memory
        loader = null;
    }

    /**
     * @param {Function} callback
     * @return {boolean}
     */
    function close_loader(callback) {
        var loader = pklib.dom.by_id(pklib.ui.loader.obj_id),
            result = false;

        if (loader !== null) {
            loader.parentNode.removeChild(loader);
            close_loader(callback);
            result = true;
        }

        if (typeof callback === "function") {
            callback();
        }
        return result;
    }

    // exports
    pklib.ui.loader = {
        obj_id: id,
        show: show_loader,
        close: close_loader
    };

}(this));
