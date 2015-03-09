(function() {
	'use strict';

	app.Views.mainViewOperation = Backbone.View.extend({
		initialize: function() {
			var self = this;
			app.Helpers.templateLoader.get('main-view-operation', function(template) {
				self.template = Handlebars.compile(template);
				self.render();
			});
		},
		render: function() {
			app.Helpers.headerNavigation.update({
				left: {
					icon: 'f124',
					text: 'Back',
					view: 'main'
				}
			});
			this.$el.html(this.template());
			$('#main-stats-friends').empty().append(this.$el);
			return this;
		}
	});
})();
