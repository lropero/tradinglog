(function() {
	'use strict';

	app.Views.settingsAddAccount = Backbone.View.extend({
		el: 'section#settings section#content',
		events: {
			'tap div#done': 'combine',
			'tap div.wrapper-checkbox': 'toggleCheckbox',
			'tap input': 'isolate'
		},

		initialize: function(attrs) {
			var self = this;
			this.cache = false;
			if(attrs.cache) {
				this.cache = true;
			} else if(attrs.account) {
				this.account = attrs.account;
			}
			app.submit = function() {
				self.submit();
			}
			this.template = Handlebars.compile(app.templateLoader.get('settings-add-account'));
			this.render();
		},

		destroy: function() {
			delete app.submit;
			this.undelegateEvents();
		},

		render: function() {
			var self = this;
			if(this.account) {
				app.trigger('change', 'settings-edit-account');
				this.$el.html(this.template({
					account: this.account
				}));
			} else {
				var deferred = app.cache.get('settingsAddAccount', this.template);
				deferred.then(function(html) {
					if(!self.cache) {
						app.trigger('change', 'settings-add-account');
						self.$el.html(html);
					}
				});
			}
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
			if(!this.account) {
				var balance = this.$el.find('input#balance').val().replace(',', '.');
				var is_active = this.$el.find('div#is_active').hasClass('active') ? 1 : 0;
			}

			name = name.charAt(0).toUpperCase() + name.slice(1);
			var deferred = $.Deferred();
			var accounts = new app.Collections.accounts();
			accounts.setName(name);
			accounts.fetch({
				success: function() {
					var same = false;
					if(self.account) {
						if(accounts.models[0] && self.account.id === accounts.models[0].id) {
							same = true;
						}
					}
					if(accounts.length > 0 && name.length && !same) {
						alertify.error('An account with this name already exists');
					} else {
						deferred.resolve();
					}
				}
			});
			deferred.done(function() {
				if(self.account) {
					accounts = new app.Collections.accounts();
					accounts.setFetchId(self.account.id);
					accounts.fetch({
						success: function() {
							var account = accounts.at(0);
							account.set({
								name: name
							});
							account.validate();
							if(account.isValid()) {
								$('header button').hide();
								account.save(null, {
									success: function() {
										app.account.set({
											name: name
										});
										app.cache.delete('main');
										app.cache.delete('mainMap');
										app.view.subview.destroy();
										app.view.subview = new app.Views.settingsAccounts();
									}
								});
							}
						}
					});
				} else {
					var account = new app.Models.account();
					account.set({
						name: name,
						balance: balance,
						is_active: is_active
					});
					account.validate();
					if(account.isValid()) {
						$('header button').hide();
						account.save(null, {
							success: function(model, insertId) {
								var operation = new app.Models.operation();
								operation.set({
									account_id: insertId,
									amount: balance,
									description: 'Initial deposit.',
									created_at: 1420081200000// Remove (new Date()).getTime()
								});
								operation.save(null, {
									success: function() {
										if(is_active) {
											app.account.set({
												is_active: 0
											});
											app.account.save(null, {
												success: function() {
													var accounts = new app.Collections.accounts();
													accounts.setActive();
													accounts.fetch({
														success: function() {
															app.account = accounts.models[0];
															app.fetchObjects().done(function() {
																app.cache.delete('mainMap');
																app.cache.delete('main').done(function() {
																	app.view.subview.destroy();
																	app.view.subview = new app.Views.settingsAccounts();
																});
															});
														}
													});
												}
											});
										} else {
											app.view.subview.destroy();
											app.view.subview = new app.Views.settingsAccounts();
										}
									}
								});
							}
						});
					}
				}
			});
		},

		toggleCheckbox: function(e) {
			e.preventDefault();
			var $checkbox = $(e.currentTarget).find('div.checkbox');
			if($checkbox.hasClass('active')) {
				$checkbox.removeClass('active');
			} else {
				$checkbox.addClass('active');
			}
		}
	});
})();
