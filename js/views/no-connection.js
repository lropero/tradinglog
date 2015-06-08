(function() {
	'use strict';

	app.Views.noConnection = Backbone.View.extend({
		el: 'section#main-stats-friends',

		initialize: function() {
			this.template = Handlebars.compile(app.templateLoader.get('no-connection'));
			this.render();
		},

		render: function() {
			app.trigger('change', 'no-connection');
			this.$el.html(this.template());
			return this;
		}
	});
})();
