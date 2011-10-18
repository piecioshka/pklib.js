/**
 * @package dom
 * @dependence browser, css, utils
 */
pklib = this.pklib || {};

/**
 * Helper related with DOM service.
 */
pklib.dom = (function() {

    var doc = document;
    
    var walk_the_dom = function(node, func) {
        func(node);
        node = node.firstChild;
        while(node) {
            walk_the_dom(node, func);
            node = node.nextSibling;
        }
    };

    return {

        nodeTypes : {
            1 : "ELEMENT_NODE",
            2 : "ATTRIBUTE_NODE",
            3 : "TEXT_NODE",
            4 : "CDATA_SECTION_NODE",
            5 : "ENTITY_REFERENCE_NODE",
            6 : "ENTITY_NODE",
            7 : "PROCESSING_INSTRUCTION_NODE",
            8 : "COMMENT_NODE",
            9 : "DOCUMENT_NODE",
            10 : "DOCUMENT_TYPE_NODE",
            11 : "DOCUMENT_FRAGMENT_NODE",
            12 : "NOTATION_NODE"
        },

        /**
         * @param {HTMLElement} element
         * @return {string}
         */
        isNode : function(element) {
            return element && this.nodeTypes[element.nodeType] || null;
        },
        
        /**
         * @param {string} id
         * @param {HTMLElement} area
         * @return {HTMLElement}
         */
        byId : function(id, area) {
            area = area || doc;
            return area.getElementById(id);
        },
        
        /**
         * @param {string} tag
         * @param {HTMLElement} area
         * @return {NodeList}
         */
        byTag : function(tag, area) {
            area = area || doc;
            return area.getElementsByTagName(tag);
        },
        
        /**
         * @param {string} cssClass
         * @param {HTMLElement} area
         * @return {NodeList or array}
         */
        byClass : function(cssClass, area) {
            area = area || doc;
            if(area.getElementsByClassName){
                return area.getElementsByClassName(cssClass);
            } else {
                var results = [];
                walk_the_dom(area, function(node) {
                    if(pklib.css.hasClass(cssClass, node)) {
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
        index : function(element) {
            var parent = element.parentNode;
            var elements = this.children(parent);
            for(var i = 0, len = elements.length; i < len; ++i) {
                var item = elements[i];
                if(item === element) {
                    return i;
                }
            }
            return null;
        },
        
        /**
         * @param {HTMLElement} element
         * @return {array}
         */
        children : function(element) {
            for(var i = 0, arr = [], childs = element.childNodes, len = childs.length; i < len; ++i) {
                if(this.nodeTypes[childs[i].nodeType] === this.nodeTypes[1]) {
                    arr.push(childs[i]);
                }
            }
            return arr;
        },
        
        /**
         * @param {HTMLElement} element
         * @param {HTMLElement} area
         * @return {array}
         */
        center : function(element, area) {
            var left, top;
            if(area === doc.body) {
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
        maximize : function(element, container) {
            var width, height;
            if(container === doc.body) {
                width = Math.max(pklib.utils.size.window("width"), pklib.utils.size.document("width"));
                height = Math.max(pklib.utils.size.window("height"), pklib.utils.size.document("height"));
                if(pklib.browser.getName() === "msie") {
                    width -= 20;
                }
            } else {
                width = pklib.utils.size.object(container, "width");
                height = pklib.utils.size.object(container, "height");
            }
            element.style.width = width;
            element.style.height = height;
            return [width, height];
        }
    };

})();
