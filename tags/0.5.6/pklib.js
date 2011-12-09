/**
 * Pklib - Piotr Kowalski library Library to use cases
 *
 * @depends jQuery 1.4+
 */
var Pklib = {

	author : "Piotr Kowalski",
	www : "http://pklib.pl/",
	version: "0.5.6",
	lastModified : document.lastModified,
	self : this,

	Utils : {

		clearfocus: function(objectToClear){
			objectToClear.each(function(k, v) {
				v.defaultValue = $(v).val();
			});

			objectToClear.bind('focus', function(event) {
				if ($(this).val() == $(this)[0].defaultValue)
					$(this).val('');
			}).bind('blur', function(event) {
				if ($(this).val() == '')
					$(this).val($(this)[0].defaultValue);
			});
		},

		outerlink : function(place) {
			if (place == undefined)
				place = "";

			$(place + "a").each(function() {
				if ($(this).attr("rel") == "outerlink") {
					$(this).unbind('click');
					$(this).bind('click', function() {
						window.open($(this).attr("href"));
						return false;
					});
				}
			});
		},

		confirm : function(object, text) {
			if (text == undefined)
				text = "Are You sure?";

			object.bind('click', function() {
				if (confirm(text)) {
					window.location = $(this).attr('href');
				}
				return false;
			});
		},

		chars : [ ' ', '-', '_' ],

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

		trim : function(word) {
			return this.ltrim(this.rtrim(word));
		},

		slug : function(text) {
			var result = '';
			for ( var i = 0; i < text.length; ++i) {
				var letter = text[i].toLowerCase();
				switch (letter) {
				case 'e':
					result += "e";
					break;
				case 'ó':
					result += "o";
					break;
				case 'ą':
					result += "a";
					break;
				case 'ś':
					result += "s";
					break;
				case 'ł':
					result += "l";
					break;
				case 'ż':
				case 'ź':
					result += "z";
					break;
				case 'ć':
					result += "c";
					break;
				case 'ń':
					result += "n";
					break;

				case ' ':
				case '!':
				case '?':
				case '+':
					result += "-";
					break;
				default:
					result += letter;
				}
			}
			return result;
		}
	},

	Message : {

        objClass : 'Pklib-Message-Wrapper',

        text : '',

        autoclosetime: 1500,

        closetime: 1000,

        showtime: 1500,

		show : function() {
            var message = $("<div />").addClass(this.objClass).html(this.text);

            message.css({
                color: '#000',
                top: '-99999px',
                width: '300px',
                height: '200px',
                border: '1px solid #000',
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


            if( Pklib.Browser.getName() == 'msie' && Pklib.Browser.getVersion() == '6.0' ){
                setInterval(function(){
                    message.css({
                        position: 'absolute',
                        left: ($(window).width() - message.width() )/2 + $(window).scrollLeft() + "px",
                        top: ($(window).height() - message.height() )/2 + $(window).scrollTop() + "px"
                    });
                }, 1);
            }
		},

		autoclose : function() {
            var className = this.objClass;
            setTimeout(function(){
                $("." + className).animate({
                    opacity: 0
                }, this.autoclosetime, function(){
                   $("." + className).remove();
                });
            }, this.autoclosetime);
		},

		close : function() {
			$("." + this.objClass).animate({
                opacity: 0
            }, this.closetime, function(){
                $(this).remove();
            });
		},

        refresh: function(){
            this.close();
            this.show();
        }

	},

    Loader : {

        objClass : 'Pklib-Loader-Wrapper',

        autoclosetime: 1500,

        closetime: 1000,

        showtime: 1500,

		show : function(place, center) {

		    if( place == undefined ) place = 'body';

            var loader = $("<img />").addClass(this.objClass).attr({
                src: 'http://piecioshka.pl/img/ajax-loader.gif',
                alt: 'Loader'
            });

            loader.css({
                color: '#000',
                width: '32px',
                height: '32px',
                background: "transparent",
                opacity: 0,
                zIndex: 2000
            });

            $(place).append(loader);

            if(center){
                loader.css({
                    position: 'absolute',
                    left: ($(window).width() - loader.width() )/2,
                    top: ($(window).height() - loader.height() )/2
                });
            } else {
                loader.css({
                    position: 'absolute',
                    left: 0,
                    top: 0
                });
            }

		    loader.animate({
                opacity: 1
            }, this.showtime);

		},

		autoclose : function() {
            var className = this.objClass;
            setTimeout(function(){
                $("." + className).animate({
                    opacity: 0
                }, this.autoclosetime, function(){
                   $("." + className).remove();
                });
            }, this.autoclosetime);
		},

		close : function() {
             $("." + this.objClass).animate({
                opacity: 0
            }, this.closetime, function(){
                $(this).remove();
            });
		}

	},

	Glass : {

		objClass : "Pklib-Glass-Wrapper",

		opacity : 0.5,

        autoclosetime: 1500,

        closetime: 1000,

        showtime: 1500,

		show : function() {

			var glassFrame = $('<iframe />').addClass(this.objClass);
			var glass = $('<div />').addClass(this.objClass);

            var winWidth = $(window).width();
            var winHeight = $(window).height();
            
            var docWidth = $(document).width();
            var dovHeight = $(document).height();

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
				height : maxHeight + "px",
				width : maxWidth - 4 + "px",
				position : "absolute",
				top : "0px",
				left : "0px",
				opacity : 0,
                zIndex: 1000
			});

			glass.css( {
				height : maxHeight + "px",
				width : maxWidth + "px",
				position : "absolute",
				top : "0px",
				left : "0px",
				background : "#000000",
				overflow : 'hidden',
				opacity : 0,
                zIndex: 1000
			});

            $("body").append(glassFrame)
			$("body").append(glass);

            glassFrame.animate({
                opacity: this.opacity
             }, this.showtime);

			glass.animate({
			    opacity: this.opacity
            }, this.showtime);
		},

		autoclose : function() {
            var className = this.objClass;
            setTimeout(function(){
                $("." + className).animate({
                    opacity: 0
                }, this.autoclosetime, function(){
                   $("." + className).remove();
                });
            }, this.autoclosetime);
		},

		close : function() {
			$("." + this.objClass).animate({
			    opacity: 0
            }, this.closetime, function(){
                $(this).remove();
            });
		}
	},

	Browser : {

		getName : function() {
			if ($.browser.safari) return 'safari';
			if ($.browser.opera) return 'opera';
			if ($.browser.msie) return 'msie';
			if ($.browser.mozilla) return 'mozilla';
			return null;
		},

		getVersion : function() {
			return $.browser.version;
		}

	},

	File : {

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
		
	}
};

/**
 * Change name 'bind' to 'addEvent' This is better to syntax language
 */
jQuery.fn.addEvent = jQuery.fn.bind;

/**
 * Change name 'unbind' to 'removeEvent' This is better to syntax language
 */
jQuery.fn.removeEvent = jQuery.fn.unbind;