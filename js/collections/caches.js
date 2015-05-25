(function() {
	'use strict';

	app.Collections.caches = Backbone.Collection.extend({
		model: app.Models.cache,
		dao: app.DAOs.cache
	});
})();
