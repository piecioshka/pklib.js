/**
 * @package pklib.css
 * @dependence pklib.string. pklib.dom
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {},
        /**
         * RegExp use to delete white chars
         * @private
         * @type {RegExp}
         */
        rclass = /[\n\t\r]/g,

        /**
         * Check typeof params
         * @private
         * @function
         * @param {String} css_class
         * @param {HTMLElement} element
         * @throws {TypeError} If first param is not string, or second param is not Node
         */
        check_params = function (css_class, element, call_func_name) {
            var prefix = "pklib.css." + call_func_name;
            pklib.common.assert(typeof css_class === "string", prefix + ": @css_class: not {String}");
            pklib.common.assert(pklib.dom.is_element(element), prefix + ": @element: not {HTMLElement}");
        };

    /**
     * Utils method related css on tags in DOM tree
     * @namespace
     */
    pklib.css = {
        /**
         * Add CSS class to element define in second parameter
         * @memberOf pklib.css
         * @function
         * @param {String} css_class
         * @param {HTMLElement} element
         * @throws {TypeError} If first param is not string, or second param is not Node
         */
        add_class: function (css_class, element) {
            check_params(css_class, element, "add_class");
            var class_element = element.className;
            if (!pklib.css.has_class(css_class, element)) {
                if (class_element.length) {
                    class_element += " " + css_class;
                } else {
                    class_element = css_class;
                }
            }
            element.className = class_element;
        },

        /**
         * Remove CSS class from element define in second parameter
         * @memberOf pklib.css
         * @function
         * @param {String} css_class
         * @param {HTMLElement} element
         * @throws {TypeError} If first param is not string, or second param is not Node
         */
        remove_class: function (css_class, element) {
            check_params(css_class, element, "remove_class");
            var regexp = new RegExp("(\\s" + css_class + ")|(" + css_class + "\\s)|" + css_class, "i");
            element.className = pklib.string.trim(element.className.replace(regexp, ""));
        },

        /**
         * Check if element has CSS class
         * @memberOf pklib.css
         * @function
         * @param {String} css_class
         * @param {HTMLElement} element
         * @throws {TypeError} If first param is not string, or second param is not Node
         * @returns {Boolean}
         */
        has_class: function (css_class, element) {
            check_params(css_class, element, "has_class");
            var className = " " + css_class + " ";
            return ((" " + element.className + " ").replace(rclass, " ").indexOf(className) > -1);
        }
    };

}(this));
