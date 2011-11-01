/**
 * @package dom
 * @dependence browser, css, utils
 */
pklib = this.pklib || {};

/**
 * Helper related with DOM service.
 */
pklib.dom = (function () {

    var doc = document,
    
        walk_the_dom = function (node, func) {
            func(node);
            node = node.firstChild;
            while(node) {
                walk_the_dom(node, func);
                node = node.nextSibling;
            }
        };

    return {

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
         * @return {string}
         */
        isNode: function (element) {
            return element && element.nodeType && element.nodeName|| null;
        },
        
        /**
         * @param {string} id
         * @param {HTMLElement} container
         * @return {HTMLElement}
         */
        byId: function (id, container) {
            container = container || doc;
            return container.getElementById(id);
        },
        
        /**
         * @param {string} tag
         * @param {HTMLElement} container
         * @return {NodeList}
         */
        byTag: function (tag, container) {
            container = container || doc;
            return container.getElementsByTagName(tag);
        },
        
        /**
         * @param {string} cssClass
         * @param {HTMLElement} container
         * @return {NodeList or array}
         */
        byClass: function (cssClass, container) {
            container = container || doc;
            if (container.getElementsByClassName) {
                return container.getElementsByClassName(cssClass);
            } else {
                var results = [];
                walk_the_dom(container, function (node) {
                    if (pklib.css.hasClass(cssClass, node)) {
                        results.push(node);
                    }
                });
                return results;
            }
        },
        
        /**
         * @param {HTMLElement} element
         * @return {null or number}
         */
        index: function (element) {
            var parent = element.parentNode,
                elements = this.children(parent);
            for(var i = 0, len = elements.length; i < len; ++i) {
                var item = elements[i];
                if (item === element) {
                    return i;
                }
            }
            return null;
        },
        
        /**
         * @param {HTMLElement} element
         * @return {array}
         */
        children: function (element) {
            var array = [], 
                childs = element.childNodes;
            for(var i = 0, len = childs.length; i < len; ++i) {
                if (childs[i].nodeType === this.nodeTypes.ELEMENT_NODE) {
                    array.push(childs[i]);
                }
            }
            return array;
        },
        
        /**
         * @param {HTMLElement} element
         * @param {HTMLElement} container
         * @return {array}
         */
        center: function (element, container) {
            var left = null,
                top = null;
            if (container === doc.body) {
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
         * @param {HTMLElement} element
         * @param {HTMLElement} container
         * @return {array}
         */
        maximize: function (element, container) {
            var width = null, 
                height = null;
            if (container === doc.body) {
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
         * @param {HTMLElement} element
         * @param {HTMLElement} container
         * @return {HTMLElement}
         */
        insert: function (element, container) {
            if (this.isNode(element)) {
                container.appendChild(element);
            } else if (typeof element === "string") {
                container.innerHTML += element;
            }
            return element;
        }
    };

})();
