(function() {
	'use strict';

	app.Collections.instruments = Backbone.Collection.extend({
		model: app.Models.instrument,
		dao: app.DAOs.instrument
	});
})();
