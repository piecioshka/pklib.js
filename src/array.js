/**
 * @package pklib.array
 */
(function (global) {
    "use strict";
    /** @namespace */
    var pklib = global.pklib || {},

        /**
         * Module to service array object
         * @namespace
         */
        array =  {
            /**
             * Check if param is array
             * @memberOf array
             * @function
             * @param {Object} array
             * @returns {Boolean}
             */
            isArray: function (array) {
                return pklib.common.assert(typeof array === "object" &&
                    array !== null &&
                    typeof array.length !== "undefined" &&
                    typeof array.slice !== "undefined", true);
            },
            /**
             * Check if element is in array by loop
             * @memberOf array
             * @function
             * @param {Object} param
             * @param {Array} array
             * @returns {Boolean}
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
             * @memberOf array
             * @function
             * @param {Object} item
             * @param {Array} array
             * @throws {ReferenceError} If cannot find index of element
             * @returns {Boolean}
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
             * Unique array. Delete element what was duplicated
             * @memberOf array
             * @function
             * @param {Array} array
             * @returns {Array}
             */
            unique: function (array) {
                var i, item, temp = [], len = array.length;
                for (i = 0; i < len; ++i) {
                    item = array[i];
                    if (!pklib.array.inArray.call(null, item, temp)) {
                        temp.push(item);
                    }
                }
                return temp;
            },
            /**
             * Remove element declarated in infinity params without first.
             * First parameter is array object
             * @memberOf array
             * @function
             * @param {Array} array
             * @returns {Array}
             */
            remove: function (array) {
                var i, param,
                    params = Array.prototype.slice.call(arguments, 1),
                    len = params.length;

                for (i = 0; i < len; ++i) {
                    param = params[i];
                    if (pklib.array.inArray(param, array)) {
                        array.splice(pklib.array.index(param, array), 1);
                    }
                }
                return array;
            }
        };

    pklib.array = array;
}(this));
