(function() {
	'use strict';

	app.Views.main = Backbone.View.extend({
		events: {
			'click div.operation': 'viewOperation',
			'click div.trade:not(.operation):not(.swiped)': 'viewTrade'
		},
		initialize: function() {
			var self = this;
			app.Helpers.templateLoader.get('main', function(template) {
				self.template = Handlebars.compile(template);
				self.render();
			});
		},
		render: function() {
			app.Helpers.headerNavigation.update({
				left: {
					icon: 'f203',
					view: 'mainMap'
				},
				right: {
					icon: 'f218',
					view: 'mainAdd'
				}
			});
			this.$el.html(this.template());
			$('#main-stats-friends').empty().append(this.$el);
			app.Helpers.swiper.init('.active-swipe');
			return this;
		},
		viewOperation: function() {
			app.loadView('mainViewOperation');
		},
		viewTrade: function() {
			app.loadView('mainViewTrade');
		}
	});
})();
