/**
 * @package pklib.dom
 * @dependence pklib.browser, pklib.css, pklib.string, pklib.utils
 */
(function (global) {
    "use strict";
    /** @namespace */
    var pklib = global.pklib || {},
        document = global.document || {},
        /**
         * Walking on every element in node
         * @private
         * @function
         * @param {HTMLElement} node
         * @param {Function} func Run on every node
         */
        walk_the_dom = function (node, func) {
            if (!!node) {
                func(node);
                node = node.firstChild;
                while (node) {
                    walk_the_dom(node, func);
                    node = node.nextSibling;
                }
            }
        },
        /**
         * Helper related with DOM service
         * @namespace
         */
        dom = {
            /**
             * Types of all available node
             * @namespace
             */
            node_types: {
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
             * @memberOf dom
             * @function
             * @param {HTMLElement} node
             * @returns {String}
             */
            is_node: function (node) {
                try {
                    pklib.common.assert(Boolean(node && node.nodeType && node.nodeName));
                    return true;
                } catch (ignore) {
                    return false;
                }
            },
            /**
             * @memberOf dom
             * @function
             * @param {HTMLElement} node
             * @returns {String}
             */
            is_element: function (node) {
                return (node && node.nodeType === pklib.dom.node_types.ELEMENT_NODE) || false;
            },
            /**
             * @memberOf dom
             * @function
             * @param {HTMLElement} node
             * @return {Boolean}
             */
            is_visible: function (node) {
                pklib.common.assert(pklib.dom.is_element(node), "pklib.dom.is_visible: @node is not HTMLElement");

                return node.style.display !== "none" &&
                    node.style.visibility !== "hidden" &&
                    node.offsetWidth !== 0 &&
                    node.offsetHeight !== 0;
            },
            /**
             * @memberOf dom
             * @function
             * @param {String} id
             * @returns {HTMLElement|Null}
             */
            by_id: function (id) {
                return document.getElementById(id);
            },
            /**
             * @memberOf dom
             * @function
             * @param {String} tag
             * @param {Element} element
             * @returns {NodeList}
             */
            by_tag: function (tag, element) {
                element = element || document;
                return element.getElementsByTagName(tag);
            },
            /**
             * @memberOf dom
             * @function
             * @param {String} css_class
             * @param {HTMLElement} wrapper
             * @returns {NodeList|Array}
             */
            by_class: function (css_class, wrapper) {
                var results;

                wrapper = wrapper || document;

                if (wrapper.getElementsByClassName) {
                    results = wrapper.getElementsByClassName(css_class);
                } else {
                    results = [];
                    walk_the_dom(wrapper, function (node) {
                        if (pklib.css.has_class(css_class, node)) {
                            results.push(node);
                        }
                    });
                }
                return results;
            },
            /**
             * @memberOf dom
             * @function
             * @param {HTMLElement} node
             * @returns {Number|Null}
             */
            index: function (node) {
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
            },
            /**
             * @memberOf dom
             * @function
             * @param {HTMLElement} node
             * @returns {Array}
             */
            children: function (node) {
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
            },
            /**
             * @memberOf dom
             * @function
             * @param {HTMLElement|String} element
             * @param {HTMLElement} node
             * @returns {HTMLElement}
             */
            insert: function (element, node) {
                if (pklib.dom.is_node(element)) {
                    node.appendChild(element);
                } else if (pklib.string.is_string(element)) {
                    node.innerHTML += element;
                }
                return element;
            },
            /**
             * @memberOf dom
             * @function
             * @param {HTMLElement}
             */
            remove: function () {
                var i, node = null, parent = null,
                    args = Array.prototype.slice.call(arguments),
                    len = args.length;

                for (i = 0; i < len; ++i) {
                    node = args[i];
                    if (pklib.dom.is_node(node)) {
                        parent = node.parentNode;
                        parent.removeChild(node);
                    }
                }
            },
            /**
             * @memberOf dom
             * @function
             * @param {HTMLElement} node
             * @returns {HTMLElement|Null}
             */
            prev: function (node) {
                var pNode;
                while (true) {
                    pNode = node.previousSibling;
                    if (typeof pNode !== "undefined" &&
                            pNode !== null &&
                            pNode.nodeType !== pklib.dom.node_types.ELEMENT_NODE
                    ) {
                        node = pNode;
                    } else {
                        break;
                    }
                }
                return pNode;
            },
            /**
             * @memberOf dom
             * @function
             * @param {HTMLElement} node
             * @returns {HTMLElement|Null}
             */
            next: function (node) {
                var nNode;
                while (true) {
                    nNode = node.nextSibling;
                    if (typeof nNode !== "undefined" &&
                            nNode !== null &&
                            nNode.nodeType !== pklib.dom.node_types.ELEMENT_NODE
                    ) {
                        node = nNode;
                    } else {
                        break;
                    }
                }
                return nNode;
            },
            /**
             * @memberOf dom
             * @function
             * @param {HTMLElement} node
             * @returns {HTMLElement|Null}
             */
            parent: function (node) {
                var prNode;
                while (true) {
                    prNode = node.parentNode;
                    if (typeof prNode !== "undefined" &&
                            prNode !== null &&
                            prNode.nodeType !== pklib.dom.node_types.ELEMENT_NODE
                    ) {
                        node = prNode;
                    } else {
                        break;
                    }
                }
                return prNode;
            }
        };

    pklib.dom = dom;
}(this));
