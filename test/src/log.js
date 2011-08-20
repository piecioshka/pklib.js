/**
 * @package test.log
 */
if(typeof log !== "function"){
    function log(){
        if(window.console && console.log){
            console.log.apply(null, arguments);
        } else {
            document.write(arguments.toString());
        }
    }
}