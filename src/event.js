/**
 * @package pklib.event
 */
(function (global) {
    "use strict";

    // imports
    var pklib = (global.pklib = global.pklib || {});

    /**
     * Add event to Element.
     * @param {HTMLElement} target
     * @param {string} event_name
     * @param {Function} handler
     */
    function add_event(target, event_name, handler) {
        if (target.events === undefined) {
            target.events = {};
        }

        var event = target.events[event_name];

        if (event === undefined) {
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
    }

    /**
     * Remove event from Element.
     * @param {HTMLElement} target
     * @param {string} event_name
     */
    function remove_event(target, event_name) {
        var removeEvent, events, len, i, handler;

        if (target.events === undefined) {
            target.events = {};
        }

        if (target.detachEvent) {
            // IE browser
            removeEvent = "detachEvent";
        } else if (target.removeEventListener) {
            // other browser
            removeEvent = "removeEventListener";
        }

        if (removeEvent === undefined) {
            // for old browser
            delete target["on" + event_name];
        } else {
            events = target.events[event_name];

            if (events !== undefined) {
                len = events.length;

                for (i = 0; i < len; ++i) {
                    handler = events[i];
                    target[removeEvent](event_name, handler);
                    delete target.events[event_name];
                }
            }
        }
    }

    /**
     * Get array with events with concrete name.
     * @param {HTMLElement} target
     * @param {string} event_name
     * @return {Array|undefined}
     */
    function get_event(target, event_name) {
        if (target.events === undefined) {
            target.events = {};
        }
        return target.events[event_name];
    }

    /**
     * Run events on Element.
     * @param {HTMLElement} target
     * @param {string} event_name
     */
    function trigger(target, event_name) {
        var events, len, i;

        if (target.events === undefined) {
            target.events = {};
        }

        events = target.events[event_name];

        if (events !== undefined) {
            len = events.length;

            for (i = 0; i < len; ++i) {
                events[i].call(target, events[i]);
            }
        }
    }

    // exports
    pklib.event = {
        add: add_event,
        remove: remove_event,
        get: get_event,
        trigger: trigger
    };

}(this));
