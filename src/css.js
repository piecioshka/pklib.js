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
         * @type RegExp
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
        check_params = function (cssClass, element, callFuncName) {
            var prefix = "pklib.css." + callFuncName;
            pklib.common.assert(typeof cssClass === "string", prefix + ": @cssClass: not {String}");
            pklib.common.assert(pklib.dom.is_node(element), prefix + ": @element: not {HTMLElement}");
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
            add_class: function (cssClass, element) {
                check_params(cssClass, element, "add_class");
                var classElement = element.className;
                if (!pklib.css.has_class(cssClass, element)) {
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
            remove_class: function (cssClass, element) {
                check_params(cssClass, element, "remove_class");
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
            has_class: function (cssClass, element) {
                check_params(cssClass, element, "has_class");
                var className = " " + cssClass + " ";
                return ((" " + element.className + " ").replace(rclass, " ").indexOf(className) > -1);
            }
        };

    pklib.css = css;
}(this));
