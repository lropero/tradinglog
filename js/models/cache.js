(function() {
	'use strict';

	app.Models.cache = Backbone.Model.extend({
		dao: app.DAOs.cache,
	});
})();
