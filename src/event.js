/**
 * Helper about manage event on HTMLElement
 * @package pklib.event
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {};

    pklib.event = {
        /**
         * @param target {HTMLElement}
         * @param eventName {String}
         * @param handler {Function}
         */
        add: function add(target, eventName, handler) {
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
         * @param target {HTMLElement}
         * @param eventName {String}
         */
        remove: function remove(target, eventName) {
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
         * @param target {HTMLElement}
         * @param eventName {String}
         * @return {Array | undefined}
         */
        get: function get(target, eventName) {
            if (typeof target.events === "undefined") {
                target.events = {};
            }
            return target.events[eventName];
        },
        /**
         * @param target {HTMLElement}
         * @param eventName {String}
         * @throws {ReferenceError}
         */
        trigger: function trigger(target, eventName) {
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
}(this));
