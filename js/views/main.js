(function() {
	'use strict';

	app.Views.main = Backbone.View.extend({
		el: 'section#main-stats-friends',
		events: {
			'tap div.operation:not(.no-click):not(.swiped)': 'viewOperation',
			'tap div.trade:not(.swiped)': 'viewTrade',
			'tap li.button-swipe.delete': 'buttonDelete'
		},

		initialize: function(attrs) {
			this.deferred = $.Deferred();
			this.cache = false;
			if(attrs.cache) {
				this.cache = true;
			} else if(attrs.key) {
				this.key = attrs.key;
				this.top = attrs.top;
			}
			this.template = Handlebars.compile(app.templateLoader.get('main'));
			this.render();
		},

		destroy: function() {
			if(app.shake) {
				app.shake.stopWatch();
				delete app.shake;
			}
			this.undelegateEvents();
		},

		render: function() {
			var self = this;
			var deferred = app.cache.get('main', this.template);
			deferred.then(function(html, extra) {
				if(!self.cache) {
					app.trigger('change', 'main', {
						closed: extra.closed
					});
					self.$el.html(html);
					self.decorate();
					if(navigator.accelerometer) {
						self.shake();
					}
					self.deferred.resolve();
				} else {
					setTimeout(function() {
						self.destroy();
					}, 10);
				}
			});
			return this;
		},

		// Remove
		addRandomTrade: function() {
			var instrument_id = 1;
			var type = Math.floor(Math.random() * 2) + 1;
			var size = Math.floor(Math.random() * 5) + 1;
			var price = Math.floor(Math.random() * 11) + 1000;

			if(type === 2) {
				size *= -1;
			}
			var trade = new app.Models.trade();
			trade.set({
				account_id: app.account.id,
				instrument_id: instrument_id,
				type: type
			});
			trade.save(null, {
				success: function(model, insertId) {
					var position = new app.Models.position();
					position.set({
						trade_id: insertId,
						size: size,
						price: price,
						created_at: app.timestamp
					});
					app.timestamp += Math.floor(Math.random() * 432000000);
					position.save(null, {
						success: function() {
							var price2 = Math.floor(Math.random() * 11) + 1000;
							var position2 = new app.Models.position();
							position2.set({
								trade_id: insertId,
								size: (size * -1),
								price: price2,
								created_at: app.timestamp
							});
							position2.save(null, {
								success: function() {
									var trades = new app.Collections.trades();
									trades.setFetchId(insertId);
									trades.fetch({
										success: function() {
											var trade2 = trades.at(0);
											trade2.deferred.then(function() {
												trade2.setPnL(function() {
													app.objects[app.count.open].isNewest = false;
													app.count.closed++;
													app.objects.splice(app.count.open, 0, trade2.toJSON());
													app.objects[app.count.open].isNewest = true;

													// Stats
													var date = new Date(app.timestamp);
													if(!app.dates.firstDate) {
														app.dates.firstDate = date.getTime();
													}
													app.dates.lastDate = date.getTime();
													var monthly = date.getFullYear() + '-' + date.getMonth();
													date.setDate(date.getDate() - date.getDay());
													var weekly = date.getFullYear() + '-' + date.getMonth() + '-' + (date.getDate());
													if(app.stats.availables.monthly[0] !== monthly) {
														app.stats.availables.monthly.unshift(monthly);
													}
													if(app.stats.availables.weekly[0] !== weekly) {
														app.stats.availables.weekly.unshift(weekly);
													}
													app.stats.delete(monthly).done(function() {
														app.stats.delete(weekly);
													});

													app.storeCache().done(function() {
														app.cache.delete('main').done(function() {
															app.loadView('main', {}, function() {
																app.cache.delete('mainMap');
															});
														});
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
			});
		},

		buttonDelete: function(e) {
			var self = this;
			e.preventDefault();
			var id = $(e.currentTarget).data('id');
			var $wrapper = $(e.currentTarget).parents('.wrapper-label');
			alertify.set({
				buttonFocus: 'none',
				buttonReverse: true,
				labels: {
					cancel: 'No',
					ok: 'Yes'
				}
			});
			alertify.confirm('Are you sure?', function(e) {
				var $alertify = $('section#alertify');
				$alertify.hide();
				setTimeout(function() {
					if($('div#alertify-cover').is(':hidden')) {
						$alertify.show();
					}
				}, 100);
				if(e) {
					$wrapper.hide();
					var $label = $wrapper.children('div');
					var object = $label.hasClass('operation') ? 'operation' : ($label.hasClass('trade') ? 'trade' : '');
					switch(object) {
						case 'operation':
							var operations = new app.Collections.operations();
							operations.setFetchId(id);
							operations.fetch({
								success: function() {
									var operation = operations.at(0);
									operation.delete(function(amount) {
										var balance = app.account.get('balance') - amount;
										app.account.set({
											balance: balance
										});
										app.account.save(null, {
											success: function() {
												var key = $wrapper.data('key').toString();
												app.count.operations--;
												app.objects.splice(key, 1);
												if(!(!app.count.closed && app.count.operations === 1)) {
													app.objects[app.count.open].isNewest = true;
												}
												app.storeCache().done(function() {
													app.cache.delete('main').done(function() {
														app.loadView('main');
													});
												});
											}
										});
									});
								}
							});
							break;
						case 'trade':
							var trades = new app.Collections.trades();
							trades.setFetchId(id);
							trades.fetch({
								success: function() {
									var trade = trades.at(0);
									trade.delete(function() {
										var key = $wrapper.data('key').toString();
										app.count.open--;
										app.objects.splice(key, 1);
										app.storeCache().done(function() {
											app.cache.delete('main').done(function() {
												app.loadView('main');
											});
										});
									});
								}
							});
							break;
					}
					self.decorate();
				}
			});
		},

		calculator: function() {
			var self = this;
			app.sum = 0;
			var $calculator = $('div#calculator');
			if($calculator.is(':visible')) {
				$.each($('div.added'), function() {
					$(this).removeClass('added');
				});
				$('div.label.open').css('backgroundColor', '#555555');
				$('div.label:not(.open)').css('backgroundColor', '#cccccc');
				$calculator.css('backgroundColor', '#4020d0');
				$calculator.html('$ ' + accounting.formatMoney(app.sum, ''));
				return;
			}
			this.undelegateEvents();
			$.pep.toggleAll(false);
			app.trigger('change', 'calculator');
			$('div.swipe-triangle').hide();
			$('div.label.open').css('backgroundColor', '#555555');
			$('div.label:not(.open)').css('backgroundColor', '#cccccc');
			$('footer').off().html('<div id="calculator">$ ' + accounting.formatMoney(app.sum, '') + '</div>');
			$calculator = $('div#calculator');
			$('div.label').on('tap.calculator', function(e) {
				e.preventDefault();
				var $target = $(e.currentTarget);
				var net = $target.data('net');
				if(net) {
					if($target.hasClass('added')) {
						if($target.hasClass('open')) {
							$target.css('backgroundColor', '#555555');
						} else {
							$target.css('backgroundColor', '#cccccc');
						}
						app.sum -= net;
						$target.removeClass('added');
					} else {
						if($target.hasClass('open')) {
							$target.css('backgroundColor', '#222222');
						} else {
							$target.css('backgroundColor', '#ffffff');
						}
						app.sum += net;
						$target.addClass('added');
					}
					if(app.sum > 0) {
						$calculator.css('backgroundColor', '#4bd763');
					} else if(app.sum < 0) {
						$calculator.css('backgroundColor', '#ff3b30');
					} else {
						$calculator.css('backgroundColor', '#4020d0');
					}
					$calculator.html('$ ' + accounting.formatMoney(app.sum, ''));
				}
			});
			$calculator.on('tap', function() {
				app.sum = 0;
				$.each($('div.added'), function() {
					$(this).removeClass('added');
				});
				$('div.label.open').css('backgroundColor', '#555555');
				$('div.label:not(.open)').css('backgroundColor', '#cccccc');
				$calculator.css('backgroundColor', '#4020d0');
				$calculator.html('$ ' + accounting.formatMoney(app.sum, ''));
			});
		},

		decorate: function() {
			this.drag = new app.Views.mainDrag();
			app.swipe.init('.swipe');
			var $content = $('section#content');
			var $ul = $content.children('ul');
			if($content.height() > $ul.height()) {
				$ul.append('<li style="background: #ffffff; height: ' + ($content.height() - $ul.height() + 5) + 'px; width: 100%;"></li>');
				if(this.key) {
					var $wrapper = $ul.find('li.wrapper-label' + '[data-key="' + this.key + '"]');
					var $ball = $wrapper.find('div.ball');
					var animated = 'animated bounceIn';
					$ball.addClass(animated).one('webkitAnimationEnd', function() {
						$ball.removeClass(animated);
					});
					setTimeout(function() {
						app.enableScroll();
					}, 10);
				} else {
					setTimeout(function() {
						app.enableScroll();
					}, 10);
				}
			} else {
				if(this.key) {
					var $wrapper = $ul.find('li.wrapper-label' + '[data-key="' + this.key + '"]');
					var $ball = $wrapper.find('div.ball');
					$content.scrollTop(this.top);
					var animated = 'animated bounceIn';
					$ball.addClass(animated).one('webkitAnimationEnd', function() {
						$ball.removeClass(animated);
					});
					setTimeout(function() {
						app.enableScroll();
					}, 10);
				} else {
					app.enableScroll();
				}
			}
		},

		shake: function() {
			var self = this;
			app.shake = new Shake({
				frequency: 100,
				threshold: 30,
				success: function(magnitude, accelerationDelta, timestamp) {
					self.calculator();
				}
			});
			app.shake.startWatch();
		},

		viewOperation: function(e) {
			e.preventDefault();
			$('header button').hide();
			var $wrapper = $(e.currentTarget).parents('.wrapper-label');
			var key = $wrapper.data('key');
			var top = $('section#content').scrollTop();
			app.loadView('mainViewOperation', {
				key: key,
				top: top
			});
		},

		viewTrade: function(e) {
			e.preventDefault();
			$('div#drag').css('display', 'none');
			var $wrapper = $(e.currentTarget).parents('.wrapper-label');
			var key = $wrapper.data('key');
			var top = $('section#content').scrollTop();
			app.loadView('mainViewTrade', {
				key: key,
				top: top
			});
		}
	});
})();
