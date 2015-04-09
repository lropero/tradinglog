(function() {
	'use strict';

	app.Views.mainMap = Backbone.View.extend({
		el: 'section#main-stats-friends',

		initialize: function(cache) {
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
				self.render(cache);
			});
		},

		destroy: function() {
			this.drag.destroy();
		},

		render: function(cache) {
			var self = this;
			this.deferred.done(function() {
				var template = app.cache.get('map', self.template, {
					trades: self.trades,
					max: self.max
				});
				if(typeof cache !== 'boolean') {
					app.trigger('change', 'main-map');
					self.$el.html(template);
					self.decorate();
				}
			});
			return this;
		},

		decorate: function() {
			this.drag = new app.Views.mainDrag();
			var $content = $('section#content');
			var $ul = $('section#content').find('ul');
			if($content.height() > $ul.height()) {
				$ul.append('<li style="background: #ffffff; height: ' + ($content.height() - $ul.height() + 5) + 'px; width: 100%;"></li>');
				setTimeout(function() {
					app.enableScroll();
				}, 10);
			} else {
				app.enableScroll();
			}
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
