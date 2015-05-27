(function() {
	'use strict';

	app.Models.user = Backbone.Model.extend({
		dao: app.DAOs.user,
		defaults: {
			location: ""
			name: ""
			profile_image: ""
			screen_name: "",
			device: null
		},

		initialize: function() {
			//
		},

		delete: function() {
			this.destroy();
		}
	});
})();