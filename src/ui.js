/**
 * @package pklib.ui
 * @dependence pklib.string. pklib.dom
 */
(function (global) {
    "use strict";
    /** @namespace */
    var pklib = global.pklib || {},
        document = global.document || {};

    /**
     * User Interface
     * @namespace
     */
    pklib.ui = {
        /**
         * @memberOf pklib.ui
         * @function
         * @param {HTMLElement} element
         * @param {HTMLElement} wrapper
         * @throws {TypeError} If first param is not HTMLElement
         * @returns {Array}
         */
        center: function (element, wrapper) {
            var left = null,
                top = null,
                pus = this.size;

            pklib.common.assert(pklib.dom.is_element(element), "pklib.ui.center: @element: not {HTMLElement}");

            if (wrapper === document.body) {
                left = (Math.max(pus.window("width"), pus.document("width")) - pus.object(element, "width")) / 2;
                top = (Math.max(pus.window("height"), pus.document("height")) - pus.object(element, "height")) / 2;
            } else {
                left = (pus.window("width") - pus.object(element, "width")) / 2;
                top = (pus.window("height") - pus.object(element, "height")) / 2;
            }
            element.style.left = left + "px";
            element.style.top = top + "px";
            element.style.position = "absolute";

            return [left, top];
        },
        /**
         * @memberOf pklib.ui
         * @function
         * @param {HTMLElement} element
         * @param {HTMLElement} wrapper
         * @returns {Array}
         */
        maximize: function (element, wrapper) {
            var width = null,
                height = null,
                pus = pklib.ui.size;

            if (wrapper === document.body) {
                width = Math.max(pus.window("width"), pus.document("width"));
                height = Math.max(pus.window("height"), pus.document("height"));
                if (pklib.browser.get_name() === "msie") {
                    width -= 20;
                }
            } else {
                width = pus.object(wrapper, "width");
                height = pus.object(wrapper, "height");
            }
            element.style.width = width;
            element.style.height = height;
            return [width, height];
        },
        /**
         * @memberOf pklib.ui
         * @function
         * @param {Number} param
         * @param {Boolean} animate
         */
        scroll_to: function (param, animate) {
            var interval = null;
            if (animate) {
                interval = setInterval(function () {
                    document.body.scroll_top -= 5;
                    if (document.body.scroll_top <= 0) {
                        clearInterval(interval);
                    }
                }, 1);
            } else {
                document.body.scroll_top = param + "px";
            }
        }
    };
}(this));
