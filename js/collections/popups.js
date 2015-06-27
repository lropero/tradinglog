(function() {
	'use strict';

	app.Collections.popups = Backbone.Collection.extend({
		model: app.Models.popup,
		dao: app.DAOs.popup,

		setName: function(name) {
			this.name = name;
		}
	});
})();
