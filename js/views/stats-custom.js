(function() {
	'use strict';

	app.Views.statsCustom = Backbone.View.extend({
		el: 'section#main-stats-friends section#content',

		initialize: function() {
			var self = this;
			app.templateLoader.get('stats-custom').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},

		render: function() {
			app.trigger('change', 'stats-custom');
			this.$el.html(this.template());
			return this;
		}
	});
})();
