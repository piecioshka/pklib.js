/**
 * @package pklib.ui
 * @dependence pklib.string. pklib.dom
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {};

    pklib.ui = {
        /**
         * @param element {HTMLElement}
         * @param wrapper {HTMLElement}
         * @throws {TypeError}
         * @return {Array}
         */
        center: function (element, wrapper) {
            var left = null,
                top = null,
                pus = this.size;

            if (!pklib.dom.isElement(element)) {
                throw new TypeError("pklib.ui.center: @element: not Element");
            }

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
         * @param element {HTMLElement}
         * @param wrapper {HTMLElement}
         * @return {Array}
         */
        maximize: function (element, wrapper) {
            var width = null,
                height = null,
                pus = pklib.ui.size;

            if (wrapper === document.body) {
                width = Math.max(pus.window("width"), pus.document("width"));
                height = Math.max(pus.window("height"), pus.document("height"));
                if (pklib.browser.getName() === "msie") {
                    width -= 20;
                }
            } else {
                width = pus.object(wrapper, "width");
                height = pus.object(wrapper, "height");
            }
            element.style.width = width;
            element.style.height = height;
            return [width, height];
        }
    };
}(this));