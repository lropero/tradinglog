(function() {
	'use strict';

	app.Views.settingsAccounts = Backbone.View.extend({
		el: 'section#settings section#content',
		events: {
			'tap div.account:not(.swiped)': 'viewAccount',
			'tap div.radiobutton': 'activeAccount',
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
			this.template = Handlebars.compile(app.templateLoader.get('settings-accounts'));
			this.render();
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

		activeAccount: function(e) {
			var self = this;
			e.preventDefault();
			e.stopPropagation();
			var $target = $(e.currentTarget);
			if(!$target.hasClass('active')) {
				app.view.subview.destroy();
				this.$el.find('div.radiobutton.active').removeClass('active');
				$target.addClass('active');
				app.account.set({
					is_active: 0
				});
				app.account.save(null, {
					success: function() {
						var $wrapper = $target.parents('.wrapper-label');
						var key = $wrapper.data('key');
						var account = new app.Models.account({
							id: self.accounts[key].id
						});
						account.deferred.done(function() {
							account.set({
								is_active: 1
							});
							account.save(null, {
								success: function(model) {
									app.account = model;
									app.fetchObjects().done(function() {
										app.cache.delete('main');
										app.cache.delete('mainMap');
										app.view.subview = new app.Views.settingsAccounts();
									});
								}
							});
						});
					}
				});
			}
		},

		buttonDelete: function(e) {
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
				if(e) {
					$wrapper.hide();
					var account = new app.Models.account({
						id: id
					});
					account.delete();
				}
			});
		},

		viewAccount: function(e) {
			var self = this;
			e.preventDefault();
			$('header button').hide();
			var $wrapper = $(e.currentTarget).parents('.wrapper-label');
			var $label = $($wrapper.context);
			$label.css('backgroundColor', '#333');
			var key = $wrapper.data('key');
			app.view.subview.destroy();
			setTimeout(function() {
				app.view.subview = new app.Views.settingsAddAccount(self.accounts[key]);
			}, 10);
		}
	});
})();
