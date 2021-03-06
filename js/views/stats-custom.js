(function() {
	'use strict';

	app.Views.statsCustom = Backbone.View.extend({
		el: 'section#main-stats-friends section#content',
		events: {
			'tap div#done': 'combine',
			'tap div#generate': 'submit',
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
			if(!app.dates.firstDate) {
				$('div#no-stats').css('display', 'block');
			}
			return this;
		},

		destroy: function() {
			this.undelegateEvents();
		},

		combine: function(e) {
			e.preventDefault();
			app.combine(true);
			return false;
		},

		isolate: function(e) {
			e.preventDefault();
			app.isolate(e, this.showDatePicker);
			return false;
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
			var date = new Date(app.dates.lastDate);
			date.setMonth(0);
			date.setDate(1);
			var minDate = new Date(app.dates.firstDate);
			if(date < minDate) {
				date = minDate;
			}
			var maxDate = new Date(app.dates.lastDate);
			var id = $target.attr('id');
			switch(id) {
				case 'from':
					var from = $('#from').val();
					if(from) {
						var dateValues = from.split('-');
						date = new Date(dateValues[0], parseInt(dateValues[1], 10) - 1, dateValues[2], 0, 0, 0, 0);
					}
					var to = $('#to').val();
					if(to) {
						var dateValues = to.split('-');
						maxDate = new Date(dateValues[0], parseInt(dateValues[1], 10) - 1, dateValues[2], 0, 0, 0, 0);
					}
					break;
				case 'to':
					var from = $('#from').val();
					if(from) {
						var dateValues = from.split('-');
						minDate = new Date(dateValues[0], parseInt(dateValues[1], 10) - 1, dateValues[2], 0, 0, 0, 0);
					}
					var to = $('#to').val();
					if(to) {
						var dateValues = to.split('-');
						date = new Date(dateValues[0], parseInt(dateValues[1], 10) - 1, dateValues[2], 0, 0, 0, 0);
					} else {
						date = maxDate;
					}
					break;
			}
			if(typeof datePicker !== 'undefined') {
				datePicker.show({
					date: date,
					minDate: minDate,
					maxDate: maxDate,
					mode: 'date'
				}, value);
			}
		},

		submit: function(e) {
			e.preventDefault();
			var from = this.$el.find('input#from').val();
			var to = this.$el.find('input#to').val();

			var custom = new app.Models.custom({
				from: from,
				to: to
			});
			custom.validate();
			if(custom.isValid()) {
				$('div#generate').hide();
				var groups = [];
				var str = '';
				$('ul.wrapper-select-group').find('li').each(function(index, value) {
					var $li = $(value);
					if($li.hasClass('selected')) {
						groups.push(index);
						str += index;
					}
				});
				var fromDateValues = from.split('-');
				var toDateValues = to.split('-');
				var month = parseInt(fromDateValues[1], 10) - 1;
				var day = parseInt(fromDateValues[2], 10);
				var name = fromDateValues[0] + '-' + month + '-' + day + '#';
				month = parseInt(toDateValues[1], 10) - 1;
				day = parseInt(toDateValues[2], 10);
				name += toDateValues[0] + '-' + month + '-' + day + '#' + str;
				app.previousCustom = name;
				this.destroy();
				app.view.subview = new app.Views.statsNumbers({
					name: name,
					groups: groups,
					radio: app.stats.ats.radio,
					slide: app.stats.ats.slide
				});
				$('li#control-custom').html('Reset');
			}
			return false;
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
			return false;
		}
	});
})();
