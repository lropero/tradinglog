(function() {
	'use strict';

	app.Views.statsCustom = Backbone.View.extend({
		el: 'section#main-stats-friends section#content',

		initialize: function() {
			this.template = Handlebars.compile(app.templateLoader.get('stats-custom'));
			this.render();
		},

		render: function() {
			app.trigger('change', 'stats-custom');
			this.$el.html(this.template());
			setTimeout(function() {
				datePicker.show({
					date: new Date(),
					mode: 'date'
				}, function(date){
					alert('date result ' + date);
				});
			}, 1000);
			return this;
		}
	});
})();
