(function() {
	'use strict';

	app.Collections.caches = Backbone.Collection.extend({
		model: app.Models.cache,
		dao: app.DAOs.cache,

		setAccountId: function(account_id) {
			this.account_id = account_id;
		}
	});
})();
