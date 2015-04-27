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
			this.undelegateEvents();

			// Remove
			if(app.shake) {
				app.shake.stopWatch();
				delete app.shake;
			}

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

				// Remove
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
						created_at: (new Date()).getTime()
					});
					position.save(null, {
						success: function() {
							var price2 = Math.floor(Math.random() * 11) + 1000;
							var position2 = new app.Models.position();
							position2.set({
								trade_id: insertId,
								size: (size * -1),
								price: price2,
								created_at: (new Date()).getTime()
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

		// Remove
		shake: function() {
			var self = this;
			app.shake = new Shake({
				frequency: 100,
				threshold: 30,
				success: function(magnitude, accelerationDelta, timestamp) {
					$('header button').hide();
					self.addRandomTrade();
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
