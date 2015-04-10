(function() {
	'use strict';

	app.Views.header = Backbone.View.extend({
		el: 'header',

		initialize: function() {
			var self = this;
			this.deferred = $.Deferred();
			app.listenTo(app, 'change', this.update);
			app.templateLoader.get('header').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},

		render: function() {
			this.$el.html(this.template());
			this.deferred.resolve();
			return this;
		},

		update: function(view, attrs) {
			var options = {};
			switch(view) {
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
									trade: attrs.trade
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
							text: 'Add'
						}
					}
					break;
				case 'main-map':
				case 'main-view-operation':
				case 'main-view-trade':
				case '_agustin':
					options = {
						left: {
							icon: 'f124',
							text: 'Back',
							view: 'main'
						}
					};
					break;
			}
			app.headerNavigation.update(options);
		}
	});
})();
