(function() {
	'use strict';

	app.Views.settingsAccounts = Backbone.View.extend({
		el: 'section#settings section#content',
		events: {
			'tap div.account:not(.swiped)': 'viewAccount',
			'tap li.button-swipe.delete': 'buttonDelete'
		},

		initialize: function() {
			var self = this;
			this.deferred = $.Deferred();
			this.accounts = [];
			var accounts = new app.Collections.accounts();
			accounts.fetch({
				success: function() {
					accounts = accounts.toJSON();
					for(var i = 0; i < accounts.length; i++) {
						self.accounts.push(accounts[i]);
					}
					self.deferred.resolve();
				}
			});
			app.templateLoader.get('settings-accounts').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},

		destroy: function() {
			this.undelegateEvents();
		},

		render: function() {
			var self = this;
			this.deferred.done(function() {
				app.trigger('change', 'settings-accounts');
				self.$el.html(self.template({
					accounts: self.accounts
				}));
				app.swipe.init('.swipe');
			});
			return this;
		},

		buttonDelete: function(e) {
			console.log('buttonDelete');
			// var self = this;
			// e.preventDefault();
			// var id = $(e.currentTarget).data('id');
			// var $wrapper = $(e.currentTarget).parents('.wrapper-label');
			// alertify.set({
			// 	buttonFocus: 'none',
			// 	buttonReverse: true,
			// 	labels: {
			// 		cancel: 'No',
			// 		ok: 'Yes'
			// 	}
			// });
			// alertify.confirm('Are you sure?', function(e) {
			// 	if(e) {
			// 		$wrapper.hide();
			// 		var instrument = new app.Models.instrument({
			// 			id: id
			// 		});
			// 		instrument.delete();
			// 	}
			// });
		},

		viewAccount: function(e) {
			console.log('viewAccount');
			// var self = this;
			// e.preventDefault();
			// var $wrapper = $(e.currentTarget).parents('.wrapper-label');
			// var $label = $($wrapper.context);
			// $label.css('backgroundColor', '#333');
			// var key = $wrapper.data('key');
			// setTimeout(function() {
			// 	app.view.subview.destroy();
			// 	app.view.subview = new app.Views.settingsAddInstrument({
			// 		instrument: self.instruments[key]
			// 	});
			// }, 10);
		}
	});
})();
