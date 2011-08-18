/**
 * @package app.node
 */
pklib = this.pklib || {};
pklib.node = (function() {

    var node = [ 
         null, 
         'ELEMENT_NODE', 
         'ATTRIBUTE_NODE', 
         'TEXT_NODE', 
         'CDATA_SECTION_NODE', 
         'ENTITY_REFERENCE_NODE', 
         'ENTITY_NODE', 
         'PROCESSING_INSTRUCTION_NODE', 
         'COMMENT_NODE', 
         'DOCUMENT_NODE', 
         'DOCUMENT_TYPE_NODE', 
         'DOCUMENT_FRAGMENT_NODE', 
         'NOTATION_NODE' 
    ];

    var __node = {
        is : function(element) {
            return node[element.nodeType];
        }
    };

    return __node;

})();
