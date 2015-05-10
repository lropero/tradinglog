(function() {
	'use strict';

	app.Views.stats = Backbone.View.extend({
		el: 'section#main-stats-friends',
		events: {
			'tap control.segmented li:not(.active)': 'switch'
		},

		initialize: function() {
			this.template = Handlebars.compile(app.templateLoader.get('stats'));
			this.render();
		},

		destroy: function() {
			if(typeof this.subview.destroy === 'function') {
				this.subview.destroy();
			}
			this.undelegateEvents();
		},

		render: function() {
			app.trigger('change', 'stats');
			this.$el.html(this.template());
			this.subview = new app.Views.statsNumbers({
				at: '0',
				radio: 1,
				slide: 1
			});
			return this;
		},

		switch: function(e) {
			e.preventDefault();
			var $target = $(e.currentTarget);
			var section = $target.data('section');
			var at = 0;
			var radio = 1;
			var slide = 1;
			if(section === 'Numbers') {
				var period = $('control.segmented li.active').data('period');
				if(period !== 'custom') {
					var index = app.stats.availables[period][this.subview.at];
					done:
					switch(period) {
						case 'monthly':
							for(var i = app.stats.availables.weekly.length; i > 0; i--) {
								var dateValues = app.stats.availables.weekly[i - 1].split('-');
								if(dateValues[0] + '-' + dateValues[1] === index) {
									at = i - 1;
									break done;
								}
							}
							var dateValues = index.split('-');
							if(dateValues[1] === '0') {
								index = (dateValues[0] - 1) + '-11';
							} else {
								index = dateValues[0] + '-' + (dateValues[1] - 1);
							}
							for(var i = 0; i < app.stats.availables.weekly.length; i++) {
								var dateValues = app.stats.availables.weekly[i].split('-');
								if(dateValues[0] + '-' + dateValues[1] === index) {
									at = i;
									break done;
								}
							}
							break;
						case 'weekly':
							var dateValues = index.split('-');
							var date = new Date(dateValues[0], dateValues[1], dateValues[2], 0, 0, 0, 0);
							date.setDate(date.getDate() + 6);
							for(var i = app.stats.availables.monthly.length; i > 0; i--) {
								if(date.getFullYear() + '-' + date.getMonth() === app.stats.availables.monthly[i - 1]) {
									at = i - 1;
									break done;
								}
							}
							break;
					}
				}
				var $control = $('ul.control-box-swipe');
				if($control.length) {
					radio = this.$el.find('ul.wrapper-radiobutton div.active').attr('id').replace('radio-', '');
					slide = $control.find('li.active').attr('id').replace('swipe-control-', '');
				}
			}
			this.$el.find('li.active').removeClass('active');
			$target.addClass('active');
			if(typeof this.subview.destroy === 'function') {
				this.subview.destroy();
			}
			this.subview = new app.Views['stats' + section]({
				at: at.toString(),
				radio: radio,
				slide: slide
			});
		}
	});
})();
