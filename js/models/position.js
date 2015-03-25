(function() {
	'use strict';

	app.Models.position = Backbone.Model.extend({
		dao: app.DAOs.position,
		defaults: {
			trade_id: 0,
			size: 0,
			price: 0,
			created_at: 0
		},
	});
})();
