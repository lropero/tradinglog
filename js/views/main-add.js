(function() {
	'use strict';

	app.Views.mainAdd = Backbone.View.extend({
		el: 'section#main-stats-friends',
		events: {
			'touchend li:not(.active)': 'switch'
		},
		initialize: function() {
			var self = this;
			app.templateLoader.get('main-add').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},
		render: function() {
			app.trigger('change', 'main-add');
			this.$el.html(this.template());
			new app.Views.mainAddTrade();
			return this;
		},
		switch: function(e) {
			this.$el.find('li.active').removeClass('active');
			var target = $(e.currentTarget);
			target.addClass('active');
			var section = target.data('section');
			new app.Views['main' + section]();
		},
		destroy: function() {
			this.undelegateEvents();
		}
	});
})();
