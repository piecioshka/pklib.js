/**
 * Validate module
 * @package validate
 * @dependence array, utils
 */
(function (win) {
    'use strict';
    var pklib = win.pklib || {};

    pklib.validate = {
        /**
         * @param object {Object}
         * @return {Boolean}
         */
        empty: function (object) {
            var iterator = 0,
                item;
            if (object === null) {
                return true;
            } else if (pklib.array.isArray(object)) {
                return (object.length === 0);
            } else {
                switch (typeof object) {
                case "string":
                    return (object === "");
                case "number":
                    return (object === 0);
                case "object":
                    for (item in object) {
                        if (object.hasOwnProperty(item)) {
                            iterator += 1;
                        }
                    }
                    return (iterator === 0);
                }
                return false;
            }
        },
        /**
         * @param config {Object}
         * <pre>
         * {
         *      object {String}
         *      regexp {Object}
         *
         *      error {Function},
         *      success {Function}
         * }
         * </pre>
         *
         * @return {Function}
         */
        regexp: function (config) {
            var exp,
                settings = {
                    object: null,
                    regexp: null,
                    error: function () {
                        // pass
                    },
                    success: function () {
                        // pass
                    }
                };
            if (config === null || typeof config === "udnefined") {
                throw new TypeError("pklib.validate.regexp: Config is undefined");
            }
            settings = pklib.array.mixin(settings, config);

            if (settings.regexp === null) {
                throw new TypeError("pklib.validate.regexp: Regular expressino is neeeded");
            }
            exp = new RegExp(settings.regexp);

            if (settings.object === null) {
                throw new TypeError("pklib.validate.regexp: Object is neeeded");
            }
            if (exp.test(settings.object)) {
                if (typeof settings.success === "function") {
                    return settings.success();
                }
            }
            if (typeof settings.error === "function") {
                return settings.error();
            }
        }
    };
}(this));
