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
		var $isolate = $("div#isolate");
		var $header = $("header");
		var $complete = $("div#complete");

		if($isolate.is(':visible')) {
			if(typeof cordova !== 'undefined') {
				cordova.plugins.Keyboard.close();
			}
			var $wrapper = $('div#done').next();
			$wrapper.find('.field').prop('disabled', true).removeClass('field');
			$isolate.hide();
			$('div#isolated').append($wrapper).children().unwrap();
			$complete.show();
			$header.find('#button-left').show();
			$header.find('#button-right').show();
		}
	}

	app.isolate = function(e) {
		var $isolate = $("div#isolate");
		var $header = $("header");
		var $complete = $("div#complete");

		var $target = $(e.currentTarget);
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
			var $isolate = $target.parents('.isolate');
			$isolate.wrap('<div id="isolated"></div>');
			$header.find('#button-left').hide();
			$header.find('#button-right').hide();
			$complete.hide();
			$isolate.append($isolate).show();
		}
		setTimeout(function() {
			$target.prop('disabled', false);
			$target.focus();
		}, 100);
	}
})();
