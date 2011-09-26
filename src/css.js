/**
 * @package css
 */
pklib = this.pklib || {};
pklib.css = (function() {

    return {

        /**
         * Add CSS class to element define in second parameter.
         *
         * @param {HTMLElement} element
         * @param {string} cssClass
         */
        addClass : function(cssClass, element) {
            if( typeof element === "undefined" || element == null || typeof cssClass === "undefined") {
                throw new TypeError("pklib.css.addClass: Element is undefined/null or cssClass is undefined");
            }
            var classElement = element.className;
            if(!this.hasClass(cssClass, element)) {
                if(classElement.length) {
                    classElement += " " + cssClass;
                } else {
                    classElement = cssClass;
                }
            }
            element.className = classElement;
        },
        /**
         * Remove CSS class from element define in second parameter.
         *
         * @param {HTMLElement} element
         * @param {string} cssClass
         */
        removeClass : function(cssClass, element) {
            if( typeof element === "undefined" || element == null || typeof cssClass === "undefined") {
                throw new TypeError("pklib.css.removeClass: Element is undefined/null or cssClass is undefined");
            }
            var regexp = new RegExp("(\s" + cssClass + ")|(" + cssClass + "\s)|" + cssClass, "i");
            element.className = element.className.replace(regexp, "");
        },
        /**
         * Check if element has CSS class
         * 
         * @param {HTMLElement} element
         * @param {string} cssClass
         * @return {boolean}
         */
        hasClass : function(cssClass, element) {
            if( typeof element === "undefined" || element == null || typeof cssClass === "undefined") {
                throw new TypeError("pklib.css.hasClass: Element is undefined/null or cssClass is undefined");
            }
            var regexp = new RegExp("(\s" + cssClass + ")|(" + cssClass + "\s)|" + cssClass, "i");
            return regexp.test(element.className);
        }
    };

})();
