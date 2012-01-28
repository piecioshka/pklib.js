/**
 * Module to service array object.
 * @package array
 */
(function (global) {
    "use strict";

    var pklib = global.pklib || {};

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
            return typeof obj === "object" && 
            	obj !== null && 
            	typeof obj.length !== "undefined" && 
            	typeof obj.slice !== "undefined";
        },
        /**
         * Check if element is in array by loop.
         * @param param
         * @param array {Array}
         * @return {Boolean}
         */
        inArray: function (param, array) {
            var i, len = array.length;
            for (i = 0; i < len; ++i) {
                if (array[i] === param) {
                    return true;
                }
            }
            return false;
        },
        /**
         * Get index of element
         * @param item
         * @param array {Array}
         * @throws {ReferenceError}
         * @return {Boolean}
         */
        index: function (item, array) {
            var i, len = array.length;
            
            for (i = 0; i < len; ++i) {
                if (array[i] === item) {
                    return i;
                }
            }
            throw new ReferenceError("pklib.array.index: @item not exists");
        },
        /**
         * Unique array. Delete element what was duplicated.
         * @param array {Array}
         * @return {Array}
         */
        unique: function (array) {
            var i, item, temp = [], len = array.length;
            for (i = 0; i < len; ++i) {
                item = array[i];
                if (!this.inArray.call(null, item, temp)) {
                    temp.push(item);
                }
            }
            return temp;
        },
        /**
         * Remove element declarated in infinity params without first.
         * First parameter is array object.
         * @param array {Array}
         * @param {var}
         * @return {Array}
         */
        remove: function (array) {
            var i, param,
                params = Array.prototype.slice.call(arguments, 1),
                len = params.length;

            for (i = 0; i < len; ++i) {
                param = params[i];
                if (this.inArray(param, array)) {
                	array.splice(this.index(param, array), 1);
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
            var i, len = 0, element, item;

            if (this.isArray(target) && this.isArray(source)) {
                len = source.length;
                for (i = 0; i < len; ++i) {
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
