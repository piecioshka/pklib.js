/**
 * @package pklib.css
 * @dependence pklib.string. pklib.dom
 */
(function (global) {
    "use strict";

    // imports
    var pklib = (global.pklib = global.pklib || {});

    /**
     * RegExp use to delete white chars.
     */
    var rclass = /[\n\t\r]/g;

    /**
     * Check typeof params.
     * @param {string} css_class
     * @param {HTMLElement} element
     * @param {string} call_func_name
     * @throws {TypeError} If first param is not string, or second param is
     *     not Node.
     */
    function check_params(css_class, element, call_func_name) {
        var assert = pklib.common.assert;
        var is_element = pklib.dom.is_element;
        var prefix = "pklib.css." + call_func_name;
        assert(typeof css_class === "string", prefix + ": @css_class: not {string}");
        assert(is_element(element), prefix + ": @element: not {HTMLElement}");
    }

    /**
     * Check if element has CSS class.
     * @param {string} css_class
     * @param {HTMLElement} element
     * @throws {TypeError} If first param is not string, or second param is not
     *     Node
     * @return {boolean}
     */
    function has_class(css_class, element) {
        check_params(css_class, element, "has_class");
        var className = " " + css_class + " ";
        return ((" " + element.className + " ").replace(rclass, " ").indexOf(className) > -1);
    }

    /**
     * Add CSS class to element define in second parameter.
     * @param {string} css_class
     * @param {HTMLElement} element
     * @throws {TypeError} If first param is not string, or second param is
     *     not Node.
     */
    function add_class(css_class, element) {
        check_params(css_class, element, "add_class");
        var class_element = element.className;
        if (!has_class(css_class, element)) {
            if (class_element.length) {
                class_element += " " + css_class;
            } else {
                class_element = css_class;
            }
        }
        element.className = class_element;
    }

    /**
     * Remove CSS class from element define in second parameter.
     * @param {string} css_class
     * @param {HTMLElement} element
     * @throws {TypeError} If first param is not string, or second param is
     *     not Node.
     */
    function remove_class(css_class, element) {
        check_params(css_class, element, "remove_class");
        var regexp = new RegExp("(\\s" + css_class + ")|(" + css_class + "\\s)|" + css_class, "i");
        element.className = pklib.string.trim(element.className.replace(regexp, ""));
    }

    // exports
    pklib.css = {
        add_class: add_class,
        remove_class: remove_class,
        has_class: has_class
    };

}(this));
