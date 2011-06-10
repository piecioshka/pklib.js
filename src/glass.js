pklib = this.pklib || {};

pklib.glass = (function(){

	return {

	    objClass: 'pklib-glass-wrapper',

	    opacity: 0.5,

	    autoclosetime: 500,

	    closetime: 500,

	    showtime: 500,

	    background: '#000000',

	    show: function(config, callback) {
	        var that = this,
	        	settings = {
		            place: 'body'
		        };

	        jQuery.extend(settings, config);

	        var winWidth = jQuery(window).width(),
	            winHeight = jQuery(window).height(),
	            docWidth = jQuery(document).width(),
	            dovHeight = jQuery(document).height(),
	            maxWidth = (docWidth > winWidth) ? docWidth : winWidth, 
	            maxHeight = (dovHeight > winHeight) ? dovHeight + 16 : winHeight,

	            extraWidth = (pklib.browser.getName() === 'msie') ? 21 : 0,
	            extraHeight = (pklib.browser.getName() === 'msie') ? 20 : 0,

	            glassFrame = jQuery('<iframe />').addClass(this.objClass).css({
					height: maxHeight - extraHeight,
					width: maxWidth - extraWidth,
					position: 'absolute',
					top: 0,
					left: 0,
					opacity: 0,
					'z-index': 1000,
		            border: 0
				}),

		        glass = jQuery('<div />').addClass(this.objClass).css({
		        	background: this.background,
					height: maxHeight - extraHeight,
					width: maxWidth  - extraWidth,
					position: 'absolute',
					top: 0,
					left: 0,
					overflow: 'hidden',
					opacity: 0,
					'z-index': 1000
				});

	        jQuery(settings.place).append(glassFrame).append(glass);

	        jQuery('.' + this.objClass).animate({
	            opacity: this.opacity
	        }, this.showtime, function(){
	            if (typeof callback != 'undefined'){
	                callback();
	            }
	        });

            // refresh position
            function refreshPosition(){

            	(function clearSizes(){
	            	jQuery('.' + that.objClass).css({
	    				height: 0,
	    				width: 0
	                });
            	})();

                var winWidth = jQuery(window).width(),
                    winHeight = jQuery(window).height(),
                    docWidth = jQuery(document).width(),
                    dovHeight = jQuery(document).height(),
                    maxWidth = (docWidth > winWidth) ? docWidth : winWidth, 
                    maxHeight = (dovHeight > winHeight) ? dovHeight : winHeight;

                jQuery('.' + that.objClass).css({
    				height: maxHeight - extraHeight,
    				width: maxWidth  - extraWidth
                });
            }

            // on window resize
            window.onresize = function pklibGlassRefreshPosition(){
                refreshPosition.call(that);
            };

	        // release memory in IE
	        glassFrame = null;
	        glass = null;
	    },

	    autoclose: function() {
	        var className = this.objClass,
	            glass = this;

	        setTimeout(function() {
	            glass.close();
	        }, this.autoclosetime);
	    },

	    close: function() {
	        var className = this.objClass;
	        jQuery('.' + className).animate({
	            opacity: 0
	        }, this.closetime, function() {
	            jQuery('.' + className).remove();
	        });
	    }

	};

})();
