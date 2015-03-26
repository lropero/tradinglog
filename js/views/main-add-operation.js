(function() {
	'use strict';

	app.Views.mainAddOperation = Backbone.View.extend({
		el: 'section#main-stats-friends section#content',
		events: {
			'blur input, textarea': 'combine',
			'touchend div#done': 'combine',
			'touchend input, textarea': 'isolate',
			'touchend ul#type div:not(.active)': 'radio'
		},

		initialize: function() {
			var self = this;
			app.templateLoader.get('main-add-operation').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
			app.submit = function() {
				self.submit();
			}
		},

		destroy: function() {
			delete app.submit;
			this.undelegateEvents();
		},

		render: function() {
			app.trigger('change', 'main-add-operation');
			this.$el.html(this.template());
			return this;
		},

		combine: function() {
			app.combine();
		},

		isolate: function(e) {
			app.isolate(e);
		},

		radio: function(e) {
			this.$el.find('ul.wrapper-radiobutton div.active').removeClass('active');
			var target = $(e.currentTarget);
			target.addClass('active');
		},

		submit: function() {
			var type = this.$el.find('ul#type div.active').data('type');
			var amount = this.$el.find('input#amount').val().replace(',', '.');
			amount = Math.abs(amount);
			if(type === 2) {
				amount *= -1;
			}
			var description = this.$el.find('textarea#description').val();
			var operation = new app.Models.operation();
			operation.set({
				account_id: 1,
				amount: amount,
				description: description,
				created_at: (new Date()).getTime()
			});
			operation.save(null, {
				success: function(model, insertId) {
					app.trigger('clear', 'main');
				}
			})
		}
	});
})();
