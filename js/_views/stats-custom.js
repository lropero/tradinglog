(function() {
	'use strict';

	app.Views.statsCustom = Backbone.View.extend({
		initialize: function() {
			var self = this;
			app.Helpers.templateLoader.get('stats-custom', function(template) {
				self.template = _.template(template);
				self.render();
			});
		},
		render: function() {
			this.$el.html(this.template());
			$('#main-stats-friends #content').empty().append(this.$el);
			return this;
		}
	});
})();
