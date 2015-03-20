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

				// var hammer = new Hammer($(self.$el)[0]);

				// hammer.get('pan').set({
				// 	direction: Hammer.DIRECTION_HORIZONTAL,
				// 	threshold: 20
				// });

				// hammer.on('panstart', function(e) {
				// 	if(app.view.swiped) {
				// 		$('section#content').css('-webkit-overflow-scrolling', 'auto');
				// 		$('section#content').css('overflow-y', 'hidden');
				// 		app.view.swiped.animate({
				// 			transform: 'translateX(0)'
				// 		}, 300, 'easeOutQuad', function() {
				// 			delete app.view.swiped;
				// 			$('section#content').css('-webkit-overflow-scrolling', 'touch');
				// 			$('section#content').css('overflow-y', 'scroll');
				// 		});
				// 	} else {
				// 		var $target = $(e.target).parents('div.active-swipe');
				// 		if($target.hasClass('active-swipe')) {
				// 			if(e.direction === Hammer.DIRECTION_LEFT) {
				// 				$target.animate({
				// 					transform: 'translateX(-80px)'
				// 				}, 500, 'easeOutExpo', function() {
				// 					$('section#content').css('-webkit-overflow-scrolling', 'auto');
				// 					$('section#content').css('overflow-y', 'hidden');
				// 					app.view.swiped = $target;
				// 				});
				// 			}
				// 		}
				// 	}
				// });

				// hammer.on('tap', function(e) {
				// 	if(app.view.swiped) {
				// 		app.view.swiped.animate({
				// 			transform: 'translateX(0)'
				// 		}, 300, 'easeOutQuad', function() {
				// 			delete app.view.swiped;
				// 			$('section#content').css('-webkit-overflow-scrolling', 'touch');
				// 			$('section#content').css('overflow-y', 'scroll');
				// 		});
				// 	}
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
