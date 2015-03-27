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
			}
			$('div#isolate').hide();
			$('div#isolated').append($('div#done').next());
			$('div#isolated').children().unwrap();
			$('div#complete').show();
			$('header #button-left').show();
			$('header #button-right').show();
		}
	}

	app.isolate = function(e) {
		if($('div#isolate').is(':hidden')) {
			e.preventDefault();
			var isolate = $(e.currentTarget).parents('.isolate');
			isolate.wrap('<div id="isolated"></div>');
			$('header #button-left').hide();
			$('header #button-right').hide();
			$('div#complete').hide();
			$('div#isolate').append(isolate);
			$('div#isolate').show();
			$(e.currentTarget).focus();
		}
	}
})();
