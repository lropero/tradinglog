(function() {
	'use strict';

	app.cache = {
		Templates: {},

		delete: function(template) {
			delete this.Templates[template];
			if(template === 'main') {
				new app.Views.main(true);
			} else if(template === 'mainAddTrade') {
				new app.Views.mainAddTrade(true);
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
