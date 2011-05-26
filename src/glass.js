pklib = this.pklib || {};

pklib.glass = (function(){
	
	return {
	
	    // Class name to glass
	    objClass: 'pklib-glass-wrapper',
	
	    // Opacity what be have a container
	    opacity: 0.5,
	
	    // Auto close time glass
	    autoclosetime: 500,
	
	    // Close time glass
	    closetime: 500,
	
	    // Show time glass
	    showtime: 500,
	    
	    // Color of background
	    background: '#000000',
	
	    // Show glass in browser. Have max width and max height. 
	    // Add object to DOM
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
				zIndex: 1000,
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
				zIndex: 1000
			});
	
	        jQuery(settings.place).append(glassFrame).append(glass);
	
	        jQuery('.' + this.objClass).animate({
	            opacity: this.opacity
	        }, this.showtime, function(){
	            if (typeof callback != 'undefined'){
	                callback();
	            } 
	        });
	        
            // Refresh position
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
            
            // On window resize
            window.onresize = function(){
                refreshPosition.call(that);
            };
	        
	        // release memory in IE
	        glassFrame = null;
	        glass = null;
	    },
	
	    // Auto close glass object. 
	    // Remove object from DOM
	    autoclose: function() {
	        var className = this.objClass,
	            Glass = this;
	        setTimeout(function() {
	            Glass.close();
	        }, this.autoclosetime);
	    },
	
	    // Close glass object. 
	    // Remove object from DOM
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