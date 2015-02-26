(function() {
	'use strict';

	app.Views.statsView = Backbone.View.extend({
		el: '#main-stats-friends',
		events: {
			'click li:not(.active)': 'switch'
		},
		initialize: function() {
			var self = this;
			$.get('js/_templates/stats.tpl', function(template) {
				self.template = _.template($(template).html().trim());
				self.render();
				self.content = new app.Views.statsNumbersView();
			});
		},
		render: function() {
			this.$el.html(this.template());
			return this;
		},
		switch: function(e) {
			this.$el.find('li.active').removeClass('active');
			$(e.currentTarget).addClass('active');
			var route = $(e.currentTarget).data('route');
		}
		// assign: function(selector, view) {
		// 	var selectors;
		// 	if(_.isObject(selector)) {
		// 		selectors = selector;
		// 	} else {
		// 		selectors = {};
		// 		selectors[selector] = view;
		// 	}
		// 	if(!selectors) {
		// 		return;
		// 	}
		// 	_.each(selectors, function(view, selector) {
		// 		view.setElement(this.$(selector)).render();
		// 	}, this);
		// }
	});
})();
