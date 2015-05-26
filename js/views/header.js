(function() {
	'use strict';

	app.Views.header = Backbone.View.extend({
		el: 'header',

		initialize: function() {
			this.deferred = $.Deferred();
			app.listenTo(app, 'change', this.update);
			this.template = Handlebars.compile(app.templateLoader.get('header'));
			this.render();
		},

		render: function() {
			this.$el.html(this.template());
			this.deferred.resolve();
			return this;
		},

		update: function(view, attrs) {
			var options = {};
			switch(view) {
				case 'calculator':
					options = {
						left: {
							action: function() {
								app.trigger('change', 'main', {
									closed: app.count.closed
								});
								$.each($('div.added'), function() {
									$(this).removeClass('added');
								});
								$('div.swipe-triangle').show();
								$('div.label.open').css('backgroundColor', '#222222');
								$('div.label:not(.open)').css('backgroundColor', '#ffffff');
								$('div.label').off('tap.calculator');
								$('div#calculator').off().hide();
								new app.Views.footer();
								$.pep.toggleAll(true);
								app.view.delegateEvents();
							},
							icon: 'f124',
							text: 'Back'
						}
					};
					break;
				case 'easter':
					options = {
						left: {
							icon: 'f2a8'
						},
						right: {
							icon: 'f26a'
						}
					};
					break;
				case 'main':
					if(attrs.closed > 0) {
						options = {
							left: {
								icon: 'f274',
								rotate: true,
								view: 'mainMap'
							},
							right: {
								icon: 'f218',
								view: 'mainAdd'
							}
						};
					} else {
						options = {
							right: {
								icon: 'f218',
								view: 'mainAdd'
							}
						};
					}
					break;
				case 'main-add-comment':
				case 'main-add-position':
					options = {
						left: {
							action: function() {
								app.loadView('mainViewTrade', {
									key: attrs.key,
									top: attrs.top
								});
							},
							icon: 'f124',
							text: 'Cancel'
						},
						right: {
							action: function() {
								if(app.submit) {
									app.submit();
								}
							},
							animate: true,
							text: 'Add'
						}
					}
					break;
				case 'main-add-operation':
				case 'main-add-trade':
					options = {
						left: {
							icon: 'f124',
							text: 'Cancel',
							view: 'main'
						},
						right: {
							action: function() {
								if(app.submit) {
									app.submit();
								}
							},
							animate: true,
							text: 'Add'
						}
					}
					break;
				case 'main-edit-commission':
					options = {
						left: {
							action: function() {
								app.loadView('mainViewTrade', {
									key: attrs.key,
									top: attrs.top
								});
							},
							icon: 'f124',
							text: 'Cancel'
						},
						right: {
							action: function() {
								if(app.submit) {
									app.submit();
								}
							},
							animate: true,
							text: 'Save'
						}
					}
					break;
				case 'main-map':
					options = {
						left: {
							icon: 'f124',
							text: 'Back',
							view: 'main'
						}
					};
					break;
				case 'main-view-operation':
				case 'main-view-trade':
					options = {
						left: {
							action: function() {
								app.loadView('main', {
									key: attrs.key,
									top: attrs.top
								});
							},
							icon: 'f124',
							text: 'Back'
						}
					};
					break;
				case 'settings-accounts':
					options = {
						right: {
							action: function() {
								app.view.subview.destroy();
								app.view.subview = new app.Views.settingsAddAccount({});
							},
							icon: 'f218'
						}
					};
					break;
				case 'settings-add-account':
					options = {
						left: {
							action: function() {
								app.view.subview.destroy();
								app.view.subview = new app.Views.settingsAccounts();
							},
							icon: 'f124',
							text: 'Cancel'
						},
						right: {
							action: function() {
								if(app.submit) {
									app.submit();
								}
							},
							animate: true,
							text: 'Add'
						}
					}
					break;
				case 'settings-add-instrument':
					options = {
						left: {
							action: function() {
								app.view.subview.destroy();
								app.view.subview = new app.Views.settingsInstruments();
							},
							icon: 'f124',
							text: 'Cancel'
						},
						right: {
							action: function() {
								if(app.submit) {
									app.submit();
								}
							},
							animate: true,
							text: 'Add'
						}
					}
					break;
				case 'settings-edit-account':
					options = {
						left: {
							action: function() {
								app.view.subview.destroy();
								app.view.subview = new app.Views.settingsAccounts();
							},
							icon: 'f124',
							text: 'Back'
						},
						right: {
							action: function() {
								if(app.submit) {
									app.submit();
								}
							},
							animate: true,
							text: 'Save'
						}
					}
					break;
				case 'settings-edit-instrument':
					options = {
						left: {
							action: function() {
								app.view.subview.destroy();
								app.view.subview = new app.Views.settingsInstruments();
							},
							icon: 'f124',
							text: 'Back'
						},
						right: {
							action: function() {
								if(app.submit) {
									app.submit();
								}
							},
							animate: true,
							text: 'Save'
						}
					}
					break;
				case 'settings-instruments':
					options = {
						right: {
							action: function() {
								app.view.subview.destroy();
								app.view.subview = new app.Views.settingsAddInstrument({});
							},
							icon: 'f218'
						}
					};
					break;
			}
			app.headerNavigation.update(options);
		}
	});
})();
