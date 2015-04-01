(function() {
	'use strict';

	app.Views.mainAdd = Backbone.View.extend({
		el: 'section#main-stats-friends',
		events: {
			'tap control.segmented li:not(.active)': 'switch'
		},

		initialize: function() {
			var self = this;
			app.templateLoader.get('main-add').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},

		destroy: function() {
			if(typeof this.subview.destroy === 'function') {
				this.subview.destroy();
			}
			this.undelegateEvents();
		},

		render: function() {
			app.trigger('change', 'main-add');
			this.$el.html(this.template());
			this.subview = new app.Views.mainAddTrade();
			return this;
		},

		switch: function(e) {
			e.preventDefault();
			this.$el.find('li.active').removeClass('active');
			var $target = $(e.currentTarget);
			$target.addClass('active');
			var section = $target.data('section');
			if(typeof this.subview.destroy === 'function') {
				this.subview.destroy();
			}
			this.subview = new app.Views['main' + section]();
		}
	});
})();
