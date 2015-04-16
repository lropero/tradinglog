(function() {
	'use strict';

	app.cache = {
		Templates: {},

		delete: function(template, fromDelete) {
			delete this.Templates[template];
			if(template === 'main') {
				new app.Views.main(true, fromDelete);
			} else if(template === 'mainMap') {
				new app.Views.mainMap(true);
			}
		},

		get: function(template, method, options) {
			if(!this.Templates[template]) {
				this.Templates[template] = method(options);
			}
			return this.Templates[template];
		},

		reset: function() {
			this.Templates = {};
		}
	};
})();
