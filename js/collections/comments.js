(function() {
	'use strict';

	app.Collections.comments = Backbone.Collection.extend({
		model: app.Models.comment,
		dao: app.DAOs.comment,

		setTradeId: function(trade_id) {
			this.trade_id = trade_id;
		}
	});
})();
