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
				self.renderDrag();
				// app.scroll.init(self.el, true);
				app.swipe.init('.active-swipe');
				var content = $('section#content').height();
				var ul = $('section#content').find('ul').height();
				if(content > ul) {
					self.$el.append('<div style="bottom: -30px; height: 30px; position: absolute; width: 100%;"></div>');
				}
			});
			return this;
		},

		renderDrag: function() {
			$('div#drag').html('<div class="drag-account"><div class="account">Account: <span>Real</span></div><div class="balance">Balance: <span>$4,896.52</span></div></div>');
			$('div#drag').show();
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
		},

		destroy: function() {
			$('div#drag').hide();
			$('div#drag').empty();
		}
	});
})();
