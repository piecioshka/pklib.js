/**
 * @package pklib.event
 */
(function (global) {
    "use strict";
    /** @namespace */
    var pklib = global.pklib || {},
        /**
         * Helper about manage event on HTMLElement
         * @namespace
         */
        event = {
            /**
             * @memberOf event
             * @function
             * @param {HTMLElement} target
             * @param {String} eventName
             * @param {Function} handler
             */
            add: function (target, eventName, handler) {
                if (typeof target.events === "undefined") {
                    target.events = {};
                }

                var event = target.events[eventName];

                if (typeof event === "undefined") {
                    target.events[eventName] = [];
                }
                target.events[eventName].push(handler);

                if (target.attachEvent) {
                    target.attachEvent("on" + eventName, handler);
                } else if (target.addEventListener) {
                    target.addEventListener(eventName, handler, false);
                }
            },
            /**
             * @memberOf event
             * @function
             * @param {HTMLElement} target
             * @param {String} eventName
             */
            remove: function (target, eventName) {
                if (typeof target.events === "undefined") {
                    target.events = {};
                }

                var removeEvent, events, len = 0, i, handler;
                if (target.detachEvent) {
                    removeEvent = "detachEvent";
                } else if (target.removeEventListener) {
                    removeEvent = "removeEventListener";
                }

                events = target.events[eventName];
                if (typeof events !== "undefined") {
                    len = events.length;

                    for (i = 0; i < len; ++i) {
                        handler = events[i];
                        target[removeEvent](eventName, handler);
                        delete target.events[eventName];
                    }
                }
            },
            /**
             * @memberOf event
             * @function
             * @param {HTMLElement} target
             * @param {String} eventName
             * @returns {Array|Undefined}
             */
            get: function (target, eventName) {
                if (typeof target.events === "undefined") {
                    target.events = {};
                }
                return target.events[eventName];
            },
            /**
             * @memberOf event
             * @function
             * @param {HTMLElement} target
             * @param {String} eventName
             * @throws {ReferenceError} If HTMLElement haven't got any events
             */
            trigger: function (target, eventName) {
                if (typeof target.events === "undefined") {
                    target.events = {};
                }

                var events = target.events[eventName], len, i;
                if (typeof events === "undefined") {
                    throw new ReferenceError("pklib.event.trigger: @event " + eventName + ": undefined");
                } else {
                    len = events.length;

                    for (i = 0; i < len; ++i) {
                        events[i].call(target, events[i]);
                    }
                }
            }
        };

    pklib.event = event;
}(this));
