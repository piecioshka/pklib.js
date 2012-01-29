(function (win) {
    "use strict";

    var jQuery = win.jQuery || {},
        document = win.document || {},
        h = win.holiholi || {};

    function init(g) {
        var o;
        for (o in g) {
            if (g.hasOwnProperty(o)) {
                g[o].init();
            }
        }
    }
    
    function adjustHeight(obj) {
    	var windowHeight = pklib.utils.size.window("height");
    	obj.style.height = (windowHeight - 70) + "px";
    }
    function adjustColumns() {
        var sidebar = pklib.dom.byClass("sidebar")[0],
    		content = pklib.dom.byClass("content")[0];
        adjustHeight(sidebar);
        adjustHeight(content);
    }

    jQuery(document).ready(function () {
        init(h);
        
        adjustColumns();
        pklib.event.add(window, "resize", adjustColumns.bind(null));
        
        // Twitter bootstrap
        prettyPrint();
        jQuery('.tabs').tabs();
		$("a[rel=twipsy]").twipsy({
			live: true
		});
    });

}(this));