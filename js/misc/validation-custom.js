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
			$('footer').show();
			$('div#isolate').hide();
			$('div#isolated').append($('div#done').next()).children().unwrap();
			$('div#complete').show();
			$('header #button-left').show();
			$('header #button-right').show();
			if(typeof cordova !== 'undefined') {
				cordova.plugins.Keyboard.close();
			}
		}
	}

	app.isolate = function(e) {
		e.preventDefault();
		if($('div#isolate').is(':hidden')) {
			var isolate = $(e.currentTarget).parents('.isolate');
			isolate.wrap('<div id="isolated"></div>');
			$('header #button-left').hide();
			$('header #button-right').hide();
			$('div#complete').hide();
			$('div#isolate').append(isolate).show();
			$('footer').hide();
			$(e.currentTarget).focus();
		}
	}
})();
