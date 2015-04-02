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

	app.combine = function() {
		if($('div#isolate').is(':visible')) {
			if(typeof cordova !== 'undefined') {
				cordova.plugins.Keyboard.close();
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
			}
			$('footer').show();
			$('div#isolate').hide();
			$('div#isolated').append($('div#done').next()).children().unwrap();
			$('div#complete').show();
			$('header #button-left').show();
			$('header #button-right').show();
		}
	}

	app.isolate = function(e) {
		var $target = $(e.currentTarget);
		if($('div#isolate').is(':hidden')) {
			if(typeof cordova !== 'undefined') {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			}
			if($target.hasClass('error')) {
				$target.removeClass('error');
				var $price = $target.parent('div.price');
				if($price) {
					$price.removeClass('error');
				}
			}
			var $isolate = $target.parents('.isolate');
			$isolate.wrap('<div id="isolated"></div>');
			$('header #button-left').hide();
			$('header #button-right').hide();
			$('div#complete').hide();
			$('div#isolate').append($isolate).show();
			$('footer').hide();
		}
		$target.focus();
	}
})();
