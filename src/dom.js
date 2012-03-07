/**
 * Helper related with DOM service
 * @package pklib.dom
 * @dependence pklib.browser, pklib.css, pklib.string, pklib.utils
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {},
        document = global.document || {};

    /**
     * Walking on every element in node
     * @param node {Node}
     * @param func {Function}
     * @return
     */
    function walkTheDom(node, func) {
        if (!!node) {
            func(node);
            node = node.firstChild;
            while (node) {
                walkTheDom(node, func);
                node = node.nextSibling;
            }
        }
    }

    pklib.dom = {
        /**
         * Types of all available node
         */
        nodeTypes: {
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
        },
        /**
         * @param node {Node}
         * @return {String}
         */
        isNode: function isNode(node) {
            return pklib.common.assert(Boolean(node && node.nodeType && node.nodeName), true);
        },
        /**
         * @param node {Node}
         * @return {String}
         */
        isElement: function isElement(node) {
            return (node && node.nodeType === this.nodeTypes.ELEMENT_NODE) || false;
        },
        /**
         * @param id {String}
         * @return {HTMLElement | Null}
         */
        byId: function byId(id) {
            return document.getElementById(id);
        },
        /**
         * @param tag {String}
         * @param element {Element}
         * @return {NodeList}
         */
        byTag: function byTag(tag, element) {
            element = element || document;
            return element.getElementsByTagName(tag);
        },
        /**
         * @param cssClass {String}
         * @param wrapper {HTMLElement}
         * @return {NodeList | Array}
         */
        byClass: function byClass(cssClass, wrapper) {
            wrapper = wrapper || document;
            var results = [];
            if (wrapper.getElementsByClassName) {
                return wrapper.getElementsByClassName(cssClass);
            } else {
                walkTheDom(wrapper, function (node) {
                    if (pklib.css.hasClass(cssClass, node)) {
                        results.push(node);
                    }
                });
                return results;
            }
        },
        /**
         * Get element from selector
         * @param {String} selector
         * @return {NodeList | Array}
         */
        get: function get(selector) {
            if (document.querySelectorAll) {
                return document.querySelectorAll(selector);
            }
            return [];
        },
        /**
         * @param node {Node}
         * @return {Number | Null}
         */
        index: function index(node) {
            var i,
                parent = this.parent(node),
                childs = this.children(parent),
                len = childs.length;

            for (i = 0; i < len; ++i) {
                if (childs[i] === node) {
                    return i;
                }
            }
            return null;
        },
        /**
         * @param node {Node}
         * @return {Array}
         */
        children: function children(node) {
            var i,
                array = [],
                childs = node.childNodes,
                len = childs.length;

            for (i = 0; i < len; ++i) {
                if (this.isElement(childs[i])) {
                    array.push(childs[i]);
                }
            }
            return array;
        },
        /**
         * @param element {HTMLElement}
         * @param node {Node}
         * @return {HTMLElement}
         */
        insert: function insert(element, node) {
            if (this.isNode(element)) {
                node.appendChild(element);
            } else if (pklib.string.isString(element)) {
                node.innerHTML += element;
            }
            return element;
        },
        /**
         * @param {Node}
         */
        remove: function remove() {
            var i, node = null, parent = null,
                args = Array.prototype.slice.call(arguments),
                len = args.length;

            for (i = 0; i < len; ++i) {
                node = args[i];
                if (this.isNode(node)) {
                    parent = node.parentNode;
                    parent.removeChild(node);
                }
            }
        },
        /**
         * @param node {HTMLElement}
         * @return {HTMLElement | Null}
         */
        prev: function prev(node) {
            var pNode;
            while (true) {
                pNode = node.previousSibling;
                if (typeof pNode !== "undefined" && pNode !== null && pNode.nodeType !== this.nodeTypes.ELEMENT_NODE) {
                    node = pNode;
                } else {
                    break;
                }
            }
            return pNode;
        },
        /**
         * @param node {HTMLElement}
         * @return {HTMLElement | Null}
         */
        next: function next(node) {
            var nNode;
            while (true) {
                nNode = node.nextSibling;
                if (typeof nNode !== "undefined" && nNode !== null && nNode.nodeType !== this.nodeTypes.ELEMENT_NODE) {
                    node = nNode;
                } else {
                    break;
                }
            }
            return nNode;
        },
        /**
         * @param node {HTMLElement}
         * @return {HTMLElement | Null}
         */
        parent: function parent(node) {
            var prNode;
            while (true) {
                prNode = node.parentNode;
                if (typeof prNode !== "undefined" && prNode !== null && prNode.nodeType !== this.nodeTypes.ELEMENT_NODE) {
                    node = prNode;
                } else {
                    break;
                }
            }
            return prNode;
        }
    };
}(this));
