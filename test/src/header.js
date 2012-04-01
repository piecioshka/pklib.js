(function (global) {
    "use strict";

    if (typeof global.console === "undefined") {
        global.console = {
            log: function () { },
            info: function () { },
            warn: function () { }
        };
    }
}(this));