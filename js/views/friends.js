(function() {
	'use strict';

	app.Views.friends = Backbone.View.extend({
		el: 'section#main-stats-friends',

		initialize: function() {

			if(typeof OAuth !== 'undefined') {
				OAuth.initialize('XGd3qcRd_gxD3WLkEV6987jkpfs');
			}

			this.template = Handlebars.compile(app.templateLoader.get('friends'));
			this.render();
		},

		render: function() {
			var self = this;
			app.trigger('change', 'friends');
			this.$el.html(this.template());

			if(typeof OAuth !== 'undefined') {
				OAuth.popup('twitter').done(function(result) {
					self.$el.html(result);
				});
			}

			return this;
		}
	});
})();
