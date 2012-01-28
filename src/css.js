/**
 * Utils method related css on tags in DOM tree.
 * @package css
 * @dependence string. dom
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {};
	var rspace = /\s+/;
	var rclass = /[\n\t\r]/g;

    /**
     * @param cssClass {String}
     * @param element {HTMLElement}
     * @throws {TypeError}
     */
    function checkParams (cssClass, element) {
        if (Object(cssClass).constructor !== String) {
            throw new TypeError("pklib.css.addClass: @cssClass: not String");
        }
        if (!pklib.dom.isNode(element)) {
            throw new TypeError("pklib.css.addClass: @element: not HTMLElement");
        }
    }
    
    pklib.css = {
        /**
         * Add CSS class to element define in second parameter.
         * @param cssClass {String}
         * @param element {HTMLElement}
         * @throws {TypeError}
         */
        addClass: function (cssClass, element) {
        	checkParams (cssClass, element);
            var classElement = element.className;
            if (!this.hasClass(cssClass, element)) {
                if (classElement.length) {
                    classElement += " " + cssClass;
                } else {
                    classElement = cssClass;
                }
            }
            element.className = classElement;
        },
        /**
         * Remove CSS class from element define in second parameter.
         * @param cssClass {String}
         * @param element {HTMLElement}
         * @throws {TypeError}
         */
        removeClass: function (cssClass, element) {
        	checkParams (cssClass, element);
        	var trim = pklib.string.trim;
        	
        	var classNames = ( element.className || "" ).split( rspace );
        	if (classNames) {
        		var className = (" " + element.className + " ").replace( rclass, " " );
				for (var c = 0, cl = classNames.length; c < cl; c++ ) {
					className = className.replace(" " + classNames[c] + " ", " ");
				}
				element.className = trim( className );
        	} else {
        		element.className = "";
        	}
        },
        /**
         * Check if element has CSS class
         * @param cssClass {String}
         * @param element {HTMLElement}
         * @throws {TypeError}
         * @return {Boolean}
         */
        hasClass: function (cssClass, element) {
        	checkParams (cssClass, element);
    		var className = " " + cssClass + " ";
    		return ((" " + element.className + " ").replace(rclass, " ").indexOf( className ) > -1 );
        }
    };
}(this));
