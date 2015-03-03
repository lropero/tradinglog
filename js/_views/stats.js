(function() {
	'use strict';

	app.Views.stats = Backbone.View.extend({
		events: {
			'click li:not(.active)': 'switch'
		},
		initialize: function() {
			var self = this;
			app.Helpers.templateLoader.get('stats', function(template) {
				self.template = _.template(template);
				self.render();
			});
		},
		render: function() {
			app.Helpers.headerNavigation.update();
			this.$el.html(this.template());
			$('#main-stats-friends').empty().append(this.$el);
			this.content = new app.Views.statsNumbers();
			return this;
		},
		switch: function(e) {
			this.$el.find('li.active').removeClass('active');
			var target = $(e.currentTarget);
			target.addClass('active');
			var subview = target.data('subview');
			this.content = new app.Views['stats' + subview]();
		}
	});
})();
