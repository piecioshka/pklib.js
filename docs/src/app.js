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

    jQuery(document).ready(function () {
        init(h);
        
        // Twitter bootstrap
        prettyPrint();
        jQuery('.tabs').tabs();
		$("a[rel=twipsy]").twipsy({
			live: true
		});
    });

}(this));