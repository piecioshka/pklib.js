pklib = this.pklib || {};

pklib.message = (function(){

	return {

        objClass: 'pklib-message-wrapper',

        text: '',

        autoclosetime: 500,

        closetime: 500,

        showtime: 500,

        defaultCSS: false,

        show: function(callback) {
            var that = this,
	            message = jQuery('<div />').addClass(this.objClass).css({
					position: 'absolute',
					opacity: 0,
					'z-index': 2000
	            }).html(this.text);

	        if(this.defaultCSS){
	            message.css({
					width: 300,
					height: 200,
					border: '1px solid #999999',
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

            // On window resize
            window.onresize = function(){
                refreshPosition.call(that);
            };

            refreshPosition.call(that);
        },

        autoclose: function() {
            var className = this.objClass,
                message = this;

            setTimeout(function() {
                message.close();
            }, this.autoclosetime);
        },

        close: function() {
            var className = this.objClass;
            jQuery('.' + className).animate({
                opacity: 0
            }, this.closetime, function() {
                jQuery('.' + className).remove();
            });
        },

        refresh: function() {
            this.close();
            this.show();
        }

	};

})();
