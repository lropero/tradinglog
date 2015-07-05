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
			if(typeof attrs !== 'undefined') {
				if(attrs.cache) {
					this.cache = true;
				} else if(attrs.key) {
					this.key = attrs.key;
					this.top = attrs.top;
				}
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
						var interval = setInterval(function() {
							if(app.shake) {
								clearInterval(interval);
							} else {
								clearInterval(interval);
								self.shake();
							}
						}, 500);
					}
					if(app.platform === 'iOS') {
						app.popups.show('drag');
					}
					if(app.count.open > 0 || app.count.operations > 1) {
						app.popups.show('delete');
					}
					if(app.count.closed === 1) {
						app.popups.show('map');
					}
					if(app.count.closed === 3) {
						app.popups.show('calculator');
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
									var amount = operation.get('amount');
									var created_at = operation.get('created_at');
									operation.delete(function() {
										var balance = parseFloat(Big(app.account.get('balance')).minus(amount).toString());
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
												app.stats.affect(created_at);
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
			return false;
		},

		calculator: function() {
			var self = this;
			app.sum = Big(0);
			var $calculator = $('div#calculator');
			if($calculator.is(':visible')) {
				$.each($('div.added'), function() {
					$(this).removeClass('added');
				});
				$('div.label.open').css('backgroundColor', '#555555');
				$('div.label:not(.open)').css('backgroundColor', '#cccccc');
				$('div.globe-commission').css('backgroundColor', '#cccccc');
				$calculator.css('backgroundColor', '#4020d0');
				$calculator.html('$ ' + accounting.formatMoney(app.sum.toString(), ''));
				return;
			}
			setTimeout(function() {
				self.undelegateEvents();
				$.pep.toggleAll(false);
				app.trigger('change', 'calculator');
				$('div.swipe-triangle').hide();
				$('div.label.open').css('backgroundColor', '#555555');
				$('div.label:not(.open)').css('backgroundColor', '#cccccc');
				$('div.globe-commission').css('backgroundColor', '#cccccc');
				$('footer').off().html('<div id="calculator">$ ' + accounting.formatMoney(app.sum.toString(), '') + '</div>');
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
								$target.find('div.globe-commission').css('backgroundColor', '#cccccc');
							}
							app.sum = app.sum.minus(net);
							$target.removeClass('added');
						} else {
							if($target.hasClass('open')) {
								$target.css('backgroundColor', '#222222');
							} else {
								$target.css('backgroundColor', '#ffffff');
								$target.find('div.globe-commission').css('backgroundColor', '#ffffff');
							}
							app.sum = app.sum.plus(net);
							$target.addClass('added');
						}
						if(parseFloat(app.sum.toString()) > 0) {
							$calculator.css('backgroundColor', '#4bd763');
						} else if(parseFloat(app.sum.toString()) < 0) {
							$calculator.css('backgroundColor', '#ff3b30');
						} else {
							$calculator.css('backgroundColor', '#4020d0');
						}
						$calculator.html('$ ' + accounting.formatMoney(app.sum.toString(), ''));
					}
					return false;
				});
			}, 10);
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
			if(app.platform !== 'iOS') {
				this.$el.css('top', '94px');
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
			var $wrapper = $(e.currentTarget).parents('.wrapper-label');
			var key = $wrapper.data('key');
			var top = $('section#content').scrollTop();
			app.loadView('mainViewOperation', {
				key: key,
				top: top
			});
			return false;
		},

		viewTrade: function(e) {
			e.preventDefault();
			var $wrapper = $(e.currentTarget).parents('.wrapper-label');
			var key = $wrapper.data('key');
			var top = $('section#content').scrollTop();
			app.loadView('mainViewTrade', {
				key: key,
				top: top
			});
			return false;
		}
	});
})();
