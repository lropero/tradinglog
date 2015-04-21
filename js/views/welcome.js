(function() {
	'use strict';

	app.Views.welcome = Backbone.View.extend({
		el: 'div#layout',
		events: {
			'tap div#done': 'combine',
			'tap div#start': 'submit',
			'tap input': 'isolate'
		},

		initialize: function() {
			var self = this;
			this.deferred = $.Deferred();
			app.submit = function() {
				self.submit();
			}
			app.templateLoader.get('welcome').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},

		destroy: function() {
			delete app.submit;
			this.undelegateEvents();
		},

		render: function() {
			this.$el.html(this.template());
			var heightDiff = $(document).height() - $('div.content').height();
			if(heightDiff > 0) {
				$('div.content').css('paddingTop', parseInt(heightDiff / 2, 10) - 15 + 'px');
			}
			this.deferred.resolve();
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

		submit: function() {
			var self = this;
			var name = this.$el.find('input#name').val().trim();
			var balance = this.$el.find('input#balance').val().replace(',', '.');

			name = name.charAt(0).toUpperCase() + name.slice(1);
			var account = new app.Models.account();
			account.set({
				name: name,
				balance: balance,
				is_active: 1
			});
			account.save(null, {
				success: function(model, insertId) {
					if(navigator.splashscreen) {
						navigator.splashscreen.show();
					}
					$('div#start').hide();
					var operation = new app.Models.operation();
					operation.set({
						account_id: insertId,
						amount: balance,
						description: 'Initial deposit.',
						created_at: (new Date()).getTime()
					});
					operation.save(null, {
						success: function() {
							self.destroy();
							app.databaseController.populateInstruments();
							app.init();
						}
					});
				}
			});
		}
	});
})();
