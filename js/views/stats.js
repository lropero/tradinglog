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
						at = app.previousCustom[$target.data('period')];
						var $custom = $('li#control-custom');
						$custom.removeAttr('style');
						$custom.html('Custom');
					}
				} else {
					var index = app.stats.availables[period][this.subview.at];
					switch(period) {
						case 'monthly':
							at = app.stats.toWeekly(index);
							break;
						case 'weekly':
							at = app.stats.toMonthly(index);
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
						$target.removeAttr('style');
						$target.html('Custom');
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
						$target.css('backgroundColor', '#9f8fe7');
						$target.html('Reset');
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
