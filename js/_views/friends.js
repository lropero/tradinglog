(function() {
	'use strict';

	app.Views.friends = Backbone.View.extend({
		initialize: function() {
			var self = this;
			app.Helpers.templateLoader.get('friends', function(template) {
				self.template = _.template(template);
				self.render();
			});
		},
		render: function() {
			app.Helpers.headerNavigation.update();
			this.$el.html(this.template());
			$('#main-stats-friends').empty().append(this.$el);
			return this;
		}
	});
})();
