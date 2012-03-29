/**
 * @package pklib.css
 * @dependence pklib.string. pklib.dom
 */
(function (global) {
    "use strict";
    /** @namespace */
    var pklib = global.pklib || {},
        /**
         * RegExp use to delete white chars
         */
        rclass = /[\n\t\r]/g,
        /**
         * Check typeof params
         * @private
         * @function
         * @param {String} cssClass
         * @param {HTMLElement} element
         * @throws {TypeError} If first param is not string, or second param is not Node
         */
        checkParams = function (cssClass, element, callFuncName) {
            var prefix = "pklib.css." + callFuncName;
            if (typeof cssClass !== "string") {
                throw new TypeError(prefix + ": @cssClass: not String");
            }
            if (!pklib.dom.isNode(element)) {
                throw new TypeError(prefix + ": @element: not HTMLElement");
            }
        },
        /**
         * Utils method related css on tags in DOM tree
         * @namespace
         */
        css = {
            /**
             * Add CSS class to element define in second parameter
             * @memberOf css
             * @function
             * @param {String} cssClass
             * @param {HTMLElement} element
             * @throws {TypeError} If first param is not string, or second param is not Node
             */
            addClass: function (cssClass, element) {
                checkParams(cssClass, element, "addClass");
                var classElement = element.className;
                if (!pklib.css.hasClass(cssClass, element)) {
                    if (classElement.length) {
                        classElement += " " + cssClass;
                    } else {
                        classElement = cssClass;
                    }
                }
                element.className = classElement;
            },
            /**
             * Remove CSS class from element define in second parameter
             * @memberOf css
             * @function
             * @param {String} cssClass
             * @param {HTMLElement} element
             * @throws {TypeError} If first param is not string, or second param is not Node
             */
            removeClass: function (cssClass, element) {
                checkParams(cssClass, element, "removeClass");
                var regexp = new RegExp("(\\s" + cssClass + ")|(" + cssClass + "\\s)|" + cssClass, "i");
                element.className = pklib.string.trim(element.className.replace(regexp, ""));
            },
            /**
             * Check if element has CSS class
             * @memberOf css
             * @function
             * @param {String} cssClass
             * @param {HTMLElement} element
             * @throws {TypeError} If first param is not string, or second param is not Node
             * @returns {Boolean}
             */
            hasClass: function (cssClass, element) {
                checkParams(cssClass, element, "hasClass");
                var className = " " + cssClass + " ";
                return ((" " + element.className + " ").replace(rclass, " ").indexOf(className) > -1);
            }
        };

    pklib.css = css;
}(this));
