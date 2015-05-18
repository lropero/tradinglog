(function() {
	'use strict';

	app.Models.view = Backbone.Model.extend({
		dao: app.DAOs.view,

		delete: function(callback) {
			this.destroy({
				success: function() {
					callback();
				}
			});
		}
	});
})();
