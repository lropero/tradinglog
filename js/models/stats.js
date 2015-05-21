(function() {
	'use strict';

	app.Models.stats = Backbone.Model.extend({
		dao: app.DAOs.stats,

		obsolete: function(callback) {
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
