(function() {
	'use strict';

	app.Collections.users = Backbone.Collection.extend({
		model: app.Models.user,
		dao: app.DAOs.user,

		setFetchId: function(id) {
			this.id = id;
		}
	});
})();
