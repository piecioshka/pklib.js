/**
 * Helper related with DOM service.
 * @package dom
 * @dependence browser, css, utils
 */
(function (win) {
    "use strict";

    var pklib = win.pklib || {},
        document = win.document || {};

    function walk_the_dom(node, func) {
        func(node);
        node = node.firstChild;
        while (node) {
            walk_the_dom(node, func);
            node = node.nextSibling;
        }
    }

    function getType(selector) {
        if (/^\.(\w*)$/.test(selector)) {
            return "class";
        } else if (/^\#(\w*)$/.test(selector)) {
            return "id";
        } else {
            return "tag";
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
         * @param {HTMLElement} element
         * @return {String}
         */
        isNode: function (element) {
            return ((element && element.nodeType) && element.nodeName) || null;
        },
        /**
         * @param id {String}
         * @param container {HTMLElement}
         * @return {HTMLElement}
         */
        byId: function (id, container) {
            container = container || document;
            return container.getElementById(id);
        },
        /**
         * @param tag {String}
         * @param container {HTMLElement}
         * @return {NodeList}
         */
        byTag: function (tag, container) {
            container = container || document;
            return container.getElementsByTagName(tag);
        },
        /**
         * @param cssClass {String}
         * @param container {HTMLElement}
         * @return {NodeList or array}
         */
        byClass: function (cssClass, container) {
            container = container || document;
            var results = [];
            if (container.getElementsByClassName) {
                return container.getElementsByClassName(cssClass);
            } else {
                walk_the_dom(container, function (node) {
                    if (pklib.css.hasClass(cssClass, node)) {
                        results.push(node);
                    }
                });
                return results;
            }
        },
        /**
         * Get element from  selector
         * @param {String} selector
         * 
         * TODO: Feature
         */
        /*
        get: function (selector) {
            try {
                var i,
                    elements = selector.match(/[\.\#\w]+/g),
                    len = elements.length,
                    scope = win,
                    item,
                    type;
                for (i = 0; i < len; i += 1) {
                    item = elements[i];
                    type = getType(item);
                    if (type === "class") {
                        scope = this.byClass(item.substr(1), scope);
                    } else if (type === "id") {
                        scope = this.byId(item.substr(1), scope);
                    } else {
                        scope = this.byTag(item, scope);
                    }
                }
            } catch (ignore) {}
        },
        */
        /**
         * @param element {HTMLElement}
         * @return {Null or Number}
         */
        index: function (element) {
            var i,
                parent = element.parentNode,
                elements = this.children(parent),
                len = elements.length,
                item;
            for (i = 0; i < len; i += 1) {
                item = elements[i];
                if (item === element) {
                    return i;
                }
            }
            return null;
        },
        /**
         * @param element {HTMLElement}
         * @return {Array}
         */
        children: function (element) {
            var i,
                array = [],
                childs = element.childNodes,
                len = childs.length;
            for (i = 0; i < len; i += 1) {
                if (childs[i].nodeType === this.nodeTypes.ELEMENT_NODE) {
                    array.push(childs[i]);
                }
            }
            return array;
        },
        /**
         * @param element {HTMLElement}
         * @param container {HTMLElement}
         * @return {Array}
         */
        center: function (element, container) {
            var left = null,
                top = null;
            if (container === document.body) {
                left = (Math.max(pklib.utils.size.window("width"), pklib.utils.size.document("width")) - pklib.utils.size.object(element, "width")) / 2;
                top = (Math.max(pklib.utils.size.window("height"), pklib.utils.size.document("height")) - pklib.utils.size.object(element, "height")) / 2;
            } else {
                left = (pklib.utils.size.window("width") - pklib.utils.size.object(element, "width")) / 2;
                top = (pklib.utils.size.window("height") - pklib.utils.size.object(element, "height")) / 2;
            }
            element.style.left = left + "px";
            element.style.top = top + "px";
            element.style.position = "absolute";
            return [left, top];
        },
        /**
         * @param element {HTMLElement}
         * @param container {HTMLElement}
         * @return {Array}
         */
        maximize: function (element, container) {
            var width = null,
                height = null;
            if (container === document.body) {
                width = Math.max(pklib.utils.size.window("width"), pklib.utils.size.document("width"));
                height = Math.max(pklib.utils.size.window("height"), pklib.utils.size.document("height"));
                if (pklib.browser.getName() === "msie") {
                    width -= 20;
                }
            } else {
                width = pklib.utils.size.object(container, "width");
                height = pklib.utils.size.object(container, "height");
            }
            element.style.width = width;
            element.style.height = height;
            return [width, height];
        },
        /**
         * @param element {HTMLElement}
         * @param container {HTMLElement}
         * @return {HTMLElement}
         */
        insert: function (element, container) {
            if (this.isNode(element)) {
                container.appendChild(element);
            } else if (typeof element === "string") {
                container.innerHTML += element;
            }
            return element;
        },
        /**
         * @param node {HTMLElement}
         * @return {HTMLElement | null}
         */
        prev: function (node) {
            var pNode = null;
            while (true) {
                pNode = node.previousSibling;
                if (pNode != null && pNode.nodeType !== this.nodeTypes.ELEMENT_NODE) {
                    node = pNode;
                } else {
                    break;
                }
            }
            return pNode;
        },
        /**
         * @param node {HTMLElement}
         * @return {HTMLElement | null}
         */
        next: function (node) {
            var nNode = null;
            while (true) {
                nNode = node.nextSibling;
                if (nNode != null && nNode.nodeType !== this.nodeTypes.ELEMENT_NODE) {
                    node = nNode;
                } else {
                    break;
                }
            }
            return nNode;
        },
        /**
         * @param node {HTMLElement}
         * @return {HTMLElement | null}
         */
        parent: function (node) {
            var parent = null;
            while (true) {
                parent = node.parentNode;
                if (parent != null && parent.nodeType !== this.nodeTypes.ELEMENT_NODE) {
                    node = parent;
                } else {
                    break;
                }
            }
            return parent;
        }
    };
}(this));
