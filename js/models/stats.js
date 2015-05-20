(function() {
	'use strict';

	app.Models.stats = Backbone.Model.extend({
		dao: app.DAOs.stats,

		delete: function(callback) {
			this.destroy({
				success: function() {
					if(typeof callback === 'function') {
						callback();
					}
				}
			});
		}
	});
})();
