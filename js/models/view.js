(function() {
	'use strict';

	app.Models.view = Backbone.Model.extend({
		dao: app.DAOs.view,

		obsolete: function(callback) {
			this.destroy({
				success: function() {
					callback();
				}
			});
		}
	});
})();
