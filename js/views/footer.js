(function() {
	'use strict';

	app.Views.footer = Backbone.View.extend({
		el: 'footer',
		events: {
			'tap a': 'navigate'
		},

		initialize: function() {
			var self = this;
			this.deferred = $.Deferred();
			app.templateLoader.get('footer').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},

		render: function() {
			this.$el.html(this.template());
			this.deferred.resolve();
			return this;
		},

		navigate: function(e) {
			e.preventDefault();
			var $target = $(e.currentTarget);
			var $currentActive = this.$el.find('a.active');
			$currentActive.removeClass('active');
			$target.addClass('active');
			var view = $target.data('view');
			app.loadView(view);

			if($currentActive.data('view') !== view) {
				// Trigger/untrigger settings pane
				var $settings = $('section#settings');
				if(view === 'settings') {
					var animated = 'animated bounceInDown';
					$settings.addClass('show ' + animated).one('webkitAnimationEnd', function() {
						$settings.removeClass(animated);
						$('section#main-stats-friends').empty();
					});
				} else if($settings.hasClass('show')) {
					var animated = 'animated bounceOutUp';
					$settings.addClass(animated).one('webkitAnimationEnd', function() {
						$settings.removeClass('show ' + animated);
						$settings.empty();
					});
				}
			}
		}
	});
})();
