(function() {
	'use strict';

	app.Views.main = Backbone.View.extend({
		el: '#main-stats-friends',
		initialize: function() {
			var self = this;
			app.Helpers.templateLoader.get('main', function(template) {
				self.template = _.template(template);
				self.render();
			});
		},
		render: function() {
			app.Helpers.headerNavigation.update({
				'left': {
					'icon': 'f2a8',
					'text': '',
					'view': 'main'
				},
				'right': {
					'icon': 'f218',
					'text': '',
					'view': 'settings'
				}
			});
			this.$el.html(this.template());
			return this;
		}
	});
})();
