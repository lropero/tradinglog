(function() {
	'use strict';

	app.Views.mainAddOperation = Backbone.View.extend({
		el: 'section#main-stats-friends section#content',
		events: {
			'tap div#done': 'combine',
			'tap input, textarea': 'isolate',
			'tap ul#type div:not(.active)': 'radio'
		},

		initialize: function() {
			var self = this;
			app.submit = function() {
				self.submit();
			}
			app.templateLoader.get('main-add-operation').done(function(template) {
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
			app.trigger('change', 'main-add-operation');
			this.$el.html(this.template());
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
			var type = this.$el.find('ul#type div.active').data('type');
			var amount = this.$el.find('input#amount').val().replace(',', '.');
			amount = Math.abs(amount);
			if(type === 2) {
				amount *= -1;
			}
			var description = this.$el.find('textarea#description').val().trim();
			var balance = app.account.get('balance') + amount;
			if(balance < 0) {
				alertify.error('Withdrawal exceeds your balance');
				return;
			}
			var operation = new app.Models.operation();
			operation.set({
				account_id: 1,
				amount: amount,
				description: description,
				variation: amount * 100 / app.account.get('balance'),
				created_at: (new Date()).getTime()
			});
			operation.save(null, {
				success: function(model, insertId) {
					app.account.set({
						balance: balance
					});
					app.account.save(null, {
						success: function() {
							app.trigger('clear', 'main');
						}
					});
				}
			})
		}
	});
})();
