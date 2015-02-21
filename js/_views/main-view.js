(function() {
	'use strict';

	app.Views.mainView = Backbone.View.extend({
		initialize: function() {
			this.render();
		},
		render: function() {
			this.$el.html('main');
			return this;
		}
	});
})();
