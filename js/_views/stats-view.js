(function() {
	'use strict';

	app.Views.statsView = Backbone.View.extend({
		initialize: function() {
			this.render();
		},
		render: function() {
			this.$el.html('stats');
			return this;
		}
	});
})();
