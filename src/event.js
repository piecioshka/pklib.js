/**
 * @package event
 */
pklib = this.pklib || {};

/**
 * Helper about manage event on HTMLElement.
 */
pklib.event = (function() {

    var doc = document;

    return {

        /**
         * @param {HTMLElement} target
         * @param {string} eventType
         * @param {function} callback
         * @param {boolean} bubbles
         * @return {Event}
         */
        add : function(target, eventType, callback, bubbles) {
            bubbles = bubbles || false;

            if(target.attachEvent) {
                target.attachEvent("on" + eventType, callback);
            } else if(target.addEventListener) {
                target.addEventListener(eventType, callback, bubbles);
            }
            
            var evt = null;
            try {
                evt = doc.createEvent("Event");
                evt.initEvent(eventType, bubbles, true);
            } catch(e) {
                evt = new Event();
            }
            return evt;
        },
        
        /**
         * @param {HTMLElement} target
         * @param {string} eventType
         * @param {function} callback
         * @param {boolean} bubbles
         * @return {boolean}
         */
        remove : function(target, eventType, callback, bubbles) {
            if(target.detachEvent) {
                this.remove = function(target, eventType, callback) {
                    target.detachEvent("on" + eventType, callback);
                    return true;
                };
            } else if(target.removeEventListener) {
                this.remove = function(target, eventType, callback, bubbles) {
                    bubbles = bubbles || false;
                    target.removeEventListener(eventType, callback, bubbles);
                    return true;
                };
            }
            return this.remove(target, eventType, callback, bubbles);
        }
    };

})();
