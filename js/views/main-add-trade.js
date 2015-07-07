(function() {
	'use strict';

	app.Views.mainAddTrade = Backbone.View.extend({
		el: 'section#main-stats-friends section#content',
		events: {
			'tap div#done': 'combine',
			'tap input': 'isolate',
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
				var deferred = app.cache.get('mainAddTrade', self.template, {
					instruments: self.instruments
				});
				deferred.then(function(html) {
					if(typeof cache !== 'boolean') {
						app.trigger('change', 'main-add-trade');
						self.$el.html(html);
						var cookie = $.cookie('cookie');
						if(cookie) {
							cookie = cookie.split('&');
							for(var i = 0; i < cookie.length; i++) {
								cookie[i] = cookie[i].split('=')[1];
							}
							var $select = self.$el.find('select#instrument_id');
							if($select.val() === '0') {
								$select.val(cookie[0]);
							}
							self.cookieSize = cookie[1];
						}
						app.popups.show('open');
					}
				});
			});
			return this;
		},

		combine: function(e) {
			e.preventDefault();
			app.combine();
			return false;
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
			this.$el.find('select#instrument_id').prop('disabled', true);
			if($(e.currentTarget).prop('id') === 'size') {
				var $input = this.$el.find('input#size');
				if(!$input.val()) {
					if(typeof this.cookieSize !== 'undefined') {
						var size = this.cookieSize;
						if(size < 0) {
							size *= -1;
						}
						$input.val(size);
					}
				}
			}
			app.isolate(e);
			return false;
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
			return false;
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
					account_id: app.account.id,
					instrument_id: instrument_id,
					type: type
				});
				trade.validate();
				var created_at = (new Date()).getTime();
				var position = new app.Models.position();
				position.set({
					size: size,
					price: price,
					created_at: created_at
				});
				position.validate();
				if(trade.isValid() && position.isValid()) {
					app.trigger('change', 'loading-right');
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
												app.storeCache().done(function() {
													app.loadView('mainViewTrade', {
														key: 0,
														top: 0
													}, function() {
														app.cache.delete('main');
													});
												});
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
