(function() {
	'use strict';

	app.Views.stats = Backbone.View.extend({
		el: 'section#main-stats-friends',
		events: {
			'click li:not(.active)': 'switch'
		},
		initialize: function() {
			var self = this;
			app.templateLoader.get('stats').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},
		render: function() {
			app.trigger('change', 'stats');
			this.$el.html(this.template());
			new app.Views.statsNumbers();
			return this;
		},
		switch: function(e) {
			this.$el.find('li.active').removeClass('active');
			var target = $(e.currentTarget);
			target.addClass('active');
			var section = target.data('section');
			new app.Views['stats' + section.ucfirst()]();
		},
		destroy: function() {
			this.undelegateEvents();
		}
	});
})();
