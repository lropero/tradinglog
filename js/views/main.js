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
				if($('section#settings').hasClass('show')) {
					setTimeout(function() {
						$('#main-stats-friends').css('zIndex', '2000');
					}, 1000);
				} else {
					$('#main-stats-friends').css('zIndex', '2000');
				}

				// app.scroll.init(self.el, true);
				// app.swipe.init('.active-swipe');
			});
			return this;
		},

		renderDrag: function() {
			$('header div#drag').html('<div class="drag-account"><div class="account">Account: <span>Real</span></div><div class="balance">Balance: <span>$4,896.52</span></div></div>');
			$('header div#drag').show();
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
			$('header div#drag').hide();
			$('header div#drag').empty();
			$('#main-stats-friends').css('zIndex', '0');
		}
	});
})();
