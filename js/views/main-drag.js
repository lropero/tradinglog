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
		},

		destroy: function() {
			this.$el.hide();
		},

		render: function() {
			this.$el.html(this.template({
				account: app.account.get('name'),
				balance: app.account.get('balance')
			}));
			$('.drag-account').css('height', parseInt($('section#content').height() / 2, 10) + 'px');
			this.$el.show();
			return this;
		}
	});
})();
