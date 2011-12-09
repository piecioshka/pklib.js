/*!
 * Pklib JavaScript Library 0.6.1
 * http://pklib.com/
 * 
 * Copyright 2011, Piotr Kowalski
 * GNU General Public License
 * http://pklib.com/license
 * 
 * Dependence jQuery 1.3.x or high!
 * http://jquery.com/
 * 
 * Date: Wed Mar 16 2011 20:44:09 GMT+0100
 */

if (typeof jQuery != 'function'){
    throw Error('jQuery is need\'ed ! Please visit: http://jquery.com/');
}

// Add alias name 'bind' to 'addEvent'. This is better to syntax language
jQuery.fn.addEvent = jQuery.fn.bind;

// Add alias 'unbind' to 'removeEvent'. This is better to syntax language
jQuery.fn.removeEvent = jQuery.fn.unbind;

// Remove element in array
if (!Array.prototype.remove ){
	Array.prototype.remove = function() {
		for(var i = 0; i < arguments.length; ++i){
			if (typeof this.splice != 'undefined') this.splice(arguments[i], 1);
		}
	    return this;
	};
}

// Remove duplicates from array
if (!Array.prototype.unique ){
	Array.prototype.unique = function() {
		for(var effect = 0; effect < 3; ++effect){
			for(var i = 0; i < this.length; ++i){
				for(var j = i + 1 ; j < this.length; ++j){
					if (this[i] == this[j]) this.remove(j);
				}
			}
		}
	    return this;
	};
}

// Check value if is in array
if (!Array.prototype.inArray){
	Array.prototype.inArray = function(parameter) {
		for(var i = 0; i < this.length; ++i){
			if (this[i] == parameter) return true;
		}
		return false;
	};
}

// Check if string is letter
if (!String.prototype.isLetter ){
	String.prototype.isLetter = function() {
		if (this.length == 1){
            var ascii = Pklib.Utils.slug(this[0]).charCodeAt(),
                lowercase = Pklib.Utils.ascii.lower,
                uppercase = Pklib.Utils.ascii.upper;
            if (lowercase.inArray(ascii) || uppercase.inArray(ascii)){
                return true;
            }
			return false;
		}
		return false;
	};
}

// Pklib Definition and Initialization
var Pklib = {

    author: 'Piotr Kowalski',
    www: 'http://pklib.pl/',
    version: '0.6.1',

    // Utilities object contains useful function
    Utils: {

        // Clear content from parameter element after focus. 
    	// On blur if content doesn't change is restore
        clearfocus: function(objectToClear) {
            if (!Pklib.Validate.empty(jQuery(objectToClear))) {
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

        // Add event to open new window with address that how is href attribute. 
        // To add event in special place use function parameter - place
        outerlink: function(place) {
            if (Pklib.Validate.empty ( jQuery(place) ) || typeof place == 'undefined') {
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
        },

        // Add to jQuery element event to confirm go to link
        confirm: function(element, text) {
            if (!Pklib.Validate.empty(jQuery(element))) {
	            text = text || 'Are You sure?';

	            jQuery(element).addEvent('click', function confirmation() {
	            	return confirm(text);
	            });
            }
            return true;
        },
        
        // ASCII codes for letters only.
    	// Array started by 'qwerty', ended on 'vbnm'
        ascii: {
            
            // Lower case letters
            lower: [113,119,101,114,116,121,117,105,111,112,97,115,100,102,103,104,106,107,108,122,120,99,118,98,110,109],
            
            // Upper case Letters
            upper: [81,87,69,82,84,89,85,73,79,80,65,83,68,70,71,72,74,75,76,90,88,67,86,66,78,77]
            
        },

        // Array with chars which are trim in tail and head word.
        chars: [' ', '-', '_'],

        // Trim word on the head ( left side )
        ltrim: function(word) {
            if (typeof word == 'string' ) {
	        	for(var i = 0; i < word.length; ++i){
	        		if (this.chars.inArray(word[i])) {
                        word = word.substr(i);
                        i = 0;
                    } else {
                        break;
                    }
	        	}
            }
            return word.substr(i);
        },

        // Trim word on the tail ( right side )
        rtrim: function(word) {
            if (typeof word == 'string' ) {
	        	for(var i = word.length-1; i > 0; --i){
	        		if (this.chars.inArray(word[i])) {
                        word = word.substr(0, i);
                    } else {
                        break;
                    }
	        	}
            }
            return word.substr(0, i+1);
        },

        // Trim word on the both side, tail and head ( left and right side )
        trim: function(word) {
            if (typeof word == 'string' ) {
                return this.ltrim(this.rtrim(word));
            }
            return false;
        },

        // Replace special chars in text by normalize chars
        slug: function(text) {
            if (typeof text == 'string') {
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
            return text;
        }
    },

    // Message Object - represent layer popup
    Message: {

        // Class name to new layer
        objClass: 'Pklib-Message-Wrapper',

        // Text what be show in layer popup
        text: '',

        // Time to auto close layer popup
        autoclosetime: 500,

        // Time to close layer popup
        closetime: 500,

        // Time to animate fade layer popup in browser
        showtime: 500,

        // Show layer popup. Default popup will be centered in horizontal and vertical. 
        // Add object to DOM
        show: function(callback) {
            var that = this,
                message = jQuery('<div />').addClass(this.objClass).css({
    				position: 'absolute',
    				color: '#000000',
    				width: 300,
    				height: 200,
    				border: '1px solid #000000',
    				background: '#ffffff',
    				opacity: 0,
    				zIndex: 2000
    			}).html(this.text);

            jQuery('body').append(message);

            jQuery('.' + this.objClass).animate({
                opacity: 1
            }, this.showtime, function(){
                if (typeof callback == 'function'){
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

    },

    // Loader object - represent loader
    Loader: {

        // Class name to new layer
        objClass: 'Pklib-Loader-Wrapper',

        // Class name to new layer
        objClassPercent: this.objClass + '-Percent',

        // Time to auto close loader
        autoclosetime: 500,

        // Time to close loader
        closetime: 500,

        // Time to animate fade loader in browser
        showtime: 500,

        // Url to loader image
        loaderImage: 'http://pklib.com/img/icons/loader.gif',
        
        // Alternative text
        loaderImageAlt: 'Loader', 

        // Show loader in browser. Default will be show in body. 
        // Default not be centered. Add object to DOM
        show: function(config, callback) {
            var settings = {
                place: 'body',
                holder: null,
                center: false,
                percent: false,
                percentMargin: 0
            };
            jQuery.extend(settings, config);
            settings.holder = (settings.place == 'body') ? window : settings.place;
            
            var placeHolderChildrens = jQuery(settings.holder).children(),
                insideLoaders = placeHolderChildrens.filter('.' + this.objClass),
                insideLoaderPercents = placeHolderChildrens.filter('.' + this.objClassPercent);
                
            if (!Pklib.Validate.empty(insideLoaders.length)){
                this.showtime += 300;
                insideLoaders.remove();
                insideLoaderPercents.remove();
            }
            
            var loader = jQuery('<img />').attr({
                src: this.loaderImage,
                alt: this.loaderImageAlt
            }).css({
                position: 'absolute',
                width: 32,
                height: 32,
                opacity: 0,
                zIndex: 2000
            }).addClass(this.objClass);
            
            jQuery(settings.place).append(loader);
            
            var leftCssVal = 0,
                topCssVal = 0;
            
            if (settings.center) {
                leftCssVal = (jQuery(settings.holder).width() - loader.width()) / 2;
                topCssVal = (jQuery(settings.holder).height() - loader.height() ) / 2;
            }
            
            jQuery('.' + this.objClass).css({
                left: leftCssVal,
                top: topCssVal
            }).animate({
                opacity: 1
            }, this.showtime, function(){
                if (typeof callback != 'undefined'){
                    callback();
                }
            });
            
            if (settings.percent){
                var percentCssClass = this.objClassPercent,
                    percent = jQuery('<span />').css({
                    position: 'absolute',
                    width: loader.width(),
                    textAlign: 'center',
                    opacity: 0,
                    zIndex: 2002
                }).addClass(percentCssClass);
                
                jQuery(settings.place).append(percent);
                
                var percentProgress = 0,
                    percentProgressInterval = setInterval(function(){
                    if (percentProgress <= 100) {
                        jQuery('.' + percentCssClass).text(percentProgress + '%');
                        percentProgress += 1;
                    } else {
                        clearInterval(percentProgressInterval);
                    }
                }, 100);
                
                var topMargin = ((loader.height() - parseInt(percent.css('line-height'), 10)) / 2 );
                
                jQuery('.' + percentCssClass).css({
                    left: leftCssVal,
                    top: topCssVal + topMargin + settings.percentMargin
                }).animate({
                    opacity: 1
                }, this.showtime);
            }
            
            // release memory in IE
            loader = null;
            percent = null;
        },

        // Auto close loader. 
        // Remove object from DOM
        autoclose: function(config) {
            var settings = config || {},
                Loader = this;
            setTimeout(function(){
                Loader.close(settings);
            }, this.autoclosetime);
        },

        // Close loader. Remove object from DOM
        close: function(config) {
            var settings = {
                    place: 'body'
                },
                Loader = this;
            jQuery.extend(settings, config);
            
            var className = settings.place + ' .' + this.objClass,
                classNamePercent = settings.place + ' .' + this.objClassPercent,
                loaderElementCssClass = [className, classNamePercent],
                animationComplete = function() {
                    jQuery.each(loaderElementCssClass, function(i,val){
                        jQuery(val).remove();
                    });
                };
            
            jQuery.each(loaderElementCssClass, function(i,val){
                jQuery(val).animate({
                    opacity: 0
                }, Loader.closetime, animationComplete);
            });
        }

    },

    // Glass object - present transparent max width and max height box
    Glass: {

        // Class name to glass
        objClass: 'Pklib-Glass-Wrapper',

        // Opacity what be have a container
        opacity: 0.5,

        // Auto close time glass
        autoclosetime: 500,

        // Close time glass
        closetime: 500,

        // Show time glass
        showtime: 500,

        // Show glass in browser. Have max width and max height. 
        // Add object to DOM
        show: function(config, callback) {
            var settings = {
                place: 'body'
            };
            jQuery.extend(settings, config);
            
            var winWidth = jQuery(window).width(),
                winHeight = jQuery(window).height(),
                docWidth = jQuery(document).width(),
                dovHeight = jQuery(document).height(),
                maxWidth = (docWidth > winWidth) ? docWidth : winWidth, 
                maxHeight = (dovHeight > winHeight) ? dovHeight + 16 : winHeight,
                
                extraWidth = (Pklib.Browser.getName() == 'msie') ? 21 : 0,
                extraHeight = (Pklib.Browser.getName() == 'msie') ? 20 : 0,
                
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
				height: maxHeight - extraHeight,
				width: maxWidth  - extraWidth,
				position: 'absolute',
				top: 0,
				left: 0,
				background: '#000000',
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
    },

    // Object to present browser
    Browser: {

        // Get short browser name
        getName: function() {
            if (/msie/.test(navigator.userAgent.toLowerCase())) return 'msie';
            if (/chrome/.test(navigator.userAgent.toLowerCase())) return 'chrome';
            if (/safari/.test(navigator.userAgent.toLowerCase())) return 'safari';
            if (/opera/.test(navigator.userAgent.toLowerCase())) return 'opera';
            if (/mozilla/.test(navigator.userAgent.toLowerCase())) return 'mozilla';
            return null;
        },

        // Get browser version
        getVersion: function() {
            return jQuery.browser.version;
        }

    },

    // Present file in library
    File: {

        // Attach file on site.
        // Run callback after attach file.
    	// Add object to DOM
        attach: function(data, callback) {
        	var file = document.createElement( data.tag );
    		for( var key in data){
                file[key] = data[key];
    		}
    		var attach_file = document.getElementsByTagName(data.section)[0].appendChild(file);
            if (typeof callback == 'function') {
                attach_file.onload = callback();
            }
            return attach_file;
        }

    },

    // Validate - object present
    Validate: {

        // Check if object doesn't empty
        empty: function(object) {
            switch(typeof object){
                case 'string':
                    return ( object == '' );
                    break;
                case 'number':
                    return ( object == 0 );
                    break;
                case 'object':
                    return ( object.length == 0 );
                    break;
                default:
                    return false;
            }
        },
        
        // Check regular expression for field and run action
        regexp: function(config){
            var settings = {
                object: null,
                regexp: null,
                error: null,
                success: null
            };
            jQuery.extend(settings, config);
            
            var exp = new RegExp(settings.regexp);
            
            if (exp.test(settings.object)) {
                return settings.success();
            }
            return settings.error();
        }

    },
    
    // Cookie - object represent
    Cookie: {
       
        // Create cookie
        create: function(name, value, days) {
            if (typeof days != 'undefined') {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                var expires = '; expires=' + date.toGMTString();
            } else {
                var expires = '';
            }
            document.cookie = name + '=' + value + expires + '; path=/';
        },
        
        // Read cookie
        read: function(name) {
            var nameEQ = name + '=';
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
        
        // Erase exists cookie
        erase: function(name) {
            this.create(name, '', -1);
        }

    }

};
