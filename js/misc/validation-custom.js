(function() {
	'use strict';

	_.extend(Backbone.Model.prototype, Backbone.Validation.mixin);

	_.extend(Backbone.Validation.validators, {
		gt: function(value, attr, customValue, model) {
			if(!(value > customValue)) {
				return 'error';
			}
		},

		nat: function(value, attr, customValue, model) {
			if(!(value > customValue) && !(value < customValue)) {
				return 'error';
			} else if(!(parseFloat(value) === parseInt(value, 10))) {
				return 'error';
			}
		},

		not: function(value, attr, customValue, model) {
			if(!(value > customValue) && !(value < customValue)) {
				return 'error';
			}
		}
	});

	app.combine = function(hide) {
		var $isolate = $('div#isolate');
		if($isolate.is(':visible')) {
			if(typeof cordova !== 'undefined') {
				cordova.plugins.Keyboard.close();
			}
			var $wrapper = $('div#done').next();
			$wrapper.find('.field').prop('disabled', true).removeClass('field');
			$isolate.hide();
			$('div#isolated').append($wrapper).children().unwrap();
			$('div#complete').show();
			if(!hide) {
				$('header button').show();
			}
		}
	}

	app.isolate = function(e, action) {
		var $target = $(e.currentTarget);
		var $isolate = $('div#isolate');
		if($isolate.is(':hidden')) {
			var $isolated = $target.parents('.isolate');
			if($target.hasClass('error')) {
				if($isolated.hasClass('two-input')) {
					$isolated.find('input').removeClass('error');
				} else {
					$target.removeClass('error');
				}
				var $price = $target.parent('div.price');
				if($price) {
					$price.removeClass('error');
				}
				var $wrapper = $target.parents('div.wrapper-select');
				if($wrapper) {
					$wrapper.removeClass('error');
				}
			}
			if($isolated.hasClass('two-input')) {
				$isolated.find('input').addClass('field');
			} else {
				$target.addClass('field');
			}
			$isolated.wrap('<div id="isolated"></div>');
			$('header button').hide();
			$('div#complete').hide();
			$isolate.append($isolated).show();
		} else {
			var $isolated = $target.parents('.isolate');
			if($isolated.hasClass('two-input')) {
				$isolated.find('.field').prop('disabled', true);
			}
		}
		setTimeout(function() {
			$target.prop('disabled', false);
			if(action) {
				action($target);
			} else {
				$target.focus();
				if(app.platform !== 'iOS') {
					if($target[0].localName !== 'select' && typeof cordova !== 'undefined') {
						setTimeout(function() {
							cordova.plugins.Keyboard.show();
						}, 20);
					}
				}
			}
		}, 80);
	}
})();
