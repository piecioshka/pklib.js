/**
 * Utils method related css on tags in DOM tree
 * @package pklib.css
 * @dependence pklib.string. pklib.dom
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {},
        rclass = /[\n\t\r]/g;

    /**
     * Check typeof params
     * @param cssClass {String}
     * @param element {HTMLElement}
     * @throws {TypeError}
     */
    function checkParams(cssClass, element, callFuncName) {
        var prefix = "pklib.css." + callFuncName;
        if (typeof cssClass !== "string") {
            throw new TypeError(prefix + ": @cssClass: not String");
        }
        if (!pklib.dom.isNode(element)) {
            throw new TypeError(prefix + ": @element: not HTMLElement");
        }
    }

    pklib.css = {
        /**
         * Add CSS class to element define in second parameter.
         * @param cssClass {String}
         * @param element {HTMLElement}
         * @throws {TypeError}
         */
        addClass: function addClass(cssClass, element) {
            checkParams(cssClass, element, "addClass");
            var classElement = element.className;
            if (!this.hasClass(cssClass, element)) {
                if (classElement.length) {
                    classElement += " " + cssClass;
                } else {
                    classElement = cssClass;
                }
            }
            element.className = classElement;
        },
        /**
         * Remove CSS class from element define in second parameter.
         * @param cssClass {String}
         * @param element {HTMLElement}
         * @throws {TypeError}
         */
        removeClass: function removeClass(cssClass, element) {
            checkParams(cssClass, element, "removeClass");
            var regexp = new RegExp("(\\s" + cssClass + ")|(" + cssClass + "\\s)|" + cssClass, "i");
            element.className = pklib.string.trim(element.className.replace(regexp, ""));
        },
        /**
         * Check if element has CSS class
         * @param cssClass {String}
         * @param element {HTMLElement}
         * @throws {TypeError}
         * @return {Boolean}
         */
        hasClass: function hasClass(cssClass, element) {
            checkParams(cssClass, element, "hasClass");
            var className = " " + cssClass + " ";
            return ((" " + element.className + " ").replace(rclass, " ").indexOf(className) > -1);
        }
    };
}(this));
