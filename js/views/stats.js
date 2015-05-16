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
			if(section === 'Numbers') {
				if($target.hasClass('active')) {
					return;
				}
				var monthly = true;
				var $active = this.$el.find('li.active');
				if($active.data('period') === 'custom') {
					if(app.previousCustom) {
						$('li#control-custom').html('Custom');
					}
					monthly = false;
				} else if($active.data('period') === 'weekly') {
					monthly = false;
				}
				$active.removeClass('active');
				$target.addClass('active');
				if(typeof this.subview.destroy === 'function') {
					this.subview.destroy();
				}
				this.subview = new app.Views.statsNumbers({
					at: app.stats.ats[$target.data('period')].toString(),
					monthly: monthly,
					radio: app.stats.ats.radio,
					slide: app.stats.ats.slide
				});
			} else {
				if($target.hasClass('active')) {
					if(app.previousCustom) {
						delete app.previousCustom;
						this.$el.find('li.active').removeClass('active');
						$target.addClass('active');
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
						var split = app.previousCustom.name.split('#');
						var groups = [];
						for(var i = 0; i < split[2].length; i++) {
							groups.push(parseInt(split[2][i], 10));
						}
						this.$el.find('li.active').removeClass('active');
						$target.addClass('active');
						$target.html('Reset');
						if(typeof this.subview.destroy === 'function') {
							this.subview.destroy();
						}
						this.subview = new app.Views.statsNumbers({
							name: app.previousCustom.name,
							groups: groups,
							radio: app.stats.ats.radio,
							slide: app.stats.ats.slide
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
