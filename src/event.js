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
             * @memberOf event
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
             * @memberOf event
             * @function
             * @param {HTMLElement} target
             * @param {String} event_name
             * @throws {ReferenceError} If HTMLElement haven't got any events
             */
            trigger: function (target, event_name) {
                var events, len, i;

                if (typeof target.events === "undefined") {
                    target.events = {};
                }

                events = target.events[event_name];

                pklib.common.assert(typeof events !== "undefined", "pklib.event.trigger: @event " + event_name + ": not {Array}");

                len = events.length;

                for (i = 0; i < len; ++i) {
                    events[i].call(target, events[i]);
                }
            }
        };

    pklib.event = event;
}(this));
