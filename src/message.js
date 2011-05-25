pklib = this.pklib || {};

pklib.message = (function(){
	
	return {

        // Class name to new layer
        objClass: 'pklib-message-wrapper',

        // Text what be show in layer popup
        text: '',

        // Time to auto close layer popup
        autoclosetime: 500,

        // Time to close layer popup
        closetime: 500,

        // Time to animate fade layer popup in browser
        showtime: 500,
        
        // State addon default css to layer popup in browser
        defaultCSS: false,

        // Show layer popup. Default popup will be centered in horizontal and vertical. 
        // Add object to DOM
        show: function(callback) {
            var that = this,
	            message = jQuery('<div />').addClass(this.objClass).css({
					position: 'absolute',
					opacity: 0,
					zIndex: 2000
	            }).html(this.text);
	        
	        if(this.defaultCSS){
	            message.css({
					width: 300,
					height: 200,
					border: '1px solid #000000',
					color: '#000000',
					background: '#ffffff'
				});
	        }
	        
            jQuery('body').append(message);

            jQuery('.' + this.objClass).animate({
                opacity: 1
            }, this.showtime, function(){
                if (typeof callback === 'function'){
                    callback();
                }
            });
            
            // Refresh position
            function refreshPosition(){
                var leftCssValue = (jQuery(window).width() - message.width()) / 2 + jQuery(window).scrollLeft(),
                    topCssValue = (jQuery(window).height() - message.height()) / 2 + jQuery(window).scrollTop();
                    
                jQuery('.' + this.objClass).css({
                    left: leftCssValue,
                    top: topCssValue
                });
            }
            
            // Per 0.01 sec
            setInterval(function(){
                refreshPosition.call(that);
            }, 10);
        },

        // Auto close layer popup. 
        // Remove object from DOM
        autoclose: function() {
            var className = this.objClass,
                Message = this;
                
            setTimeout(function() {
                Message.close();
            }, this.autoclosetime);
        },

        // Close layer popup. 
        // Remove object from DOM
        close: function() {
            var className = this.objClass;
            jQuery('.' + className).animate({
                opacity: 0
            }, this.closetime, function() {
                jQuery('.' + className).remove();
            });
        },

        // Refresh content in layer popup, what will happened by remove and create object again. 
        // Remove object from DOM. Add object to DOM
        refresh: function() {
            this.close();
            this.show();
        }
        
	};
	
})();