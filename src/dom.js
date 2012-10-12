/**
 * @package pklib.dom
 * @dependence pklib.browser, pklib.css, pklib.string, pklib.utils
 */

/**
 * Helper related with DOM service
 * @namespace
 */
pklib.dom = (function () {
    "use strict";

    /**
     * Types of all available node
     */
    var node_types = {
        "ELEMENT_NODE": 1,
        "ATTRIBUTE_NODE": 2,
        "TEXT_NODE": 3,
        "CDATA_SECTION_NODE": 4,
        "ENTITY_REFERENCE_NODE": 5,
        "ENTITY_NODE": 6,
        "PROCESSING_INSTRUCTION_NODE": 7,
        "COMMENT_NODE": 8,
        "DOCUMENT_NODE": 9,
        "DOCUMENT_TYPE_NODE": 10,
        "DOCUMENT_FRAGMENT_NODE": 11,
        "NOTATION_NODE": 12
    };

    /**
     * Walking on every node in node
     *
     * @private
     * @function
     * @param {HTMLElement} node
     * @param {Function} func Run on every node
     */
    function walk_the_dom(node, func) {
        if (!!node) {
            func(node);
            node = node.firstChild;
            while (node) {
                walk_the_dom(node, func);
                node = node.nextSibling;
            }
        }
    }

    /**
     * Check if param is Node, with use assertions
     *
     * @private
     * @function
     * @param {Node} node
     * @returns {String}
     */
    function is_node(node) {
        try {
            pklib.common.assert(Boolean(node && node.nodeType && node.nodeName));
            pklib.common.assert(Object.prototype.toString.call(node) === "[object Node]");
            return true;
        } catch (ignore) {
            return false;
        }
    }

    /**
     * Check if param is NodeList, with use assertions
     *
     * @private
     * @function
     * @param {NodeList} node_list
     * @returns {String}
     */
    function is_node_list(node_list) {
        try {
            var to_string = Object.prototype.toString.call(node_list),
                list = ["[object HTMLCollection]", "[object NodeList]"];

            pklib.common.assert(pklib.array.in_array(to_string, list));
            return true;
        } catch (ignore) {
            return false;
        }
    }

    /**
     * Check if param is instanceOf Element
     *
     * @private
     * @function
     * @param {HTMLElement} node
     * @returns {String}
     */
    function is_element(node) {
        return (node && node.nodeType === node_types.ELEMENT_NODE) || false;
    }

    /**
     * Check visibility of Node, with use assertions
     *
     * @private
     * @function
     * @param {HTMLElement} node
     * @returns {Boolean}
     */
    function is_visible(node) {
        pklib.common.assert(pklib.dom.is_element(node), "pklib.dom.is_visible: @node is not HTMLElement");

        return node.style.display !== "none" &&
            node.style.visibility !== "hidden" &&
            node.offsetWidth !== 0 &&
            node.offsetHeight !== 0;
    }

    /**
     * Get element by attribute ID
     *
     * @private
     * @function
     * @param {String} id
     * @returns {HTMLElement|Null}
     */
    function by_id(id) {
        return document.getElementById(id);
    }

    /**
     * Get elements by tag name
     *
     * @private
     * @function
     * @param {String} tag
     * @param {Element} [element]
     * @returns {NodeList}
     */
    function by_tag(tag, element) {
        element = element || document;
        return element.getElementsByTagName(tag);
    }

    /**
     * Get elements by attribute CLASS
     *
     * @private
     * @function
     * @param {String} css_class
     * @param {HTMLElement} [wrapper]
     * @returns {Array}
     */
    function by_class(css_class, wrapper) {
        var results = [];

        wrapper = wrapper || document;

        walk_the_dom(wrapper, function (node) {
            if (pklib.dom.is_element(node) && pklib.css.has_class(css_class, node)) {
                results.push(node);
            }
        });

        return results;
    }

    /**
     * Get index of node relative siblings
     *
     * @private
     * @function
     * @param {HTMLElement} node
     * @returns {Number|Null}
     */
    function index(node) {
        var i,
            parent = pklib.dom.parent(node),
            childs = pklib.dom.children(parent),
            len = childs.length;

        for (i = 0; i < len; ++i) {
            if (childs[i] === node) {
                return i;
            }
        }
        return null;
    }

    /**
     * Get children of element filter by Element type
     *
     * @private
     * @function
     * @param {HTMLElement} node
     * @returns {Array}
     */
    function children(node) {
        var i,
            array = [],
            childs = node.childNodes,
            len = childs.length;

        for (i = 0; i < len; ++i) {
            if (pklib.dom.is_element(childs[i])) {
                array.push(childs[i]);
            }
        }
        return array;
    }

    /**
     * Insert data to Node. Maybe param is string so insert will be exec by innerHTML,
     * but if param is Node inserting will be by appendChild() function
     *
     * @private
     * @function
     * @param {HTMLElement|String} element
     * @param {HTMLElement} node
     * @returns {HTMLElement}
     */
    function insert(element, node) {
        if (pklib.dom.is_element(element)) {
            node.appendChild(element);
        } else if (pklib.string.is_string(element)) {
            node.innerHTML += element;
        }
        return element;
    }

    /**
     * Remove Element specified in params
     *
     * @private
     * @function
     * @param {HTMLElement}
     */
    function remove() {
        var i, node = null, parent = null,
            args = Array.prototype.slice.call(arguments),
            len = args.length;

        for (i = 0; i < len; ++i) {
            node = args[i];
            if (pklib.dom.is_element(node)) {
                parent = node.parentNode;
                parent.removeChild(node);
            }
        }
    }

    /**
     * Get prev Node what will be Element
     *
     * @private
     * @function
     * @param {HTMLElement} node
     * @returns {HTMLElement|Null}
     */
    function prev(node) {
        var pNode;
        while (true) {
            pNode = node.previousSibling;
            if (pNode !== undefined &&
                    pNode !== null &&
                    pNode.nodeType !== node_types.ELEMENT_NODE) {
                node = pNode;
            } else {
                break;
            }
        }
        return pNode;
    }

    /**
     * Get next Node what will be Element
     *
     * @private
     * @function
     * @param {HTMLElement} node
     * @returns {HTMLElement|Null}
     */
    function next(node) {
        var nNode;
        while (true) {
            nNode = node.nextSibling;
            if (nNode !== undefined &&
                    nNode !== null &&
                    nNode.nodeType !== node_types.ELEMENT_NODE) {
                node = nNode;
            } else {
                break;
            }
        }
        return nNode;
    }

    /**
     * Get parent element what will by Element, but if parent is not exists returns Null
     *
     * @private
     * @function
     * @param {HTMLElement} node
     * @returns {HTMLElement|Null}
     */
    function parent(node) {
        var prNode;
        while (true) {
            prNode = node.parentNode;
            if (prNode !== undefined &&
                    prNode !== null &&
                    prNode.nodeType !== node_types.ELEMENT_NODE) {
                node = prNode;
            } else {
                break;
            }
        }
        return prNode;
    }

    // public API
    return {
        is_node: is_node,
        is_node_list: is_node_list,
        is_element: is_element,
        is_visible: is_visible,
        by_id: by_id,
        by_tag: by_tag,
        by_class: by_class,
        index: index,
        children: children,
        insert: insert,
        remove: remove,
        prev: prev,
        next: next,
        parent: parent
    };
}());
