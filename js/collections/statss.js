(function() {
	'use strict';

	app.Collections.statss = Backbone.Collection.extend({
		model: app.Models.stats,
		dao: app.DAOs.stats,

		setAccountId: function(account_id) {
			this.account_id = account_id;
		},

		setName: function(name) {
			this.name = name;
		}
	});
})();
