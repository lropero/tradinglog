(function() {
	'use strict';

	app.Views.friendsView = Backbone.View.extend({
		initialize: function() {
			this.render();
		},
		render: function() {
			this.$el.html('friends');
			return this;
		}
	});
})();
