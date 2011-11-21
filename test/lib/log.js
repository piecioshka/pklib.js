(function (global) {
    
    global.log = function () {
        if (global.console && console.log) {
            console.log.apply(global, arguments);
        }
    };
    
    global.info = function () {
        if (global.console && console.info) {
            console.info.apply(global, arguments);
        }
    };
    
    global.warn = function () {
        if (global.console && console.warn) {
            console.warn.apply(global, arguments);
        }
    };
    
})(window);