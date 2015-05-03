(function() {
	'use strict';

	app.Views.main = Backbone.View.extend({
		el: 'section#main-stats-friends',
		events: {
			'tap div.operation:not(.no-click):not(.swiped)': 'viewOperation',
			'tap div.trade:not(.swiped)': 'viewTrade',
			'tap li.button-swipe.delete': 'buttonDelete'
		},

		initialize: function(cache) {
			var self = this;
			this.deferred = $.Deferred();
			app.templateLoader.get('main').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render(cache);
			});
		},

		destroy: function() {
			if(app.shake) {
				app.shake.stopWatch();
				delete app.shake;
			}
			this.undelegateEvents();
		},

		render: function(cache) {
			var self = this;
			var template = app.cache.get('main', this.template, {
				objects: app.objects
			});
			if(typeof cache !== 'boolean') {
				app.trigger('change', 'main', {
					closed: app.count.closed
				});
				this.$el.html(template);
				this.decorate();
				if(navigator.accelerometer) {
					this.shake();
				}
				this.deferred.resolve();
			} else {
				setTimeout(function() {
					self.undelegateEvents();
				}, 10);
			}
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
				account_id: app.account.get('id'),
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
						created_at: 1420081201000
					});
					var diff = (new Date()).getTime() - 1420081201000;
					position.save(null, {
						success: function() {
							var price2 = Math.floor(Math.random() * 11) + 1000;
							var position2 = new app.Models.position();
							position2.set({
								trade_id: insertId,
								size: (size * -1),
								price: price2,
								created_at: Math.floor(Math.random() * diff) + 1420081201000
							});
							position2.save(null, {
								success: function() {
									var trade2 = new app.Models.trade({
										id: insertId
									});
									trade2.deferred.then(function() {
										trade2.setPnL(function() {
											app.objects[app.count.open].isFirst = false;
											app.count.closed++;
											app.objects.splice(app.count.open, 0, trade2.toJSON());
											app.objects[app.count.open].isFirst = true;
											app.cache.delete('main');
											app.cache.delete('mainMap');
											app.cache.delete('mainViewTrade' + app.objects[app.count.open + 1].id);
											app.loadView('main');
										});
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
							var operation = new app.Models.operation({
								id: id
							});
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
											app.objects[app.count.open].isFirst = true;
										}
										app.cache.delete('main');
										if(app.objects[app.count.open].instrument_id) {
											app.cache.delete('mainViewTrade' + app.objects[app.count.open].id);
										}
										app.loadView('main');
									}
								});
							});
							break;
						case 'trade':
							var trade = new app.Models.trade({
								id: id
							});
							trade.delete(function() {
								var key = $wrapper.data('key').toString();
								app.count.open--;
								app.objects.splice(key, 1);
								app.cache.delete('main');
								app.loadView('main');
							});
							break;
					}
					self.decorate();
				}
			});
		},

		calculator: function() {
			var self = this;
			this.destroy();
			var sum = 0;
			$('div.swipe-triangle').hide();
			$('div.label.open').css('backgroundColor', '#666666');
			$('div.label:not(.open)').css('backgroundColor', '#f6f6f6');
			$('footer').off().html('<div id="calculator">$ ' + accounting.formatMoney(sum, '') + '</div>');
			$.each($('div.added'), function() {
				$(this).removeClass('added');
			});
			var $calculator = $('div#calculator');
			app.trigger('change', 'calculator');
			$('div.label').off().on('tap', function(e) {
				e.preventDefault();
				var $target = $(e.currentTarget);
				var net = $target.data('net');
				if(net) {
					if($target.hasClass('added')) {
						if($target.hasClass('open')) {
							$target.css('backgroundColor', '#666666');
						} else {
							$target.css('backgroundColor', '#f6f6f6');
						}
						sum -= net;
						$target.removeClass('added');
					} else {
						if($target.hasClass('open')) {
							$target.css('backgroundColor', '#222222');
						} else {
							$target.css('backgroundColor', '#ffffff');
						}
						sum += net;
						$target.addClass('added');
					}
					if(sum > 0) {
						$calculator.css('backgroundColor', '#4bd763');
					} else if(sum < 0) {
						$calculator.css('backgroundColor', '#ff3b30');
					} else {
						$calculator.css('backgroundColor', '#fdb45c');
					}
					$calculator.html('$ ' + accounting.formatMoney(sum, ''));
				}
			});
			$calculator.off().on('touchend', function() {
				self.calculator();
			});
		},

		decorate: function() {
			this.drag = new app.Views.mainDrag();
			app.swipe.init('.swipe');
			var $content = $('section#content');
			var $ul = $content.children('ul');
			if($content.height() > $ul.height()) {
				$ul.append('<li style="background: #ffffff; height: ' + ($content.height() - $ul.height() + 5) + 'px; width: 100%;"></li>');
				setTimeout(function() {
					app.enableScroll();
				}, 10);
			} else {
				app.enableScroll();
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
			var key = $wrapper.data('key').toString();
			app.loadView('mainViewOperation', key);
		},

		viewTrade: function(e) {
			e.preventDefault();
			$('header button').hide();
			var $wrapper = $(e.currentTarget).parents('.wrapper-label');
			var $label = $($wrapper.context);
			var isOpen = $label.hasClass('open');
			if(!isOpen) {
				$label.css('backgroundColor', '#dadada');
			}
			var key = $wrapper.data('key').toString();
			app.loadView('mainViewTrade', key);
		}
	});
})();
