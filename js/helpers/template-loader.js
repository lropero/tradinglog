(function() {
	'use strict';

	app.Helpers.templateLoader = {
		get: function(name, callback) {
			if(typeof app.Templates[name] === 'undefined') {
				$.get('js/_templates/' + name + '.tpl', function(template) {
					app.Templates[name] = $(template).html().trim();
					callback(app.Templates[name]);
				});
			} else {
				callback(app.Templates[name]);
			}
		}
	};
})();
