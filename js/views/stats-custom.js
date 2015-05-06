(function() {
	'use strict';

	app.Views.statsCustom = Backbone.View.extend({
		el: 'section#main-stats-friends section#content',

		initialize: function() {
			this.template = app.templateLoader.get('stats-custom');
			this.template = Handlebars.compile(this.template);
			this.render();
		},

		render: function() {
			app.trigger('change', 'stats-custom');
			this.$el.html(this.template());
			return this;
		}
	});
})();
