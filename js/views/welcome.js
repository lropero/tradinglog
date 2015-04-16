(function() {
	'use strict';

	app.Views.welcome = Backbone.View.extend({
		el: 'div#layout',

		initialize: function() {
			var self = this;
			this.deferred = $.Deferred();
			app.templateLoader.get('welcome').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},

		render: function() {
			this.$el.html(this.template());
			var heightDiff = $(document).height() - $('div.content').height();
			if(heightDiff > 0) {
				$('div.content').css('paddingTop', parseInt(heightDiff / 2, 10) + 'px');
			}
			this.deferred.resolve();
			return this;
		},
	});
})();
