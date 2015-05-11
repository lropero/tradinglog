(function() {
	'use strict';

	app.Collections.positions = Backbone.Collection.extend({
		model: app.Models.position,
		dao: app.DAOs.position,

		setFetchId: function(id) {
			this.id = id;
		},

		setTradeId: function(trade_id) {
			this.trade_id = trade_id;
		}
	});
})();
