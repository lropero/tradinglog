(function() {
	'use strict';

	app.Views.friends = Backbone.View.extend({
		el: 'section#main-stats-friends',

		initialize: function() {
			if(!app.user) {
				app.loadView('friendsConnect');
			} else {
				this.template = Handlebars.compile(app.templateLoader.get('friends'));
				this.render();
			}
		},

		render: function() {
			app.trigger('change', 'friends');
			this.$el.html(this.template({
				alias: app.user.alias,
				avatar: app.user.avatar,
				name: app.user.name
			}));
			return this;
		}
	});
})();
