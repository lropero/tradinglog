(function() {
	'use strict';

	app.Views.main = Backbone.View.extend({
		initialize: function() {
			var self = this;
			app.Helpers.templateLoader.get('main', function(template) {
				self.template = Handlebars.compile(template);
				self.render();
			});
		},
		render: function() {
			app.Helpers.headerNavigation.update({
				'left': {
					'icon': 'f203',
					'view': 'mainMap'
				},
				'right': {
					'icon': 'f218',
					'view': 'mainAdd'
				}
			});
			this.$el.html(this.template());
			$('#main-stats-friends').empty().append(this.$el);
			return this;
		}
	});
})();
