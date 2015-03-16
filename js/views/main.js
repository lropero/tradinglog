(function() {
	'use strict';

	app.Views.main = Backbone.View.extend({
		el: 'section#main-stats-friends',
		initialize: function() {
			var self = this;
			this.deferred = $.Deferred();
			app.templateLoader.get('main').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
			this.trades = [];
			this.fetchTrades();
		},
		render: function() {
			var self = this;
			this.deferred.done(function() {
				app.trigger('change', 'main');
				self.$el.html(self.template({
					trades: self.trades
				}));
				app.swiper.init('.active-swipe');
				// new IScroll('#main-stats-friends');
			});
			return this;
		},
		fetchTrades: function() {
			var self = this;
			var trades = new app.Collections.trades();
			trades.deferreds = [];
			trades.fetch({
				success: function() {
					$.when.apply($, trades.deferreds).done(function() {
						trades = trades.where({
							account_id: 1
						});
						for(var i = 0; i < trades.length; i++) {
							self.trades.push(trades[i].toJSON());
						}
						self.deferred.resolve();
					});
				}
			});
		}
	});
})();
