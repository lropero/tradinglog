(function() {
	'use strict';

	app.Views.mainAddPosition = Backbone.View.extend({
		el: 'section#main-stats-friends',
		events: {
			'tap div#done': 'combine',
			'tap input, textarea': 'isolate',
			'tap ul#type div:not(.active)': 'radio'
		},

		initialize: function(attrs) {
			var self = this;
			this.trade = attrs.trade;
			app.submit = function() {
				self.submit();
			}
			app.templateLoader.get('main-add-position').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},

		destroy: function(callback) {
			delete app.submit;
			this.undelegateEvents();
			if(typeof callback === 'function') {
				callback();
			}
		},

		render: function() {
			app.trigger('change', 'main-add-position', {
				trade: this.trade
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
			this.$el.find('ul.wrapper-radiobutton div.active').removeClass('active');
			var $target = $(e.currentTarget);
			$target.addClass('active');
		},

		submit: function() {
			var self = this;
			var type = this.$el.find('ul#type div.active').data('type');
			var size = this.$el.find('input#size').val();
			if(type === 2) {
				size *= -1;
			}
			var price = this.$el.find('input#price').val().replace(',', '.');
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
			position.save(null, {
				success: function() {
					if((self.trade.type === 1 && size < 0) || (self.trade.type === 2 && size > 0)) {
						var trade = new app.Models.trade({
							id: self.trade.id
						});
						trade.deferred.then(function() {
							trade.setPnL(function() {
								app.trigger('clear');
								app.loadView('mainViewTrade', {
									trade_id: self.trade.id
								});
							});
						});
					} else {
						app.trigger('clear');
						app.loadView('mainViewTrade', {
							trade_id: self.trade.id
						});
					}
				}
			});
		}
	});
})();
