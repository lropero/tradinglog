(function() {
	'use strict';

	app.Views.mainAdd = Backbone.View.extend({
		events: {
			'click li:not(.active)': 'switch'
		},
		initialize: function() {
			var self = this;
			app.Helpers.templateLoader.get('main-add', function(template) {
				self.template = Handlebars.compile(template);
				self.render();
			});
		},
		render: function() {
			this.$el.html(this.template());
			$('#main-stats-friends').empty().append(this.$el);
			new app.Views.mainAddTrade();
			return this;
		},
		switch: function(e) {
			this.$el.find('li.active').removeClass('active');
			var target = $(e.currentTarget);
			target.addClass('active');
			this.subview = target.data('subview');
			new app.Views['main' + this.subview]();
		}
	});
})();
