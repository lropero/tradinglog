(function() {
	'use strict';

	app.Collections.trades = Backbone.Collection.extend({
		model: app.Models.trade,
		dao: app.DAOs.trade
	});
})();
