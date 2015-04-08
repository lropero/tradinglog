(function() {
	'use strict';

	app.Views.mainMap = Backbone.View.extend({
		el: 'section#main-stats-friends',

		initialize: function() {
			var self = this;
			this.deferred = $.Deferred();
			this.trades = [];
			$.when(
				this.fetchTrades()
			).done(function() {
				self.deferred.resolve();
			});
			app.templateLoader.get('main-map').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},

		render: function() {
			var self = this;
			this.deferred.done(function() {
				app.trigger('change', 'main-map');
				self.$el.html(self.template({
					trades: self.trades,
					max: self.max
				}));
			});
			return this;
		},

		fetchTrades: function() {
			var self = this;
			var deferred = $.Deferred();
			var trades = new app.Collections.trades();
			trades.setAccountId(1);
			trades.deferreds = [];
			trades.fetch({
				success: function() {
					$.when.apply($, trades.deferreds).done(function() {
						trades = trades.toJSON();
						for(var i = 0; i < trades.length; i++) {
							if(trades[i].isOpen) {
								continue;
							}
							var abs = Math.abs(trades[i].net);
							if(!self.max || abs > self.max) {
								self.max = abs;
							}
							self.trades.push(trades[i]);
						}
						deferred.resolve();
					});
				}
			});
			return deferred;
		}
	});
})();
