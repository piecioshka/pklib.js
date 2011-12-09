(function (win) {
    win.log = function () {
        if (win.console && console.log) {
            console.log.apply(win, arguments);
        }
    };
    win.info = function () {
        if (win.console && console.info) {
            console.info.apply(win, arguments);
        }
    };
    win.warn = function () {
        if (win.console && console.warn) {
            console.warn.apply(win, arguments);
        }
    };
})(window);
