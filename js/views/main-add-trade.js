(function() {
	'use strict';

	app.Views.mainAddTrade = Backbone.View.extend({
		el: 'section#main-stats-friends section#content',
		events: {
			'tap div#done': 'combine',
			'tap input': 'isolate',
			'tap select': 'isolate',
			'tap ul#type div:not(.active)': 'radio',
			'tap ul#type span': 'radio'
		},

		initialize: function() {
			var self = this;
			this.deferred = $.Deferred();
			this.instruments = [];
			this.fetchInstruments();
			app.submit = function() {
				self.submit();
			}
			app.templateLoader.get('main-add-trade').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},

		destroy: function() {
			delete app.submit;
			this.undelegateEvents();
		},

		render: function() {
			var self = this;
			this.deferred.done(function() {
				app.trigger('change', 'main-add-trade');
				self.$el.html(self.template({
					instruments: self.instruments
				}));
			});
			return this;
		},

		combine: function(e) {
			e.preventDefault();
			app.combine();
		},

		fetchInstruments: function() {
			var self = this;
			var instruments = new app.Collections.instruments();
			instruments.fetch({
				success: function() {
					instruments = instruments.toJSON();
					for(var i = 0; i < instruments.length; i++) {
						self.instruments.push(instruments[i]);
					}
					self.deferred.resolve();
				}
			});
		},

		isolate: function(e) {
			e.preventDefault();
			var cookie = $.cookie('cookie');
			if(cookie) {
				cookie = cookie.split('&');
				for(var i = 0; i < cookie.length; i++) {
					cookie[i] = cookie[i].split('=')[1];
				}
				var instrument_id = cookie[0];
				var size = cookie[1];
			}
			if($(e.currentTarget).prop('id') === 'size') {
				var $input = this.$el.find('input#size');
				if(!$input.val()) {
					if(size) {
						if(size < 0) {
							size *= -1;
						}
						$input.val(size);
					}
				}
			} else if($(e.currentTarget).prop('id') === 'instrument_id') {
				var $select = this.$el.find('select#instrument_id');
				if($select.val() === '0') {
					if(instrument_id) {
						$select.val(instrument_id);
					}
				}
			}
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
			var instrument_id = this.$el.find('select#instrument_id').val();
			var type = this.$el.find('ul#type div.active').data('type');
			var size = this.$el.find('input#size').val();
			if(type === 2) {
				size *= -1;
			}
			var price = this.$el.find('input#price').val().replace(',', '.');

			var deferred = $.Deferred();
			var trades = new app.Collections.trades();
			trades.setAccountId(app.account.get('id'));
			trades.setInstrumentId(instrument_id);
			trades.setOpen();
			trades.deferreds = [];
			trades.fetch({
				success: function() {
					$.when.apply($, trades.deferreds).done(function() {
						trades = trades.toJSON();
						if(trades.length > 0) {
							alertify.error('A trade for this instrument is already open');
						} else {
							deferred.resolve();
						}
					});
				}
			});

			deferred.done(function() {
				var trade = new app.Models.trade();
				trade.set({
					account_id: 1,
					instrument_id: instrument_id,
					type: type
				});
				trade.validate();
				var position = new app.Models.position();
				position.set({
					size: size,
					price: price,
					created_at: (new Date()).getTime()
				});
				position.validate();
				if(trade.isValid() && position.isValid()) {
					trade.save(null, {
						success: function(model, insertId) {
							$('header button').hide();
							position.set({
								trade_id: insertId
							});
							position.save(null, {
								success: function() {
									var cookie = {
										instrument_id: instrument_id,
										size: size
									};
									$.cookie('cookie', $.param(cookie), {
										expires: 20
									});
									app.cache.delete('main');
									app.loadView('mainViewTrade', {
										trade_id: insertId
									});
								}
							});
						}
					});
				}
			});
		}
	});
})();
