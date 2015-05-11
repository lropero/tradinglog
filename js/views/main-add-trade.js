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

		initialize: function(cache) {
			var self = this;
			this.deferred = $.Deferred();
			this.instruments = [];
			this.fetchInstruments();
			app.submit = function() {
				self.submit();
			}
			this.template = Handlebars.compile(app.templateLoader.get('main-add-trade'));
			this.render(cache);
		},

		destroy: function() {
			delete app.submit;
			this.undelegateEvents();
		},

		render: function(cache) {
			var self = this;
			this.deferred.done(function() {
				var template = app.cache.get('mainAddTrade', self.template, {
					instruments: self.instruments
				});
				if(typeof cache !== 'boolean') {
					app.trigger('change', 'main-add-trade');
					self.$el.html(template);
				}
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
			var instrument_id = parseInt(this.$el.find('select#instrument_id').val(), 10);
			var type = this.$el.find('ul#type div.active').data('type');
			var size = this.$el.find('input#size').val();
			var price = this.$el.find('input#price').val().replace(',', '.');

			if(type === 2) {
				size *= -1;
			}
			var already = false;
			for(var i = 0; i < app.count.open; i++) {
				if(app.objects[i].instrument_id === instrument_id) {
					already = true;
					alertify.error('A trade for this instrument is already open');
					break;
				}
			}
			if(!already) {
				var trade = new app.Models.trade();
				trade.set({
					account_id: app.account.get('id'),
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
					$('header button').hide();
					trade.save(null, {
						success: function(model, insertId) {
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
									var trades = new app.Collections.trades();
									trades.setFetchId(insertId);
									trades.fetch({
										success: function() {
											var trade = trades.at(0);
											trade.deferred.then(function() {
												app.count.open++;
												app.objects.unshift(trade.toJSON());
												app.cache.delete('main');
												app.loadView('mainViewTrade', '0');
											});
										}
									});
								}
							});
						}
					});
				}
			}
		}
	});
})();
