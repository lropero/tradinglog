(function() {
	'use strict';

	app.Views.footer = Backbone.View.extend({
		el: 'footer',
		events: {
			'tap a': 'navigate'
		},

		initialize: function() {
			this.deferred = $.Deferred();
			this.template = Handlebars.compile(app.templateLoader.get('footer'));
			this.render();
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
			app.loadView(view, {}, function() {
				if($currentActive.data('view') !== view) {

					// Trigger/untrigger settings pane
					var $settings = $('section#settings');
					if(view === 'settings') {
						var animated = 'animated bounceInDown';
						$settings.addClass('show ' + animated).one('webkitAnimationEnd', function() {
							$settings.removeClass(animated);
							if(app.timeout) {
								clearTimeout(app.timeout);
							}
							app.timeout = setTimeout(function() {
								$('section#main-stats-friends').empty();
								delete app.timeout;
							}, 1000);
						});
					} else if($settings.hasClass('show')) {
						var animated = 'animated bounceOutUp';
						$settings.addClass(animated).one('webkitAnimationEnd', function() {
							$settings.removeClass('show ' + animated);
							if(app.timeout) {
								clearTimeout(app.timeout);
							}
							app.timeout = setTimeout(function() {
								$settings.empty();
								delete app.timeout;
							}, 1000);
						});
					}

				}
			});
		}
	});
})();
