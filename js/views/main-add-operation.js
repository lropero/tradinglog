(function() {
	'use strict';

	app.Views.mainAddOperation = Backbone.View.extend({
		el: 'section#main-stats-friends section#content',
		events: {
			'tap div#done': 'combine',
			'tap input, textarea': 'isolate',
			'tap ul#type div:not(.active)': 'radio',
			'tap ul#type span': 'radio'
		},

		initialize: function(cache) {
			var self = this;
			app.submit = function() {
				self.submit();
			}
			this.template = Handlebars.compile(app.templateLoader.get('main-add-operation'));
			this.render(cache);
		},

		destroy: function() {
			delete app.submit;
			this.undelegateEvents();
		},

		render: function(cache) {
			var self = this;
			var deferred = app.cache.get('mainAddOperation', this.template);
			deferred.then(function(html) {
				if(typeof cache !== 'boolean') {
					app.trigger('change', 'main-add-operation');
					self.$el.html(html);
				}
			});
			return this;
		},

		combine: function(e) {
			e.preventDefault();
			app.combine();
			return false;
		},

		isolate: function(e) {
			e.preventDefault();
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
			var type = this.$el.find('ul#type div.active').data('type');
			var amount = this.$el.find('input#amount').val().replace(',', '.');
			var description = this.$el.find('textarea#description').val().trim();

			amount = Math.abs(amount);
			if(type === 2) {
				amount *= -1;
			}
			var balance = parseFloat(Big(app.account.get('balance')).plus(amount).toString());
			if(balance < 0) {
				alertify.error('Withdrawal exceeds your balance');
				return;
			}
			var created_at = (new Date()).getTime();

			// Remove & uncomment previous line
			app.timestamp += Math.floor(Math.random() * 432000000);
			created_at = app.timestamp;

			var operation = new app.Models.operation();
			if(app.account.get('balance') > 0) {
				var variation = parseFloat(Big(amount * 100).div(app.account.get('balance')).toString());
			} else {
				var variation = 0;
			}
			operation.set({
				account_id: app.account.id,
				amount: amount,
				description: description,
				variation: variation,
				created_at: created_at
			});
			operation.validate();
			if(operation.isValid()) {
				app.trigger('change', 'loading-right');
				operation.save(null, {
					success: function(model, insertId) {
						app.account.set({
							balance: balance
						});
						app.account.save(null, {
							success: function() {
								operation.set({
									id: insertId
								});
								app.count.operations++;
								app.objects[app.count.open].isNewest = false;
								app.objects.splice(app.count.open, 0, operation.toJSON());
								app.objects[app.count.open].isNewest = true;
								app.stats.affect(created_at);
								app.storeCache().done(function() {
									app.cache.delete('main').done(function() {
										app.loadView('main', {});
									});
								});
							}
						});
					}
				});
			}
		}
	});
})();
