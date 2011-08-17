/**
 * @package pklib.profiler
 */
pklib = this.pklib || {};

pklib.profiler = (function(){
    
    var data = {};
    
    var profiler = {
        start: function(name){
            data[name] = new Date();
        },
        stop: function(name){
            data[name] = new Date() - data[name];
        },
        getTime: function(name){
            return data[name];
        }
    };
    
    return profiler;
})();