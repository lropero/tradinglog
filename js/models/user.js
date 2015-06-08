(function() {
	'use strict';

	app.Models.user = Backbone.Model.extend({
		dao: app.DAOs.user
	});
})();
