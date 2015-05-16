(function() {
	'use strict';

	app.Collections.statss = Backbone.Collection.extend({
		model: app.Models.stats,
		dao: app.DAOs.stats,

		setName: function(name) {
			this.name = name;
		}
	});
})();
