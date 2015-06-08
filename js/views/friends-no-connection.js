(function() {
	'use strict';

	app.Views.friendsNoConnection = Backbone.View.extend({
		el: 'section#main-stats-friends',

		initialize: function() {
			this.template = Handlebars.compile(app.templateLoader.get('friends-no-connection'));
			this.render();
		},

		render: function() {
			app.trigger('change', 'friends-no-connection');
			this.$el.html(this.template());
			return this;
		}
	});
})();
