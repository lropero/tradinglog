(function() {
	'use strict';

	app.templateLoader = {
		get: function(name) {
			return $('#' + name + '-template').html();
		},

		load: function(callback) {
			var self = this;
			$.get('dist/min.tpl', function(data) {
				$('div#preload').html($(data));
				callback();
			});
		}
	};
})();
