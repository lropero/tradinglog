(function() {
	'use strict';

	app.Models.instrument = Backbone.Model.extend({
		dao: app.DAOs.instrument,

		initialize: function() {
			var self = this;
			this.deferred = $.Deferred();
			if(!this.isNew()) {
				this.fetch({
					success: function() {
						self.deferred.resolve();
					}
				});
			}
		}
	});
})();
