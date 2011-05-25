pklib = this.pklib || {};

pklib.utils = (function(){

	return {
		
        // Clear content from parameter element after focus. 
    	// On blur if content doesn't change is restore
        clearfocus: function(objectToClear) {
            if (!pklib.validate.empty(jQuery(objectToClear))) {
	            jQuery(objectToClear).each(function(i, v) {
	                v.defaultValue = jQuery(v).val();
	            });
	            jQuery(objectToClear).addEvent('focus', function clearContent() {
	                if (jQuery(this).val() === jQuery(this)[0].defaultValue) {
	                	jQuery(this).val('');
	                }
	            }).addEvent('blur', function setContent() {
	                if (jQuery(this).val() === '') {
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
            if (pklib.validate.empty(jQuery(place)) || typeof place == 'undefined') {
            	place = 'body';
            }
            jQuery(place).find('a').each(function() {
                if (jQuery(this).attr('rel') === 'outerlink') {
                    jQuery(this).removeEvent('click').addEvent('click', function outerlink(e) {
                        window.open(jQuery(this).attr('href'));
                        e.preventDefault();
                    });
                }
            });
        },

        // Add to jQuery element event to confirm go to link
        confirm: function(element, text) {
            if (!pklib.validate.empty(jQuery(element))) {
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
            if (typeof word === 'string' ) {
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
            if (typeof word === 'string' ) {
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
            if (typeof word === 'string' ) {
                return this.ltrim(this.rtrim(word));
            }
            return false;
        },

        // Replace special chars in text by normalize chars
        slug: function(text) {
            if (typeof text === 'string') {
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
        
	};
	
})();