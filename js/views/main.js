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

				document.getElementById('content').addEventListener('touchstart', function(e) {});

				document.getElementById('content').addEventListener('onscroll', function(e) {
					$('footer').html('onscroll');
				});

				document.getElementById('content').addEventListener('scroll', function(e) {
					var pos = $('#content ul').position().top;
					$('footer').html(pos);
				});

				// this.listenTo(app, 'scroll', function() {
				// 	console.log('pepe');
				// });

				// var hammer = new Hammer(self.el);
				// hammer.get('pan').set({
				// 	direction: Hammer.DIRECTION_VERTICAL,
				// 	threshold: 20
				// });

				// hammer.on('pan', function(e) {
				// 	// var pos = $('#content ul').position().top;
				// 	// // console.log(pos);
				// 	// $('footer').html(pos);
				// });

				// app.scroll.init(self.el, true);
				// app.swipe.init('.active-swipe');
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
