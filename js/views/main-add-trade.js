(function() {
	'use strict';

	app.Views.mainAddTrade = Backbone.View.extend({
		el: 'section#main-stats-friends section#content',

		initialize: function() {
			var self = this;
			app.templateLoader.get('main-add-trade').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
			this.instruments = [];
			this.fetchInstruments();
		},

		render: function() {
			app.trigger('change', 'main-add-trade');
			this.$el.html(this.template({
				instruments: this.instruments
			}));
			return this;
		},

		fetchInstruments: function() {
			var self = this;
			var instruments = new app.Collections.instruments();
			instruments.fetch({
				success: function() {
					// self.instruments = instruments.toJSON();
					// for(var i = 0; i < instruments.length; i++) {
					// 	self.instruments.push(i);
					// }
				}
			});
		}
	});
})();
