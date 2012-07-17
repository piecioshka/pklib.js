/**
 * @package pklib.event
 */
(function (global) {
    "use strict";

    /**
     * @namespace
     * @type {Object}
     */
    var pklib = global.pklib || {};

    /**
     * Helper about manage event on HTMLElement
     * @namespace
     */
    pklib.event = {
        /**
         * @memberOf pklib.event
         * @function
         * @param {HTMLElement} target
         * @param {String} event_name
         * @param {Function} handler
         */
        add: function (target, event_name, handler) {
            if (typeof target.events === "undefined") {
                target.events = {};
            }

            var event = target.events[event_name];

            if (typeof event === "undefined") {
                target.events[event_name] = [];
            }

            target.events[event_name].push(handler);

            if (target.attachEvent) {
                // IE browser
                target.attachEvent("on" + event_name, handler);
            } else if (target.addEventListener) {
                // other browser
                target.addEventListener(event_name, handler, false);
            } else {
                // for very old browser
                target["on" + event_name] = handler;
            }
        },
        /**
         * @memberOf pklib.event
         * @function
         * @param {HTMLElement} target
         * @param {String} event_name
         */
        remove: function (target, event_name) {
            var removeEvent, events, len, i, handler;

            if (typeof target.events === "undefined") {
                target.events = {};
            }

            if (target.detachEvent) {
                // IE browser
                removeEvent = "detachEvent";
            } else if (target.removeEventListener) {
                // other browser
                removeEvent = "removeEventListener";
            }

            if (typeof removeEvent === "undefined") {
                // for old browser
                delete target["on" + event_name];
            } else {
                events = target.events[event_name];

                if (typeof events !== "undefined") {
                    len = events.length;

                    for (i = 0; i < len; ++i) {
                        handler = events[i];
                        target[removeEvent](event_name, handler);
                        delete target.events[event_name];
                    }
                }
            }
        },
        /**
         * @memberOf pklib.event
         * @function
         * @param {HTMLElement} target
         * @param {String} event_name
         * @returns {Array|Undefined}
         */
        get: function (target, event_name) {
            if (typeof target.events === "undefined") {
                target.events = {};
            }
            return target.events[event_name];
        },
        /**
         * @memberOf pklib.event
         * @function
         * @param {HTMLElement} target
         * @param {String} event_name
         */
        trigger: function (target, event_name) {
            var events, len, i;

            if (typeof target.events === "undefined") {
                target.events = {};
            }

            events = target.events[event_name];

            if (typeof events !== "undefined") {
                len = events.length;

                for (i = 0; i < len; ++i) {
                    events[i].call(target, events[i]);
                }
            }
        }
    };

}(this));
