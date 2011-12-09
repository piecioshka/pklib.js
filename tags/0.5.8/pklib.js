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
		for(var efect = 0; efect < 3; ++efect){
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
		}
		return false;
	};
}

/**
 * Pklib Definition
 * Pklib Initialization
 */
var Pklib = {

    author : 'Piotr Kowalski',
    www : 'http://pklib.pl/',
    version: '0.5.8',
    lastModified : document.lastModified,
    
    /**
     * Utils object contains useful function
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
            if( Pklib.Validate.empty (objectToClear) ) {
                throw new Error('Object to clear doesn\'t exists!');
            }
            
            objectToClear.each(function(i, v) {
                v.defaultValue = $(v).val();
            });
            objectToClear.addEvent('focus', function clearContent() {
                if ($(this).val() == $(this)[0].defaultValue) $(this).val('');
            }).addEvent('blur', function setContent() {
                if ($(this).val() == '') $(this).val($(this)[0].defaultValue);
            });
            return true;
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
            if (typeof place === 'undefined') {
                place = 'body';
            } else if ( Pklib.Validate.empty (place) ) {
                throw new Error('Place doesn\'t exists!');
            }

            $(place).find('a').each(function() {
                if ($(this).attr('rel') == 'outerlink') {
                    $(this).removeEvent('click').addEvent('click', function outerlink() {
                        window.open($(this).attr('href'));
                        return false;
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
            if ( Pklib.Validate.empty (element) ) {
                throw new Error('Element doesn\'t exists');
            }
            if (typeof text === 'undefined') {
                text = 'Are You sure?';
            }

            element.addEvent('click', function confirmation() {
            	return confirm(text);
            });
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
            if( typeof word !== 'string' ) {
                throw new Error('Word doesn\'t string!');
            }
        	for(var i = 0; i < word.length; ++i){
        		if(word[i].isLetter()) break;
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
            if( typeof word !== 'string' ) {
                throw new Error('Word doesn\'t string!');
            }
        	for(var i = word.length-1; i > 0; --i){
        		if(word[i].isLetter()) break;
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
            if( typeof word !== 'string' ) {
                throw new Error('Word doesn\'t string!');
            }
            return this.ltrim(this.rtrim(word));
        },

        /**
         * Replace special chars in text by normalize chars.
         *
         * @param text | Text which be normalize.
         * @return string | Normalize text.
         */
        slug : function(text) {
            if( typeof text !== 'string' ) {
                throw new Error('Word doesn\'t string!');
            }

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
         * Default popup will be centered in horizontal and vertical.
         *
         * Add object to DOM.
         *
         * @return boolean
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
                left: ($(window).width() - message.width() ) / 2,
                top: ($(window).height() - message.height() ) / 2
            });

            message.animate({
                opacity: 1
            }, this.showtime);

            //IE6 Hack
            if ( Pklib.Browser.getName() == 'msie' && parseInt( Pklib.Browser.getVersion()) < 7) {
                setInterval(function() {
                    message.css({
                        position: 'absolute',
                        left: ($(window).width() - message.width() ) / 2 + $(window).scrollLeft(),
                        top: ($(window).height() - message.height() ) / 2 + $(window).scrollTop()
                    });
                }, 1);
            }
            return true;
        },

        /**
         * Auto close layer popup.
         * Remove object from DOM.
         *
         * @return boolean
         */
        autoclose : function() {
            var className = this.objClass;
            setTimeout(function() {
                $('.' + className).animate({
                    opacity: 0
                }, this.autoclosetime, function() {
                    $('.' + className).remove();
                    return true;
                });
            }, this.autoclosetime);
        },

        /**
         * Close layer popup.
         * Remove object from DOM.
         *
         * @return boolean
         */
        close : function() {
            $('.' + this.objClass).animate({
                opacity: 0
            }, this.closetime, function() {
                $(this).remove();
                 return true;
            });
        },

        /**
         * Refresh content in layer popup, what will happened by remove and create object again.
         *
         * Remove object from DOM.
         * Add object to DOM.
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
         * @param place | Place what loader will be add
         * @param center | If true, loader will be centered, else not.
         * @return boolean
         */
        show : function(place, center) {
            if (typeof place === 'undefined') {
                place = 'body';
            } else if ( Pklib.Validate.empty (place) ) {
                throw new Error('Place is not exists!');
            }
            if (typeof center === 'undefined') {
                center = false;
            } else if (typeof center !== 'undefined' && typeof center !== 'boolean') {
                throw new Error('Please boolean value!');
            }

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

            if (center) {
                loader.css({
                    left: ($(window).width() - loader.width() ) / 2,
                    top: ($(window).height() - loader.height() ) / 2
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

            return true;
        },

        /**
         * Auto close loader.
         * Remove object from DOM.
         *
         * @return boolean
         */
        autoclose : function() {
            var className = this.objClass;
            setTimeout(function() {
                $('.' + className).animate({
                    opacity: 0
                }, this.autoclosetime, function() {
                    $('.' + className).remove();
                    return true;
                });
            }, this.autoclosetime);
        },

        /**
         * Close loader.
         * Remove object from DOM.
         *
         * @return boolean
         */
        close : function() {
            $('.' + this.objClass).animate({
                opacity: 0
            }, this.closetime, function() {
                $(this).remove();
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
         * Have max width and max height.
         *
         * Add object to DOM.
         * 
         * @param place | Place to show glass
         * @return boolean
         */
        show : function(place) {
            if (typeof place === 'undefined') {
                place = 'body';
            } else if ( Pklib.Validate.empty (place) ) {
                throw new Error('Place is not exists!');
            }

            var glassFrame = $('<iframe />').addClass(this.objClass);
            var glass = $('<div />').addClass(this.objClass);

            var winWidth = $(window).width();
            var winHeight = $(window).height();

            var docWidth = $(document).width();
            var dovHeight = $(document).height();

            var maxWidth, maxHeight = 0;

            if (docWidth > winWidth) {
                maxWidth = docWidth;
            } else if (docWidth < winWidth) {
                maxWidth = winWidth;
            } else {
                maxWidth = winWidth;
            }

            if (dovHeight > winHeight) {
                maxHeight = dovHeight;
            } else if (dovHeight < winHeight) {
                maxHeight = winHeight;
            } else {
                maxHeight = winHeight;
            }

            glassFrame.css({
                height : maxHeight,
                width : maxWidth - 4,
                position : 'absolute',
                top : 0,
                left : 0,
                opacity : 0,
                zIndex: 1000
            });

            glass.css({
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

            $(place).append(glassFrame).append(glass);

            glassFrame.animate({
                opacity: this.opacity
            }, this.showtime);

            glass.animate({
                opacity: this.opacity
            }, this.showtime);

            return true;
        },

        /**
         * Auto close glass object.
         * Remove object from DOM.
         *
         * @return boolean
         */
        autoclose : function() {
            var className = this.objClass;
            setTimeout(function() {
                $('.' + className).animate({
                    opacity: 0
                }, this.autoclosetime, function() {
                    $('.' + className).remove();
                    return true;
                });
            }, this.autoclosetime);
        },

        /**
         * Close glass object.
         * Remove object from DOM.
         * 
         * @return boolean
         */
        close : function() {
            $('.' + this.objClass).animate({
                opacity: 0
            }, this.closetime, function() {
                $(this).remove();
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
            return $.browser.version;
        }

    },

    /**
     * Present file in library.
     */
    File : {

        /**
         * Attach file on site.
         *
         * Add object to DOM.
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
     * Validate object present
     */
    Validate : {

        /**
         * Check if object doesn't empty.
         *
         * @param jObject | Validate element.
         * @return boolean
         */
        empty : function(jObject) {
            var type = typeof jObject;
            if (type === 'string') return ( jObject == '' );
            if (type === 'number') return ( jObject == 0 );
            if (type === 'object') return ( jObject.length == 0 );
            return false;
        }

    }

};