(function() {
	'use strict';

	app.Collections.accounts = Backbone.Collection.extend({
		model: app.Models.account,
		dao: app.DAOs.account,

		setActive: function() {
			this.isActive = true;
		}
	});
})();
