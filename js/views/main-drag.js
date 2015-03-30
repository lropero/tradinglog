(function() {
	'use strict';

	app.Views.mainDrag = Backbone.View.extend({
		el: 'div#drag',

		initialize: function() {
			var self = this;
			this.deferred = $.Deferred();
			app.templateLoader.get('main-drag').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
			this.fetchAccount();
		},

		destroy: function() {
			this.$el.hide();
		},

		render: function() {
			var self = this;
			this.deferred.done(function() {
				self.$el.html(self.template({
					account: self.account.get('name'),
					balance: self.account.get('balance')
				}));
				self.$el.show();
			});
			return this;
		},

		fetchAccount: function() {
			var self = this;
			this.account = new app.Models.account({
				id: 1
			});
			this.account.fetch({
				success: function() {
					self.deferred.resolve();
				}
			});
		}
	});
})();
