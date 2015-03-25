(function() {
	'use strict';

	app.Views.header = Backbone.View.extend({
		el: 'header',

		initialize: function() {
			var self = this;
			this.deferred = $.Deferred();
			app.templateLoader.get('header').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
			this.listenTo(app, 'change', this.update);
		},

		render: function() {
			this.$el.html(this.template());
			this.deferred.resolve();
			return this;
		},

		update: function(view) {
			if(app.shake) {
				app.shake.stopWatch();
				delete app.shake;
			}
			var options = {};
			switch(view) {
				case '_agustin':
					options = {
						left: {
							icon: 'f124',
							text: 'Back',
							view: 'main'
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
					options = {
						left: {
							icon: 'f203',
							view: 'mainMap'
						},
						right: {
							icon: 'f218',
							view: 'mainAdd'
						}
					};
					break;
				case 'main-add-operation':
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
