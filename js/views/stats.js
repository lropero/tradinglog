(function() {
	'use strict';

	app.Views.stats = Backbone.View.extend({
		el: 'section#main-stats-friends',
		events: {
			'tap control.segmented li': 'switch'
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

		convertMonthly: function(at, index) {
			for(var i = app.stats.availables.weekly.length; i > 0; i--) {
				var dateValues = app.stats.availables.weekly[i - 1].split('-');
				if(dateValues[0] + '-' + dateValues[1] === index) {
					at = i - 1;
					return at;
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
					return at;
				}
			}
		},

		convertWeekly: function(at, index) {
			var dateValues = index.split('-');
			var date = new Date(dateValues[0], dateValues[1], dateValues[2], 0, 0, 0, 0);
			date.setDate(date.getDate() + 6);
			for(var i = app.stats.availables.monthly.length; i > 0; i--) {
				if(date.getFullYear() + '-' + date.getMonth() === app.stats.availables.monthly[i - 1]) {
					at = i - 1;
					return at;
				}
			}
		},

		switch: function(e) {
			e.preventDefault();
			var $target = $(e.currentTarget);
			var section = $target.data('section');
			var at = 0;
			var radio = 1;
			var slide = 1;
			if(section === 'Numbers') {
				if($target.hasClass('active')) {
					return;
				}
				var period = $('control.segmented li.active').data('period');
				if(period === 'custom') {
					if(app.previousCustom) {
						switch($target.data('period')) {
							case 'monthly':
								if(app.previousCustom.monthly) {
									at = app.previousCustom.monthly;
								} else if(app.previousCustom.weekly) {
									var index = app.stats.availables.weekly[app.previousCustom.weekly];
									at = this.convertWeekly(app.previousCustom.weekly, index);
								}
								break;
							case 'weekly':
								if(app.previousCustom.weekly) {
									at = app.previousCustom.weekly;
								} else if(app.previousCustom.monthly) {
									var index = app.stats.availables.monthly[app.previousCustom.monthly];
									at = this.convertMonthly(app.previousCustom.monthly, index);
								}
								break;
						}
					}
				} else {
					var index = app.stats.availables[period][this.subview.at];
					done:
					switch(period) {
						case 'monthly':
							at = this.convertMonthly(at, index);
							break;
						case 'weekly':
							at = this.convertWeekly(at, index);
							break;
					}
				}
				var $control = $('ul.control-box-swipe');
				if($control.length) {
					radio = this.$el.find('ul.wrapper-radiobutton div.active').attr('id').replace('radio-', '');
					slide = $control.find('li.active').attr('id').replace('swipe-control-', '');
				}
				this.$el.find('li.active').removeClass('active');
				$target.addClass('active');
				if(typeof this.subview.destroy === 'function') {
					this.subview.destroy();
				}
				this.subview = new app.Views.statsNumbers({
					at: at.toString(),
					radio: radio,
					slide: slide
				});
			} else {
				if($target.hasClass('active')) {
					if(app.previousCustom) {
						delete app.previousCustom;
						this.$el.find('li.active').removeClass('active');
						$target.addClass('active');
						if(typeof this.subview.destroy === 'function') {
							this.subview.destroy();
						}
						this.subview = new app.Views.statsCustom();
					} else {
						return;
					}
				} else {
					if(app.previousCustom) {
						var split = app.previousCustom.index.split('#');
						var groups = [];
						for(var i = 0; i < split[2].length; i++) {
							groups.push(parseInt(split[2][i], 10));
						}
						var $control = $('ul.control-box-swipe');
						if($control.length) {
							radio = this.$el.find('ul.wrapper-radiobutton div.active').attr('id').replace('radio-', '');
							slide = $control.find('li.active').attr('id').replace('swipe-control-', '');
						}
						this.$el.find('li.active').removeClass('active');
						$target.addClass('active');
						if(typeof this.subview.destroy === 'function') {
							this.subview.destroy();
						}
						this.subview = new app.Views.statsNumbers({
							index: app.previousCustom.index,
							groups: groups,
							radio: radio,
							slide: slide
						});
					} else {
						this.$el.find('li.active').removeClass('active');
						$target.addClass('active');
						if(typeof this.subview.destroy === 'function') {
							this.subview.destroy();
						}
						this.subview = new app.Views.statsCustom();
					}
				}
			}
		}
	});
})();
