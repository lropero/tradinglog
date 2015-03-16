(function() {
	'use strict';

	app.Views.statsNumbers = Backbone.View.extend({
		el: 'section#main-stats-friends section#content',
		initialize: function() {
			var self = this;
			app.templateLoader.get('stats-numbers').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},
		render: function() {
			app.trigger('change', 'stats-numbers');
			this.$el.html(this.template());
			return this;
		}
	});
})();
