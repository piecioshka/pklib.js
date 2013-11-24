/**
 * Private Library
 * Library helped to useful things.
 * 
 * Library use jQuery 1.x.x
 *
 * Copyright (c) 2010 Piotr Kowalski (piecioshka.pl)
 * License GNU  
 * 
 * @author Piotr Kowalski <piotr.kowalski@piecioshka.pl>
 * 
 */

/**
 * New Instance
 */
if (typeof pklib == 'undefined' || !pklib) {
	var pklib = {};
}

var pklib = {

	_autor: "Piotr Kowalski",
	_version: "0.3",
	_lastModified: "2010/02/24",

	outerlink: function(){
		$("a").each(function(){
			if( $(this).attr("rel") == "outerlink" ){
				$(this).click(function(){
					window.open( $(this).attr("href") );
					return false;
				});
			}
		});
	},
	
	confirm: function( object, text ) {
		var go = false;
		
		if( text == undefined ){
			text = "Czy potwierdzasz akcję?";
		}
		
		object.bind('click', function() {
			go = confirm( text );
			if( go == true ){
				window.location = object.attr('href');
				return true;
			} else {
				return false;
			}			
		})
		
	},

	content:{
    
		clearfocus: function( objectToClear ){
			if( objectToClear == undefined || !objectToClear ){
				return false;
			}
			objectToClear.bind('focus',function(e){
				switch ( objectToEmpty.attr('nodeName') ){
				case 'INPUT':
				    objectToEmptyVal = objectToClear.val();
					if( objectToClear.val() == objectToEmptyVal ){
						$(this).val(''); 
					}
					break;
				case 'TEXTAREA':
				default:
				    objectToEmptyText = objectToClear.text();
					if( objectToClear.text() == objectToEmptyText ){
						$(this).text('');
					}
				}
			});
		},

		disable: function( objectToDisable ){
			if( objectToDisable == undefined ){
				return false;
			}
			objectToDisable.bind('focus keypress click',function(e){
				return false;
			});
		},
		
		ltrim: function( word ){
			if( typeof word != "string" ){
				return false;
			}
			if( word.substr(0,1) == ' ' ) {
				return word.substr(1);
			}
			return word;
		},
		
		rtrim: function( word ){
			if( typeof word != "string" ){
				return false;
			}
			if( word.substr( word.length - 1 ) == ' ' ) {
				return word.substr( 0, word.length - 1 );
			}
			return word;
		},
		
		trim: function( word ){
			if( typeof word != "string" ){
				return false;
			}
			return pklib.content.ltrim( pklib.content.rtrim( word ) );
		}

	},
	
	glass:{
		
		htmlObject:$('<div id="glass"></div>'),
		
		show: function(){
			if( $('body').find('#glass').length == 0 ){
				
				pklib.glass.htmlObject.css('height', document.height );
				pklib.glass.htmlObject.css('opacity', 0.5 );
				
				$('body').append( pklib.glass.htmlObject );
			}
			pklib.glass.htmlObject.fadeIn().removeClass('hide');
		},
		hide: function(){
			pklib.glass.htmlObject.fadeOut().addClass('hide');
		}
	},
  
	popup:{
		
		content:'',
		type:'',

		htmlObject:$('<div class="popup-window"><div class="popup-manager"><a href="#popup-close" class="popup-close button">x</a><a href="#popup-previous" class="popup-previous button hide">/</a><a href="#popup-maximalize" class="popup-maximalize button">+</a><a href="#popup-minimalize" class="popup-minimalize button">-</a></div><div class="popup-content"></div></div>'),
		
		width:300,
		height:0,
		
		positionX:0,
		positionY:0,
		
		bind: function(){
			pklib.popup.htmlObject.find('.popup-manager .popup-close.button').bind('click',function(){
				pklib.popup.hide();
			});
			pklib.popup.htmlObject.find('.popup-manager .popup-minimalize.button').bind('click',function(){
				pklib.popup.minimalize();
			});
			pklib.popup.htmlObject.find('.popup-manager .popup-maximalize.button').bind('click',function(){
				pklib.popup.maximalize();
			});
			pklib.popup.htmlObject.find('.popup-manager .popup-previous.button').bind('click',function(){
				pklib.popup.previous();
			});
		},
		
		show: function( content, type ){
			if( type == undefined ){
				pklib.popup.type = 'info';
			} else {
				pklib.popup.type = type;
			}
			if( content == undefined ){
				pklib.popup.content = '<strong>Widow Popup</strong> <br />Autor: ' + pklib._autor + '<br />Wersja: '+ pklib._version + '<br />Ostatnia modyfikacja: ' + pklib._lastModified;
			} else {
				pklib.popup.content = content;
			}
			
			pklib.glass.show();
			
			pklib.popup.htmlObject.find('.popup-content').html( pklib.popup.content );
			$('body').append( pklib.popup.htmlObject );
			
			pklib.popup.positionX = ( $(window).width() - pklib.popup.width )/2;
			pklib.popup.positionY = ( $(window).height() - pklib.popup.height )/2;
			
			pklib.popup.htmlObject.css({
				position:'absolute',
				width: pklib.popup.width + 'px',
				top: pklib.popup.positionY + 'px',
				left: pklib.popup.positionX + 'px'
			}).fadeIn();
			
			pklib.popup.height = pklib.popup.htmlObject.height();
			pklib.popup.bind();
		},

		hide: function(){
			pklib.popup.htmlObject.fadeOut().addClass('hide');
			pklib.glass.hide();
		},
		
		minimalize: function(){
			pklib.popup.htmlObject.css({
				top:'2px',
				left:'2px',
				height:'21px',
				width:'200px',
				overflow:'hidden'
			});
			pklib.popup.htmlObject.find('.popup-manager .popup-maximalize.button').addClass('hide');
			pklib.popup.htmlObject.find('.popup-manager .popup-previous.button').removeClass('hide');
			pklib.popup.htmlObject.find('.popup-manager .popup-minimalize.button').addClass('hide');
			pklib.glass.hide();
		},
		
		maximalize: function(){
			pklib.popup.htmlObject.css({
				top:'0px',
				left:'0px',
				height:'100%',
				width:'100%',
			});
			pklib.popup.htmlObject.find('.popup-manager .popup-maximalize.button').addClass('hide');
			pklib.popup.htmlObject.find('.popup-manager .popup-previous.button').removeClass('hide');
			pklib.popup.htmlObject.find('.popup-manager .popup-minimalize.button').removeClass('hide');
		},
		
		previous: function(){
			pklib.popup.htmlObject.css({
				top: pklib.popup.positionY + 'px',
				left: pklib.popup.positionX + 'px',
				height: pklib.popup.height + 'px',
				width: pklib.popup.width + 'px',
				overflow:'auto',
			});
			pklib.popup.htmlObject.find('.popup-manager .popup-maximalize.button').removeClass('hide');
			pklib.popup.htmlObject.find('.popup-manager .popup-previous.button').addClass('hide');
			pklib.popup.htmlObject.find('.popup-manager .popup-minimalize.button').removeClass('hide');
			pklib.glass.show();
		}
	}

};
