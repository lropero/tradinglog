(function() {
	'use strict';

	app.Collections.trades = Backbone.Collection.extend({
		model: app.Models.trade,
		dao: app.DAOs.trade,

		setAccountId: function(account_id) {
			this.account_id = account_id;
		},

		setAffected: function(affected) {
			this.affected = affected;
		},

		setFetchId: function(id) {
			this.id = id;
		}
	});
})();
