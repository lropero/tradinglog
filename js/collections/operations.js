(function() {
	'use strict';

	app.Collections.operations = Backbone.Collection.extend({
		model: app.Models.operation,
		dao: app.DAOs.operation,

		setAccountId: function(account_id) {
			this.account_id = account_id;
		},

		setLimit: function(limit) {
			this.limit = limit;
		}
	});
})();
