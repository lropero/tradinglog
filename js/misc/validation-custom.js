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
			var $header = $('header');
			$header.find('#button-left').show();
			$header.find('#button-right').show();
		}
	}

	app.isolate = function(e, action) {
		var $target = $(e.currentTarget);
		var $isolate = $('div#isolate');
		if($isolate.is(':hidden')) {
			if($target.hasClass('error')) {
				$target.removeClass('error');
				var $price = $target.parent('div.price');
				if($price) {
					$price.removeClass('error');
				}
				var $wrapper = $target.parents('div.wrapper-select');
				if($wrapper) {
					$wrapper.removeClass('error');
				}
			}
			$target.addClass('field');
			var $isolated = $target.parents('.isolate');
			$isolated.wrap('<div id="isolated"></div>');
			var $header = $('header');
			$header.find('#button-left').hide();
			$header.find('#button-right').hide();
			$('div#complete').hide();
			$isolate.append($isolated).show();
		}
		setTimeout(function() {
			$target.prop('disabled', false);
			if(action) {
				action($target);
			} else {
				$target.focus();
			}
		}, 100);
	}
})();
