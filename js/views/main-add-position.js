(function() {
	'use strict';

	app.Views.mainAddPosition = Backbone.View.extend({
		el: 'section#main-stats-friends',
		events: {
			'tap div#done': 'combine',
			'tap input, textarea': 'isolate',
			'tap ul#type div:not(.active)': 'radio',
			'tap ul#type span': 'radio'
		},

		initialize: function(key) {
			var self = this;
			this.key = key;
			this.trade = app.objects[key];
			app.submit = function() {
				self.submit();
			}
			this.template = Handlebars.compile(app.templateLoader.get('main-add-position'));
			this.render();
		},

		destroy: function() {
			delete app.submit;
			this.undelegateEvents();
		},

		render: function() {
			app.trigger('change', 'main-add-position', {
				key: this.key
			});
			this.$el.html(this.template({
				closeSize: this.trade.closeSize
			}));
			return this;
		},

		combine: function(e) {
			e.preventDefault();
			app.combine();
		},

		isolate: function(e) {
			e.preventDefault();
			app.isolate(e);
		},

		radio: function(e) {
			e.preventDefault();
			var $target = $(e.currentTarget);
			var $radio = $target;
			if($target.is('span')) {
				$radio = $target.prev();
			}
			if(!$radio.hasClass('active')) {
				this.$el.find('ul.wrapper-radiobutton div.active').removeClass('active');
				$radio.addClass('active');
			}
		},

		submit: function() {
			var self = this;
			var type = this.$el.find('ul#type div.active').data('type');
			var size = this.$el.find('input#size').val();
			var price = this.$el.find('input#price').val().replace(',', '.');

			if(type === 2) {
				size *= -1;
			}
			var result = parseInt(size, 10) + this.trade.closeSize;
			switch(this.trade.type) {
				case 1:
					if(result < 0) {
						alertify.error('Position exceeds closing size');
						return;
					}
					break;
				case 2:
					if(result > 0) {
						alertify.error('Position exceeds closing size');
						return;
					}
					break;
			}
			var position = new app.Models.position();
			position.set({
				trade_id: this.trade.id,
				size: size,
				price: price,
				created_at: (new Date()).getTime()
			});
			position.validate();
			if(position.isValid()) {
				$('header button').hide();
				position.save(null, {
					success: function() {
						var trades = new app.Collections.trades();
						trades.setFetchId(self.trade.id);
						trades.fetch({
							success: function() {
								var trade = trades.at(0);
								trade.deferred.then(function() {
									if((self.trade.type === 1 && size < 0) || (self.trade.type === 2 && size > 0)) {
										trade.setPnL(function(closed) {
											if(closed) {
												app.objects[app.count.open].isNewest = false;
												app.count.open--;
												app.objects.splice(self.key, 1);
												app.count.closed++;
												app.objects.splice(app.count.open, 0, trade.toJSON());
												app.objects[app.count.open].isNewest = true;
												app.cache.delete('main');
												app.cache.delete('mainMap');
												app.cache.delete('mainViewTrade' + app.objects[app.count.open + 1].id);
												app.cache.delete('mainViewTrade' + self.trade.id);
												app.cache.delete('mainViewTradeContent' + self.trade.id);
												app.loadView('mainViewTrade', app.count.open.toString());
											} else {
												app.objects[self.key] = trade.toJSON();
												app.cache.delete('main');
												app.cache.delete('mainViewTrade' + self.trade.id);
												app.cache.delete('mainViewTradeContent' + self.trade.id);
												app.loadView('mainViewTrade', self.key);
											}
										});
									} else {
										app.objects[self.key] = trade.toJSON();
										app.cache.delete('main');
										app.cache.delete('mainViewTrade' + self.trade.id);
										app.loadView('mainViewTrade', self.key);
									}
								});
							}
						});
					}
				});
			}
		}
	});
})();
