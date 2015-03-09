(function() {
	'use strict';

	app.Views.stats = Backbone.View.extend({
		events: {
			'click li:not(.active)': 'switch'
		},
		initialize: function(subview) {
			var self = this;
			app.Helpers.templateLoader.get('stats', function(template) {
				self.template = Handlebars.compile(template);
				self.render();
			});
		},
		render: function() {
			app.Helpers.headerNavigation.update();
			this.$el.html(this.template());
			$('#main-stats-friends').empty().append(this.$el);
			app.loadView('statsNumbers');
			return this;
		},
		switch: function(e) {
			this.$el.find('li.active').removeClass('active');
			var target = $(e.currentTarget);
			target.addClass('active');
			this.subview = target.data('subview');
			app.loadView('stats' + this.subview);
		}
	});
})();
