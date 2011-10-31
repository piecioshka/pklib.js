/**
 * @package cookie
 */
pklib = this.pklib || {};

/**
 * Cookie service manager.
 */
pklib.cookie = (function () {

    var doc = document;

    return {

        /**
         * Create cookie file with name, value and day expired.
         *
         * @param {string} name
         * @param {string} value
         * @param {number} days
         * @return {string}
         */
        create: function (name, value, days) {
            value = value || null;
            var expires = "";

            if (typeof days !== "undefined") {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toGMTString();
            }

            doc.cookie = name + "=" + value + expires + "; path=/";

            return this.read(name);
        },
        
        /**
         * Read cookie by it name.
         *
         * @param {string} name
         * @return {null or string}
         */
        read: function (name) {
            if (typeof name === "undefined") {
                return null;
            }
            name = name + "=";
            var ca = doc.cookie.split(";");

            for(var i = 0, len = ca.length; i < len; ++i) {
                var c = ca[i];
                while(c.charAt(0) === " ") {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
        },
        
        /**
         * Delete cookie by it name.
         *
         * @param {string} name
         * @return {string}
         */
        erase: function (name) {
            return this.create(name, undefined, -1);
        }
    };

})();
