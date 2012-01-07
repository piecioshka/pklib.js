/**
 * Helper about manage event on HTMLElement.
 * @package event
 */
(function (win) {
    'use strict';

    var pklib = win.pklib || {};

    pklib.event = {

        /**
         * @param target {HTMLElement}
         * @param eventType {String}
         * @param callback {Function}
         * @param bubbles {Boolean}
         * @return {Event}
         */
        add: function (target, eventType, callback, bubbles) {
            bubbles = bubbles || false;

            if (target.attachEvent) {
                target.attachEvent("on" + eventType, callback);
            } else if (target.addEventListener) {
                target.addEventListener(eventType, callback, bubbles);
            }
        },
        /**
         * @param target {HTMLElement}
         * @param eventType {String}
         * @param callback {Function}
         * @param bubbles {Boolean}
         * @return {boolean}
         */
        remove: function (target, eventType, callback, bubbles) {
            if (target.detachEvent) {
                this.remove = function (target, eventType, callback) {
                    target.detachEvent("on" + eventType, callback);
                    return true;
                };
            } else if (target.removeEventListener) {
                this.remove = function (target, eventType, callback, bubbles) {
                    bubbles = bubbles || false;
                    target.removeEventListener(eventType, callback, bubbles);
                    return true;
                };
            }
            return this.remove(target, eventType, callback, bubbles);
        }
    };
}(this));
