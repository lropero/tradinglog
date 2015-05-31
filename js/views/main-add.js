(function() {
	'use strict';

	app.Views.mainAdd = Backbone.View.extend({
		el: 'section#main-stats-friends',
		events: {
			'tap control.segmented li:not(.active)': 'switch'
		},

		initialize: function() {
			this.template = Handlebars.compile(app.templateLoader.get('main-add'));
			this.render();
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
			var $target = $(e.currentTarget);
			var section = $target.data('section');
			$('control.segmented').find('li.active').removeClass('active');
			$target.addClass('active');
			if(typeof this.subview.destroy === 'function') {
				this.subview.destroy();
			}
			this.subview = new app.Views['main' + section]();
			return false;
		}
	});
})();
