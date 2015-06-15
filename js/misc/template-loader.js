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

				// Remove
				$.get('js/templates/framework.tpl?' + (new Date).getTime(), function(data) {
					$('div#preload').append($(data));
				});

				callback();
			});
		}
	};
})();
