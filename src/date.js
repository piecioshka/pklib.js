/**
 * @package pklib.date
 */

/**
 * Utils stack to Date object
 */
pklib.date = (function () {
    "use strict";

    return {
        /**
         * Simple return month in string and file 0 at first place if month smaller than 10
         *
         * @returns {String}
         */
        get_full_month: function () {
            var month = (parseInt(new Date().getMonth(), 10) + 1);

            if (month < 10) {
                month = "0" + month;
            }

            return String(month);
        }
    };
}());
