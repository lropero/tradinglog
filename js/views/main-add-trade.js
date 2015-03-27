(function() {
	'use strict';

	app.Views.mainAddTrade = Backbone.View.extend({
		el: 'section#main-stats-friends section#content',
		events: {
			// 'blur input': 'combine',
			// 'touchend div#done': 'combine',
			// 'touchend input': 'isolate',
			'touchend ul#type div:not(.active)': 'radio'
		},

		initialize: function() {
			var self = this;
			app.templateLoader.get('main-add-trade').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
			this.instruments = [];
			this.fetchInstruments();
			app.submit = function() {
				self.submit();
			}
		},

		destroy: function() {
			delete app.submit;
			this.undelegateEvents();
		},

		render: function() {
			app.trigger('change', 'main-add-trade');
			this.$el.html(this.template({
				instruments: this.instruments
			}));
			var size = $.cookie('size');
			if(size) {
				if(size < 0) {
					size *= -1;
				}
				this.$el.find('input#size').val(size);
			}
			return this;
		},

		combine: function() {
			app.form.combine();
		},

		fetchInstruments: function() {
			var self = this;
			var instruments = new app.Collections.instruments();
			instruments.fetch({
				success: function() {
					// self.instruments = instruments.toJSON();
					// for(var i = 0; i < instruments.length; i++) {
					// 	self.instruments.push(i);
					// }
				}
			});
		},

		isolate: function(e) {
			app.form.isolate(e);
		},

		radio: function(e) {
			this.$el.find('ul.wrapper-radiobutton div.active').removeClass('active');
			var target = $(e.currentTarget);
			target.addClass('active');
		},

		submit: function() {
			var instrument_id = 1;
			var type = this.$el.find('ul#type div.active').data('type');
			var size = parseInt(this.$el.find('input#size').val(), 10);
			if(type === 2) {
				size *= -1;
			}
			var price = this.$el.find('input#price').val().replace(',', '.');
			var position = new app.Models.position();
			position.set({
				size: size,
				price: price,
				created_at: (new Date()).getTime()
			});
			position.validate();
			if(position.isValid()) {
				var trade = new app.Models.trade();
				trade.set({
					account_id: 1,
					instrument_id: instrument_id,
					type: type
				});
				trade.save(null, {
					success: function(model, insertId) {
						position.set({
							trade_id: insertId
						});
						position.save(null, {
							success: function() {
								$.cookie('size', size, {
									expires: 30
								});
								app.trigger('clear', 'main');
							}
						});
					}
				});
			}
		}
	});
})();
