(function() {
	'use strict';

	app.Views.mainDrag = Backbone.View.extend({
		el: 'div#drag',

		initialize: function() {
			this.deferred = $.Deferred();
			this.template = Handlebars.compile(app.templateLoader.get('main-drag'));
			this.render();
		},

		render: function() {
			this.$el.html(this.template({
				account: app.account.get('name'),
				balance: app.account.get('balance')
			}));
			$('.drag-account').css('height', parseInt($('section#content').height() / 2, 10) + 'px');
			this.$el.show();
			if(app.platform !== 'iOS') {
				this.$el.find('div.peeking').hide();
			}
			return this;
		}
	});
})();
