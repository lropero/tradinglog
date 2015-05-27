(function() {
	'use strict';

	app.Models.user = Backbone.Model.extend({
		dao: app.DAOs.user,
		defaults: {
			mongo_id: "",
			name: "",
			screen_name: "",
			picture: "",
			location: "",
			device: ""
		},

		initialize: function() {
			//
		},

		delete: function() {
			this.destroy();
		},

		toJSON: function() {
			var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
			json.picture = json.picture.replace("_normal.", ".");
			return json;
		}
	});
})();