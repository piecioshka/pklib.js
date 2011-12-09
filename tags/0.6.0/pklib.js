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
 * Remove element.
 *
 * On each loop array was smaller by one, so if we have delete first and second element
 * we put in arguments 0, and on the next arguments must be decrement by one.
 *
 * @return array
 */
if( !Array.prototype.remove ){
	Array.prototype.remove = function() {
		for(var i = 0; i < arguments.length; ++i){
			this.splice(arguments[i], 1);
		}
	    return this;
	};
}

/**
 * Remove duplicates from array
 *
 * @return array
 */
if( !Array.prototype.unique ){
	Array.prototype.unique = function() {
		for(var effect = 0; efect < 3; ++effect){
			for(var i = 0; i < this.length; ++i){
				for(var j = i + 1 ; j < this.length; ++j){
					if( this[i] == this[j]) this.remove(j);
				}
			}
		}
	    return this;
	};
}

/**
 * Check value if is in array
 *
 * @return boolean
 */
if( !Array.prototype.inArray){
	Array.prototype.inArray = function(parameter) {
		for(var i = 0; i < this.length; ++i){
			if(this[i] == parameter) return true;
		}
		return false;
	};
}

/**
 * Check if string is letter
 *
 * @return boolean
 */
if( !String.prototype.isLetter ){
	String.prototype.isLetter = function() {
		var alphabet = ['q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m'];
		if(this.length == 1){
			parameter = Pklib.Utils.slug(this[0]);
			for(var i = 0; i < alphabet.length; ++i){
				if (parameter == alphabet[i]) return true;
			}
			return false;
		}
		return false;
	};
}

/**
 * Pklib Definition and Initialization
 */
var Pklib = {

    author : 'Piotr Kowalski',
    www : 'http://pklib.pl/',
    version: '0.6.0',
    lastModified : document.lastModified,

    /**
     * Utilities object contains useful function
     */
    Utils : {

        /**
         * Clear content from parameter element after focus.
         * On blur if content doesn't change is restore.
         *
         * @param objectToClear | Object was be clear after focus
         * @return boolean
         */
        clearfocus: function(objectToClear) {
            if( !Pklib.Validate.empty ( jQuery(objectToClear) ) ) {
	            jQuery(objectToClear).each(function(i, v) {
	                v.defaultValue = jQuery(v).val();
	            });
	            jQuery(objectToClear).addEvent('focus', function clearContent() {
	                if (jQuery(this).val() == jQuery(this)[0].defaultValue) {
	                	jQuery(this).val('');
	                }
	            }).addEvent('blur', function setContent() {
	                if (jQuery(this).val() == '') {
	                	var value = jQuery(this)[0].defaultValue;
	                	jQuery(this).val(value);
	                }
	            });
	            return true;
            }
            return false;
        },

        /**
         * Add event to open new window with address that how is href attribute.
         * To add event in special place use function parameter - place.
         *
         * @param place | Place were find all element <a> and add remove all previous trigger click
         * and add event to open link in new window or tab.
         * @return boolean
         */
        outerlink : function(place) {
            if ( Pklib.Validate.empty ( jQuery(place) ) || typeof place === 'undefined' ) {
            	place = 'body';
            }
            jQuery(place).find('a').each(function() {
                if (jQuery(this).attr('rel') == 'outerlink') {
                    jQuery(this).removeEvent('click').addEvent('click', function outerlink(e) {
                        window.open(jQuery(this).attr('href'));
                        e.preventDefault();
                    });
                }
            });
            return true;
        },

        /**
         * Add to jQuery element event to confirm go to link.
         *
         * @param element | Element which add event click and confirm go to link.
         * @param text | String what be show in confirmation window.
         * @return boolean
         */
        confirm : function(element, text) {
            if ( !Pklib.Validate.empty ( jQuery(element) ) ) {
	            text = text || 'Are You sure?';

	            jQuery(element).addEvent('click', function confirmation() {
	            	return confirm(text);
	            });
            }
            return true;
        },

        /**
         * Array with chars which are trim in tail and head word.
         */
        chars : [ ' ', '-', '_' ],

        /**
         * Trim word on the head ( left side ).
         *
         * @param word | Word which be left trim.
         * @return string | Head trim word
         */
        ltrim : function(word) {
            if( typeof word === 'string' ) {
	        	for(var i = 0; i < word.length; ++i){
	        		if(word[i].isLetter()) break;
	        	}
            }
            return word.substr(i);
        },

        /**
         * Trim word on the tail ( right side ).
         *
         * @param word | Word which be right trim.
         * @return string | Tail trim word
         */
        rtrim : function(word) {
            if( typeof word === 'string' ) {
	        	for(var i = word.length-1; i > 0; --i){
	        		if(word[i].isLetter()) break;
	        	}
            }
            return word.substr(1,i);
        },

        /**
         * Trim word on the both side, tail and head ( left and right side ).
         *
         * @param word | Word which be trim on the both side.
         * @return string | Trim word
         */
        trim : function(word) {
            if( typeof word === 'string' ) {
                return this.ltrim(this.rtrim(word));
            }
            return false;
        },

        /**
         * Replace special chars in text by normalize chars.
         *
         * @param text | Text which be normalize.
         * @return string | Normalize text.
         */
        slug : function(text) {
            if( typeof text === 'string' ) {
	            var result = '';
	            for (var i = 0; i < text.length; ++i) {
	                var letter = text[i].toLowerCase().charCodeAt(0);
	                switch (letter) {
	                    case 380:
	                    case 378: result += 'z'; break;
	                    case 347: result += 's'; break;
	                    case 324: result += 'n'; break;
	                    case 322: result += 'l'; break;
	                    case 263: result += 'c'; break;
	                    case 261: result += 'a'; break;
	                    case 243: result += 'o'; break;
	                    case 281: result += 'e'; break;

	                    case 63:
	                    case 43:
	                    case 42:
	                    case 32:
	                    case 33: result += '-'; break;
	                    default: result += String.fromCharCode(letter);
	                }
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
        autoclosetime: 500,

        /**
         * Time to close layer popup.
         */
        closetime: 500,

        /**
         * Time to animate fade layer popup in browser.
         */
        showtime: 500,

        /**
         * Show layer popup.
         * Default popup will be centered in horizontal and vertical. Add object to DOM.
         *
         * @return boolean
         */
        show : function() {
            var message = jQuery('<div />').addClass(this.objClass).css( {
				position : 'absolute',
				color : '#000000',
				width : 300,
				height : 200,
				border : '1px solid #000000',
				background : '#ffffff',
				opacity : 0,
				'z-index' : 2000
			}).html(this.text);

            jQuery('body').append(message);

            message.animate({
                opacity: 1
            }, this.showtime);

            //Automatic positioning
			setInterval(function() {
				message.css( {
					left : (jQuery(window).width() - message.width()) / 2 + jQuery(window).scrollLeft(),
					top : (jQuery(window).height() - message.height()) / 2 + jQuery(window).scrollTop()
				});
			}, 1);
            return true;
        },

        /**
		 * Auto close layer popup. Remove object from DOM.
		 *
		 * @return boolean
		 */
        autoclose : function() {
            var className = this.objClass;
            setTimeout(function() {
                jQuery('.' + className).animate({
                    opacity: 0
                }, this.autoclosetime, function() {
                    jQuery('.' + className).remove();
                    return true;
                });
            }, this.autoclosetime);
        },

        /**
         * Close layer popup. Remove object from DOM.
         *
         * @return boolean
         */
        close : function() {
            jQuery('.' + this.objClass).animate({
                opacity: 0
            }, this.closetime, function() {
            	jQuery(this).remove();
        		return true;
            });
        },

        /**
         * Refresh content in layer popup, what will happened by remove and create object again. Remove object from DOM. Add object to DOM.
         *
         * @return boolean
         */
        refresh: function() {
            this.close();
            this.show();
            return true;
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
        autoclosetime: 500,

        /**
         * Time to close loader.
         */
        closetime: 500,

        /**
         * Time to animate fade loader in browser.
         */
        showtime: 500,

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
         * @param conf | Object include:
         * 			place | Place what loader will be add
         * 			center | If true, loader will be centered, else not.
         * @return boolean
         */
        show : function(config) {
    		var conf = config || {};
            var place = conf.place || 'body';
            var holder = ( place == 'body') ? window : place;
            var center = conf.center || false;
            
            var loader = jQuery('<img />').addClass(this.objClass).attr({
                src: this.loaderImage,
                alt: 'Loader'
            }).css({
                position: 'absolute',
                color: '#000000',
                width: 32,
                height: 32,
                background: 'transparent',
                opacity: 0,
                'z-index': 2000
            });

            jQuery(place).append(loader);

            loader.css({
                left: (center) ? (jQuery(holder).width() - loader.width() ) / 2 : 0,
                top: (center) ? (jQuery(holder).height() - loader.height() ) / 2 : 0
            });

            loader.animate({
                opacity: 1
            }, this.showtime);

            return true;
        },

        /**
         * Auto close loader. Remove object from DOM.
         *
         * @return boolean
         */
        autoclose : function() {
            var className = this.objClass;
            setTimeout(function() {
                jQuery('.' + className).animate({
                    opacity: 0
                }, this.autoclosetime, function() {
                    jQuery('.' + className).remove();
                    return true;
                });
            }, this.autoclosetime);
        },

        /**
         * Close loader. Remove object from DOM.
         *
         * @return boolean
         */
        close : function() {
            jQuery('.' + this.objClass).animate({
                opacity: 0
            }, this.closetime, function() {
                jQuery(this).remove();
                return true;
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
        autoclosetime: 500,

        /**
         * Close time glass.
         */
        closetime: 500,

        /**
         * Show time glass.
         */
        showtime: 500,

        /**
         * Show glass in browser.
         * Have max width and max height. Add object to DOM.
         *
         * @param place | Place to show glass
         * @return boolean
         */
        show : function(config) {
    		var conf = config || {};
            var place = conf.place || 'body';

            var winWidth = jQuery(window).width();
            var winHeight = jQuery(window).height();

            var docWidth = jQuery(document).width();
            var dovHeight = jQuery(document).height();

            var maxWidth, maxHeight = 0;

            if (docWidth > winWidth) {
                maxWidth = docWidth;
            } else if (docWidth <= winWidth) {
                maxWidth = winWidth;
            }

            if (dovHeight > winHeight) {
                maxHeight = dovHeight;
            } else if (dovHeight <= winHeight) {
                maxHeight = winHeight;
            }

            var glassFrame = jQuery('<iframe />').addClass(this.objClass).css( {
				height : maxHeight,
				width : maxWidth - 4,
				position : 'absolute',
				top : 0,
				left : 0,
				opacity : 0,
				'z-index' : 1000
			});

			var glass = jQuery('<div />').addClass(this.objClass).css( {
				height : maxHeight,
				width : maxWidth,
				position : 'absolute',
				top : 0,
				left : 0,
				background : '#000000',
				overflow : 'hidden',
				opacity : 0,
				'z-index' : 1000
			});

            jQuery(place).append(glassFrame).append(glass);

            glassFrame.animate({
                opacity: this.opacity
            }, this.showtime);

            glass.animate({
                opacity: this.opacity
            }, this.showtime);

            return true;
        },

        /**
         * Auto close glass object. Remove object from DOM.
         *
         * @return boolean
         */
        autoclose : function() {
            var className = this.objClass;
            setTimeout(function() {
                jQuery('.' + className).animate({
                    opacity: 0
                }, this.autoclosetime, function() {
                    jQuery('.' + className).remove();
                    return true;
                });
            }, this.autoclosetime);
        },

        /**
         * Close glass object. Remove object from DOM.
         *
         * @return boolean
         */
        close : function() {
            jQuery('.' + this.objClass).animate({
                opacity: 0
            }, this.closetime, function() {
                jQuery(this).remove();
                return true;
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
        getName : function() {
            if (/msie/.test(navigator.userAgent.toLowerCase())) return 'msie';
            if (/chrome/.test(navigator.userAgent.toLowerCase())) return 'chrome';
            if (/safari/.test(navigator.userAgent.toLowerCase())) return 'safari';
            if (/opera/.test(navigator.userAgent.toLowerCase())) return 'opera';
            if (/mozilla/.test(navigator.userAgent.toLowerCase())) return 'mozilla';
            return null;
        },

        /**
         * Get browser version.
         *
         * @return string
         */
        getVersion : function() {
            return jQuery.browser.version;
        }

    },

    /**
     * Present file in library.
     */
    File : {

        /**
         * Attach file on site. Add object to DOM.
         *
         * @param json object | Inlude element which was used to append file to site
         * @return object
         */
        attach : function(data) {
        	var file = document.createElement( data.tag );
    		for( var key in data){
                file[key] = data[key];
    		}
    		return document.getElementsByTagName(data.section)[0].appendChild(file);
        }

    },

    /**
     * Validate - object present
     */
    Validate : {

        /**
         * Check if object doesn't empty.
         *
         * @param object | Validate element.
         * @return boolean
         */
        empty : function(object) {
            var type = typeof object;
            if (type === 'string') return ( object == '' );
            if (type === 'number') return ( object == 0 );
            if (type === 'object') return ( object.length == 0 );
            return false;
        }

    },
    
    /**
     * Cookie - object represent
     */
    Cookie : {
       
        /**
         * Create Cookie 
         * 
         * @param {string} name
         * @param {string} value
         * @param {string} days
         */
        create : function (name, value, days) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                var expires = "; expires=" + date.toGMTString();
            } else {
                var expires = "";
            }
            document.cookie = name + "=" + value + expires + "; path=/";
        },
        
        /**
         * Read Cookie
         * 
         * @param {string} name
         */
        read : function (name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            
            for(var i=0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(nameEQ) == 0) {
                    return c.substring(nameEQ.length, c.length);
                }
            }
            return null;
        },
        
        /**
         * Modify real Cookie
         * 
         * @param {string} name
         */
        erase : function (name) {
            this.create(name, '', -1);
        }

    }

};