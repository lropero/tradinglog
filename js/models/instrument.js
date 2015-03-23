(function() {
	'use strict';

	app.Models.instrument = Backbone.Model.extend({
		dao: app.DAOs.instrument
	});
})();
