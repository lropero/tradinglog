(function() {
	'use strict';

	app.Views.statsCustom = Backbone.View.extend({
		el: 'section#main-stats-friends section#content',
		events: {
			// 'tap input': 'showDatePicker',
			'tap ul.wrapper-select-group li': 'toggleGroup'
		},

		initialize: function() {
			this.template = Handlebars.compile(app.templateLoader.get('stats-custom'));
			this.render();
		},

		render: function() {
			app.trigger('change', 'stats-custom');
			this.$el.html(this.template());
			return this;
		},

		showDatePicker: function(e) {
			datePicker.show({
				date: new Date(),
				mode: 'date'
			}, function(date){
				alert('date result ' + date);
			});
		},

		toggleGroup: function(e) {
			e.preventDefault();
			var $target = $(e.currentTarget);
			if($target.hasClass('selected')) {
				if($('ul.wrapper-select-group li.selected').length > 1) {
					$target.removeClass('selected');
				}
			} else {
				$target.addClass('selected');
			}
		}
	});
})();
