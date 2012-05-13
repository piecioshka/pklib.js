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
                    // IE browser
                    target.attachEvent("on" + eventName, handler);
                } else if (target.addEventListener) {
                    // other browser
                    target.addEventListener(eventName, handler, false);
                } else {
                    // for very old browser
                    target["on" + eventName] = handler;
                }
            },
            /**
             * @memberOf event
             * @function
             * @param {HTMLElement} target
             * @param {String} eventName
             */
            remove: function (target, eventName) {
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
                    delete target["on" + eventName];
                } else {
                    events = target.events[eventName];

                    if (typeof events !== "undefined") {
                        len = events.length;

                        for (i = 0; i < len; ++i) {
                            handler = events[i];
                            target[removeEvent](eventName, handler);
                            delete target.events[eventName];
                        }
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
                var events, len, i;

                if (typeof target.events === "undefined") {
                    target.events = {};
                }

                events = target.events[eventName];

                if (typeof events === "undefined") {
                    throw new ReferenceError("pklib.event.trigger: @event " + eventName + ": not {Array}");
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
