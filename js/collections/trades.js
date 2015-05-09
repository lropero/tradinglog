(function() {
	'use strict';

	app.Collections.trades = Backbone.Collection.extend({
		model: app.Models.trade,
		dao: app.DAOs.trade,

		setAccountId: function(account_id) {
			this.account_id = account_id;
		},

		setLimit: function(limit) {
			this.limit = limit;
		},

		setRange: function(from, to) {
			this.range = true;
			this.from = from;
			this.to = to;
		}
	});
})();
