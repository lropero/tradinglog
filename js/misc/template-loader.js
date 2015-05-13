(function() {
	'use strict';

	app.templateLoader = {
		get: function(name) {
			return $('#' + name + '-template').html();
		},

		load: function(callback) {
			var self = this;
			$.get('dist/templates.tpl?' + (new Date).getTime(), function(data) {
				$('div#preload').html($(data));
				callback();
			});
		}
	};
})();
