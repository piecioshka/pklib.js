/**
 * Pklib - Piotr Kowalski library Library to use cases
 *
 * @depends jQuery 1.4+
 */

/**
 * Add alias name 'bind' to 'addEvent'.
 * This is better to syntax language
 */
jQuery.fn.addEvent = jQuery.fn.bind;

/**
 * Add alias 'unbind' to 'removeEvent'.
 * This is better to syntax language
 */
jQuery.fn.removeEvent = jQuery.fn.unbind;

/**
 * Pklib Body Class
 */
var Pklib = {

	author : 'Piotr Kowalski',
	www : 'http://pklib.pl/',
	version: '0.5.7',
	lastModified : document.lastModified,
	self : this,

    /**
     * Utils object contains useful function
     */
	Utils : {

        /**
         * Clear content from parameter element after focus.
         * On blur if content doesn't change is restore.
         *
         * @param jQuery object objectToClear | Object was be clear after focus 
         */
		clearfocus: function(objectToClear){
			objectToClear.each(function(i, v) {
				v.defaultValue = $(v).val();
			});

			objectToClear.addEvent('focus', function() {
				if ($(this).val() == $(this)[0].defaultValue) $(this).val('');
			}).addEvent('blur', function() {
				if ($(this).val() == '') $(this).val($(this)[0].defaultValue);
			});
		},

        /**
         * Add event to open new window with address that how is href attribute.
         * To add event in special place use function parameter - place.
         *
         * @param string place | Place were find all element <a> and add remove all previous trigger click
         * and add event to open link in new window or tab.             
         */
		outerlink : function(place) {
			if (place == undefined) place = '';

			$(place + ' a').each(function() {
				if ($(this).attr('rel') == 'outerlink') {
					$(this).removeEvent('click').addEvent('click', function() {
						window.open ($(this).attr('href'));
						return false;
					});
				}
			});
		},

        /**
         * Add to jQuery element event to confirm go to link.
         *
         * @param jQuery object element | Element which add event click and confirm go to link.
         * @param string text | String what be show in confirmation window.
         */
		confirm : function(element, text) {
			if (text == undefined) text = 'Are You sure?';

			element.addEvent('click', function() {
				if (confirm(text)) {
					window.location = $(this).attr('href');
				}
				return false;
			});
		},

        /**
         * Array with chars which are trim in tail and head word.
         */
		chars : [ ' ', '-', '_' ],

        /**
         * Trim word on the head ( left side ).
         *
         * @param string word | Word which be left trim.
         * @return string | Head trim word
         */
		ltrim : function(word) {
			for ( var i = 0; i < this.chars.length; ++i) {
				while (true) {
					if (word.substr(0, 1) == this.chars[i]) {
						word = word.substr(1);
					} else {
						return word;
					}
				}
			}
			return word;
		},

        /**
         * Trim word on the tail ( right side ).
         *
         * @param string word | Word which be right trim.
         * @return string | Tail trim word
         */
		rtrim : function(word) {
			for ( var i = 0; i < this.chars.length; ++i) {
				while (true) {
					if (word.substr(word.length - 1) == this.chars[i]) {
						word = word.substr(0, word.length - 1);
					} else {
						return word;
					}
				}
			}
			return word;
		},

        /**
         * Trim word on the both side, tail and head ( left and right side ).
         *
         * @param string word | Word which be trim on the both side.
         * @return string | Trim word 
         */
		trim : function(word) {
			return this.ltrim(this.rtrim(word));
		},

        /**
         * Replace special chars in text by normalize chars.
         *
         * @param string text | Text which be normalize.
         * @return string | Normalize text.
         */
		slug : function(text) {
			var result = '';
			for ( var i = 0; i < text.length; ++i) {
				var letter = text[i].toLowerCase();
				switch (letter) {
                    case 'e': result += 'e'; break;
                    case 'ó': result += 'o'; break;
                    case 'ą': result += 'a'; break;
                    case 'ś': result += 's'; break;
                    case 'ł': result += 'l'; break;
                    case 'ż':
                    case 'ź': result += 'z'; break;
                    case 'ć': result += 'c'; break;
                    case 'ń': result += 'n'; break;

                    case ' ':
                    case '!':
                    case '?':
                    case '+': result += '-'; break;
                    default: result += letter;
				}
			}
			return result;
		}
	},

    /**
     * Message Object - represent layer popup.
     */
	Message : {

        /**
         * Class name to new layer.
         */
        objClass : 'Pklib-Message-Wrapper',

        /**
         * Text what be show in layer popup.
         */
        text : '',

        /**
         * Time to auto close layer popup.
         */
        autoclosetime: 1500,

        /**
         * Time to close layer popup.
         */
        closetime: 1000,

        /**
         * Time to animate fade layer popup in browser.
         */
        showtime: 1500,

        /**
         * Show layer popup.
         * Default popup will be centered in horizontal and vertical.
         *
         * Add object to DOM.
         */
		show : function() {
            var message = $('<div />').addClass(this.objClass).html(this.text);

            message.css({
                color: '#000000',
                top: '-99999px',
                width: 300,
                height: 200,
                border: '1px solid #000000',
                background: '#ffffff',
                opacity: 0,
                zIndex: 2000
            });

            $('body').append(message);

            message.css({
                position: 'fixed',
                left: ($(window).width() - message.width() )/2,
                top: ($(window).height() - message.height() )/2
            });

            message.animate({
                opacity: 1
            }, this.showtime);

            //IE6 Hack
            if( self.Browser.getName() == 'msie' && parseInt(self.Browser.getVersion()) < 7 ){
                setInterval(function(){
                    message.css({
                        position: 'absolute',
                        left: ($(window).width() - message.width() )/2 + $(window).scrollLeft(),
                        top: ($(window).height() - message.height() )/2 + $(window).scrollTop()
                    });
                }, 1);
            }
		},

        /**
         * Auto close layer popup.
         * Remove object from DOM.
         */
		autoclose : function() {
            var className = this.objClass;
            setTimeout(function(){
                $('.' + className).animate({
                    opacity: 0
                }, this.autoclosetime, function(){
                   $('.' + className).remove();
                });
            }, this.autoclosetime);
		},

        /**
         * Close layer popup.
         * Remove object from DOM.
         */
		close : function() {
			$('.' + this.objClass).animate({
                opacity: 0
            }, this.closetime, function(){
                $(this).remove();
            });
		},

        /**
         * Refresh content in layer popup, what will happened by remove and create object again.
         *
         * Remove object from DOM. 
         * Add object to DOM.
         */
        refresh: function(){
            this.close();
            this.show();
        }

	},

    /**
     * Loader object - represent loader.
     */
    Loader : {
        
        /**
         * Class name to new layer.
         */
        objClass : 'Pklib-Loader-Wrapper',

        /**
         * Time to auto close loader.
         */
        autoclosetime: 1500,

        /**
         * Time to close loader.
         */
        closetime: 1000,

        /**
         * Time to animate fade loader in browser.
         */
        showtime: 1500,

        /**
         * Url to loader image
         */
        loaderImage : 'http://piecioshka.pl/img/ajax-loader.gif',

        /**
         * Show loader in browser.
         * Default will be show in body.
         * Default not be centered.
         *
         * Add object to DOM.
         *
         * @param string place | Place what loader will be add
         * @param boolean center | If true, loader will be centered, else not.
         */
		show : function(place, center) {
		    if( place == undefined ) place = 'body';

            var loader = $('<img />').addClass(this.objClass).attr({
                src: this.loaderImage,
                alt: 'Loader'
            });

            loader.css({
                position: 'absolute',
                color: '#000000',
                width: 32,
                height: 32,
                background: 'transparent',
                opacity: 0,
                zIndex: 2000
            });

            $(place).append(loader);

            if(center){
                loader.css({
                    left: ($(window).width() - loader.width() )/2,
                    top: ($(window).height() - loader.height() )/2
                });
            } else {
                loader.css({
                    left: 0,
                    top: 0
                });
            }

		    loader.animate({
                opacity: 1
            }, this.showtime);
		},

        /**
         * Auto close loader.
         * Remove object from DOM.
         */
		autoclose : function() {
            var className = this.objClass;
            setTimeout(function(){
                $('.' + className).animate({
                    opacity: 0
                }, this.autoclosetime, function(){
                   $('.' + className).remove();
                });
            }, this.autoclosetime);
		},

        /**
         * Close loader.
         * Remove object from DOM.
         */
		close : function() {
            $('.' + this.objClass).animate({
                opacity: 0
            }, this.closetime, function(){
                $(this).remove();
            });
		}

	},

    /**
     * Glass object - present transparent max width and max height box
     */
	Glass : {

        /**
         * Class name to glass
         */
		objClass : 'Pklib-Glass-Wrapper',

        /**
         * Opacity what be have a container.
         */
		opacity : 0.5,

        /**
         * Auto close time glass.
         */
        autoclosetime: 1500,

        /**
         * Close time glass.
         */
        closetime: 1000,

        /**
         * Show time glass.
         */
        showtime: 1500,

        /**
         * Show glass in browser.
         * Have max windth and max height.
         *
         * Add object to DOM.
         */
		show : function() {
			var glassFrame = $('<iframe />').addClass(this.objClass); //IE6 Hack
			var glass = $('<div />').addClass(this.objClass);

            var winWidth = $(window).width();
            var winHeight = $(window).height();
            
            var docWidth = $(document).width();
            var dovHeight = $(document).height();

            var maxWidth, maxHeight = 0;

			if ( docWidth > winWidth) {
			    maxWidth = docWidth;
			} else if ( docWidth > winWidth) {
                maxWidth = winWidth;
			} else {
			    maxWidth = winWidth;
			}

			if ( dovHeight > winHeight) {
                maxHeight = dovHeight;
            } else if ( dovHeight < winHeight) {
                maxHeight = winHeight
			} else {
			    maxHeight = winHeight
			}

			glassFrame.css( {
				height : maxHeight,
				width : maxWidth - 4,
				position : 'absolute',
				top : 0,
				left : 0,
				opacity : 0,
                zIndex: 1000
			});

			glass.css( {
				height : maxHeight,
				width : maxWidth,
				position : 'absolute',
				top : 0,
				left : 0,
				background : '#000000',
				overflow : 'hidden',
				opacity : 0,
                zIndex: 1000
			});

            $('body').append(glassFrame).append(glass);

            glassFrame.animate({
                opacity: this.opacity
            }, this.showtime);

			glass.animate({
			    opacity: this.opacity
            }, this.showtime);
		},

        /**
         * Auto close glass object.
         *
         * Remove object from DOM.
         */
		autoclose : function() {
            var className = this.objClass;
            setTimeout(function(){
                $('.' + className).animate({
                    opacity: 0
                }, this.autoclosetime, function(){
                   $('.' + className).remove();
                });
            }, this.autoclosetime);
		},

        /**
         * Close glass object.
         *
         * Remove object from DOM.
         */
		close : function() {
			$('.' + this.objClass).animate({
			    opacity: 0
            }, this.closetime, function(){
                $(this).remove();
            });
		}
	},

    /**
     * Object to present browser.
     */
	Browser : {

        /**
         * Get short browser name.
         *
         * @return string | Short object name.
         */
        getName : function(){
            if( /msie/.test( navigator.userAgent.toLowerCase() ) ) return 'msie';
            if( /chrome/.test( navigator.userAgent.toLowerCase() ) ) return 'chrome';
            if( /safari/.test( navigator.userAgent.toLowerCase() ) ) return 'safari';
            if( /opera/.test( navigator.userAgent.toLowerCase() ) ) return 'opera';
            if( /mozilla/.test( navigator.userAgent.toLowerCase() ) ) return 'mozilla';
            return null;
        },

        /**
         * Get browser version.
         *
         * @return string
         */
		getVersion : function() {
			return $.browser.version;
		}

	},

    /**
     * Present file in library.
     */
	File : {

        /**
         * Attach file on page.
         *
         * Add object to DOM.
         *
         * @param string tag | Tag which be create.
         * @param string src | Url or src what element has
         * @param string type | New element type
         * @param string section | Html main section (head|body)
         */
		attach : function(tag, src, type, section) {
			if (tag == undefined) return false;
			if (src == undefined) return false;
			if (type == undefined) return false;
			if (section == undefined) return false;

			var file = document.createElement(tag);
			file.src = src;
			file.type = type;

			document.getElementsByTagName(section)[0].appendChild(file);
		}
		
	},

    /**
     * Validate object present
     */
	Validate : {

        /**
         * Check if object doesn't empty.
         *
         * @param jQuery object jObject | Validate element.
         * @return boolean
         */
	    empty : function(jObject){
	        var type = typeof jObject;
	        if( type == 'string') return ( jObject == '' );
	        if( type == 'number') return ( jObject == 0 );
	        if( type == 'object') return ( jObject.length == 0 );
	        return false;
	    }

	}

};