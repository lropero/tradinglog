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


				setTimeout(function() {
					$('section#content').css('-webkit-overflow-scrolling', 'auto');
					$('section#content').css('overflow-y', 'hidden');
					setTimeout(function() {
						$('section#content').css('-webkit-overflow-scrolling', 'touch');
						$('section#content').css('overflow-y', 'scroll');
					}, 5000);
				}, 5000);
				// var hammer = new Hammer($(self.$el)[0]);

				// hammer.get('pan').set({
				// 	direction: Hammer.DIRECTION_VERTICAL,
				// 	threshold: 20
				// });

				// hammer.on('panstart', function(e) {
				// 	console.log(document.getElementById('content').style.webkitOverflowScrolling);
				// 	// console.log($('section#content').css('webkitOverflowScrolling'));
				// 	$('section#content').css('-webkit-overflow-scrolling', 'touch');
				// 	$('section#content').css('overflow-y', 'scroll');
				// });


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
