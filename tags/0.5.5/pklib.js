/**
 * Pklib - Piotr Kowalski library Library to use cases
 * 
 * @depends jQuery 1.4+
 */
var Pklib = {

	author : "Piotr Kowalski",
	www : "http://pklib.pl/",
	version: "0.5.5",
	lastModified : document.lastModified,
	self : this,

	Utils : {
	
		clear: function(objectToClear){
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
			;

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
			;

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

		show : function() {
			console.log("Pklib.Message - show");
		},
		close : function() {
			console.log("Pklib.Message - close");
		}

	},

	Loader : {

		show : function() {
			console.log("Pklib.Loader - show");
		},
		close : function() {
			console.log("Pklib.Loader - close");
		}

	},

	Glass : {

		opacity : 0.5,
		id : "glass",

		show : function() {

			var htmlObject = $('<div />').attr("id", this.id);

			var maxWidth = $(window).width();
			var maxHeight = $(window).height();

			if ($(document).width() > maxWidth)
				maxWidth = $(document).width();
			if ($(document).height() > maxHeight)
				maxHeight = $(document).height();

			htmlObject.css( {
				height : maxHeight + "px",
				width : maxWidth + "px",
				position : "absolute",
				top : "0px",
				left : "0px",
				background : "#000000",
				overflow : 'hidden',
				opacity : this.opacity
			});

			document.getElementsByTagName("body")[0].appendChild($(htmlObject)[0]);
		},

		close : function() {
			document.getElementById(this.id).parentNode.removeChild(document.getElementById(this.id));
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
