(function() {
	'use strict';

	app.Views.statsNumbers = Backbone.View.extend({
		el: '#main-stats-friends #content',
		initialize: function() {
			var self = this;
			app.Helpers.templateLoader.get('stats-numbers', function(template) {
				self.template = _.template(template);
				self.render();
			});
		},
		render: function() {
			this.$el.html(this.template());
			return this;
		}
	});
})();
