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
		},

		delete: function() {
			var self = this;
			this.deferred.done(function() {
				self.destroy();
			});
		},

		getType: function() {
			switch(this.get('type')) {
				case 0:
					return 'Future';
					break;
				case 1:
					return 'Currency';
					break;
				case 2:
					return 'Stock';
					break;
			}
		},

		toJSON: function() {
			var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
			json.group = String.fromCharCode(this.get('group_id') + 65);
			json.type = this.getType();
			return json;
		}
	});
})();
