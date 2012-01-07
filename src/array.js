/**
 * Module to service array object.
 * @package array
 */
(function (win) {
    'use strict';

    var pklib = win.pklib || {};

    pklib.array =  {

        /**
         * Check if object is array,
         * Check by:
         * - typeof object
         * - not null
         * - typeof object.length
         * - typeof object.slice
         * 
         * @param obj {HTMLElement}
         * @return {Boolean}
         */
        isArray: function (obj) {
            return typeof obj === "object" && obj !== null && typeof obj.length !== "undefined" && typeof obj.slice !== "undefined";
        },
        /**
         * Check if element is in array by loop.
         * 
         * @param {var) param
         * @param {Array} array
         * @return {Boolean}
         */
        inArray: function (param, array) {
            var i = 0,
                len = array.length;
            for (i = 0; i < len; i += 1) {
                if (array[i] === param) {
                    return true;
                }
            }
            return false;
        },
        /**
         * Unique array. Delete element what was duplicated.
         * 
         * @param array {Array}
         * @return {Array}
         */
        unique: function (array) {
            var i,
                temp = [],
                item,
                len = array.length;
            for (i = 0; i < len; i += 1) {
                item = array[i];
                if (this.inArray.call(null, item, temp) === false) {
                    temp.push(item);
                }
            }
            return temp;
        },
        /**
         * Remove element declarated in infinity params without first.
         * First parameter is array object.
         * 
         * @param array {Array}
         * @param {var}
         * @return {Array}
         */
        remove: function (array) {
            var i,
                param,
                params = Array.prototype.splice.call(arguments, 1),
                len = params.length,
                inside;
            for (i = 0; i < len; i += 1) {
                param = params[i];
                inside = this.inArray(param, array);
                if (inside !== false) {
                    array.splice(inside, 1);
                }
            }
            return array;
        },
        /**
         * @param target {Array or Object}
         * @param source {Array or Object}
         * @return {Array}
         */
        mixin: function (target, source) {
            var i,
                len = 0,
                element,
                item;
            if (this.isArray(target) && this.isArray(source)) {
                len = source.length;
                for (i = 0; i < len; i += 1) {
                    element = source[i];
                    if (!this.inArray(element, target)) {
                        target.push(element);
                    }
                }
                target.sort();
                return target;
            } else {
                for (item in source) {
                    if (source.hasOwnProperty(item)) {
                        target[item] = source[item];
                    }
                }
                return target;
            }
        }
    };
}(this));
