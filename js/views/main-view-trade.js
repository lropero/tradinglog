(function() {
	'use strict';

	app.Views.mainViewTrade = Backbone.View.extend({
		el: 'section#main-stats-friends',

		initialize: function(attrs) {
			var self = this;
			this.trade = new app.Models.trade({
				id: attrs.id
			});
			this.trade.deferred.done(function() {
				app.templateLoader.get('main-view-trade').done(function(template) {
					self.template = Handlebars.compile($(template).html().trim());
					self.render();
				});
			});
		},

		render: function() {
			app.trigger('change', 'main-view-trade');
			this.$el.html(this.template({
				trade: this.trade.toJSON()
			}));
			return this;
		}
	});
})();
