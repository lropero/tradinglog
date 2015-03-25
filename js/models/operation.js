(function() {
	'use strict';

	app.Models.operation = Backbone.Model.extend({
		dao: app.DAOs.operation,
		defaults: {
			account_id: 0,
			amount: 0,
			description: '',
			variation: 0,
			created_at: 0
		},
	});
})();
