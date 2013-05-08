/**
 * @package pklib.css
 * @dependence pklib.string. pklib.dom
 */

/**
 * Utils method related css on tags in DOM tree
 */
pklib.css = (function () {
    "use strict";

    /**
     * RegExp use to delete white chars
     */
    var rclass = /[\n\t\r]/g;

    /**
     * Check typeof params
     *
     * @param {String} css_class
     * @param {HTMLElement} element
     * @throws {TypeError} If first param is not string, or second param is not Node
     */
    function check_params(css_class, element, call_func_name) {
        var prefix = "pklib.css." + call_func_name;
        pklib.common.assert(typeof css_class === "string", prefix + ": @css_class: not {String}");
        pklib.common.assert(pklib.dom.is_element(element), prefix + ": @element: not {HTMLElement}");
    }

    /**
     * Add CSS class to element define in second parameter
     *
     * @param {String} css_class
     * @param {HTMLElement} element
     * @throws {TypeError} If first param is not string, or second param is not Node
     */
    function add_class(css_class, element) {
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
    }

    /**
     * Remove CSS class from element define in second parameter
     *
     * @param {String} css_class
     * @param {HTMLElement} element
     * @throws {TypeError} If first param is not string, or second param is not Node
     */
    function remove_class(css_class, element) {
        check_params(css_class, element, "remove_class");
        var regexp = new RegExp("(\\s" + css_class + ")|(" + css_class + "\\s)|" + css_class, "i");
        element.className = pklib.string.trim(element.className.replace(regexp, ""));
    }

    /**
     * Check if element has CSS class
     *
     * @param {String} css_class
     * @param {HTMLElement} element
     * @throws {TypeError} If first param is not string, or second param is not Node
     * @returns {Boolean}
     */
    function has_class(css_class, element) {
        check_params(css_class, element, "has_class");
        var className = " " + css_class + " ";
        return ((" " + element.className + " ").replace(rclass, " ").indexOf(className) > -1);
    }

    // exports
    return {
        add_class: add_class,
        remove_class: remove_class,
        has_class: has_class
    };
}());
