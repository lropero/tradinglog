(function() {
	'use strict';

	app.Views.mainAddTrade = Backbone.View.extend({
		initialize: function() {
			var self = this;
			app.Helpers.templateLoader.get('main-add-trade', function(template) {
				self.template = Handlebars.compile(template);
				self.render();
			});
		},
		render: function() {
			app.Helpers.headerNavigation.update({
				left: {
					icon: 'f124',
					text: 'Cancel',
					view: 'main'
				},
				right: {
					text: 'Add',
					view: 'main'
				}
			});
			this.$el.html(this.template());
			$('#main-stats-friends #content').empty().append(this.$el);
			return this;
		}
	});
})();
