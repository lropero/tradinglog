(function() {
	'use strict';

	app.Models.account = Backbone.Model.extend({
		dao: app.DAOs.account
	});
})();
