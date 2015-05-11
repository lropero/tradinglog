(function() {
	'use strict';

	app.Collections.instruments = Backbone.Collection.extend({
		model: app.Models.instrument,
		dao: app.DAOs.instrument,

		setFetchId: function(id) {
			this.id = id;
		},

		setName: function(name) {
			this.name = name;
		}
	});
})();
