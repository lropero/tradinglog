(function() {
	'use strict';

	app.Views.settingsView = Backbone.View.extend({
		initialize: function() {
			this.render();
		},
		render: function() {
			this.$el.html('settings');
			return this;
		}
	});
})();
