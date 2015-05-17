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
				var timer = app.debug.start(template + ' -> html');
				this.Templates[template] = method(options);
				timer.stop();
			}
			return this.Templates[template];
		},

		reset: function() {
			this.Templates = {};
		}
	};
})();
