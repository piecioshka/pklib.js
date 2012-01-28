/**
 * Helper about manage event on HTMLElement.
 * @package event
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
         * @param target {HTMLElement}
         * @param eventName {String}
         * @param handler {Function}
         */
        remove: function (target, eventName, handler) {
        	if (typeof target.events === "undefined") {
        		target.events = {};
        	}
        	
        	var removeEvent;
        	if (target.detachEvent) {
        		removeEvent = "detachEvent";
        	} else if (target.removeEventListener) {
        		removeEvent = "removeEventListener";
        	}
        	
        	var events = target.events[eventName];
        	if (typeof events !== "undefined") {
	        	var len = events.length;
	        	
	        	for (var i = 0; i < len; ++i) {
	        		var handler = events[i];
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
        get: function (target, eventName) {
        	if (typeof target.events === "undefined") {
        		target.events = {};
        	}
        	
        	return target.events[eventName];
        },
        /**
         * @param target {HTMLElement}
         * @param eventName {String}
         */
        trigger: function (target, eventName) {
        	if (typeof target.events === "undefined") {
        		target.events = {};
        	}
        	
        	var events = target.events[eventName];
        	if (typeof events !== "undefined") {
	        	var len = events.length;
	        	
	        	for (var i = 0; i < len; ++i) {
	        		events[i].call(target, events[i]);
	        	}
        	} else {
        		throw new ReferenceError("Event " + eventName + " is undefined");
        	}
        }
    };
}(this));
