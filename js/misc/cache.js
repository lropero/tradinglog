(function() {
	'use strict';

	app.cache = {
		Templates: {},

		delete: function(template) {
			delete this.Templates[template];
		},

		get: function(template, method, options) {
			if(!this.Templates[template]) {
				this.Templates[template] = method(options);
			}
			return this.Templates[template];
		}
	};
})();
