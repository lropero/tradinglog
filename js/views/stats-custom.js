(function() {
	'use strict';

	app.Views.statsCustom = Backbone.View.extend({
		el: 'section#main-stats-friends section#content',
		events: {
			'tap div#done': 'combine',
			'tap input': 'isolate',
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

		destroy: function() {
			this.undelegateEvents();
		},

		combine: function(e) {
			e.preventDefault();
			app.combine();
		},

		isolate: function(e) {
			e.preventDefault();
			app.isolate(e, this.showDatePicker);
		},

		showDatePicker: function($target) {
			function value(date) {
				var month = date.getMonth() + 1;
				if(month < 10) {
					month = '0' + month;
				}
				var day = date.getDate();
				if(day < 10) {
					day = '0' + day;
				}
				$target.val(date.getFullYear() + '-' + month + '-' + day);
			}
			var date = new Date();
			var maxDate = date;
			var minDate = '';
			var id = $target.attr('id');
			switch(id) {
				case 'form-from':
					var from = $('#form-from').val();
					if(from) {
						var dateValues = from.split('-');
						date = new Date(dateValues[0], parseInt(dateValues[1], 10) - 1, dateValues[2], 0, 0, 0, 0);
					}
					var to = $('#form-to').val();
					if(to) {
						var dateValues = to.split('-');
						maxDate = new Date(dateValues[0], parseInt(dateValues[1], 10) - 1, dateValues[2], 0, 0, 0, 0);
					}
					break;
				case 'form-to':
					var from = $('#form-from').val();
					if(from) {
						var dateValues = from.split('-');
						date = new Date(dateValues[0], parseInt(dateValues[1], 10) - 1, dateValues[2], 0, 0, 0, 0);
						minDate = date;
					}
					var to = $('#form-to').val();
					if(to) {
						var dateValues = to.split('-');
						date = new Date(dateValues[0], parseInt(dateValues[1], 10) - 1, dateValues[2], 0, 0, 0, 0);
					}
					break;
			}
			$('footer').html(minDate);
			datePicker.show({
				date: date,
				maxDate: maxDate,
				minDate: minDate,
				mode: 'date'
			}, value);
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
