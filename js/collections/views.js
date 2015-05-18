(function() {
	'use strict';

	app.Collections.views = Backbone.Collection.extend({
		model: app.Models.view,
		dao: app.DAOs.view,

		setName: function(name) {
			this.name = name;
		}
	});
})();
