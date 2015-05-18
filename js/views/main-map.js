(function() {
	'use strict';

	app.Views.mainMap = Backbone.View.extend({
		el: 'section#main-stats-friends',

		initialize: function(cache) {
			this.trades = [];
			this.template = Handlebars.compile(app.templateLoader.get('main-map'));
			this.render(cache);
		},

		render: function(cache) {
			var self = this;
			var deferred = app.cache.get('mainMap', this.template);
			deferred.then(function(html) {
				if(typeof cache !== 'boolean') {
					app.trigger('change', 'main-map');
					self.$el.html(html);
					$('section#main-stats-friends').addClass('map');
					self.decorate();
					self.animate();
				}
			});
			return this;
		},

		destroy: function() {
			$('section#main-stats-friends').removeClass('map');
		},

		animate: function() {
			var $percentage = $('div.percentage');
			var animated = 'animated fadeInLeft';
			$percentage.addClass(animated).one('webkitAnimationEnd', function() {
				$percentage.removeClass(animated);
			});
			$('div.ball').addClass('animate');
		},

		decorate: function() {
			this.drag = new app.Views.mainDrag();
			var $content = $('section#content');
			var $ul = $content.children('ul');
			if($content.height() > $ul.height()) {
				$ul.append('<li style="background: #ffffff; height: ' + ($content.height() - $ul.height() + 5) + 'px; width: 100%;"></li>');
				setTimeout(function() {
					app.enableScroll();
				}, 10);
			} else {
				app.enableScroll();
			}
		}
	});
})();
