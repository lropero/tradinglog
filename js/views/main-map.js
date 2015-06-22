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
					self.animate();
					self.decorate();
				}
			});
			return this;
		},

		destroy: function() {
			$('section#main-stats-friends').removeClass('map');
			if(this.drag) {
				this.drag.destroy();
			}
		},

		animate: function() {
			var self = this;
			var animated = 'animated fadeInLeft';
			var current = 0;
			var height = $('section#content').height();
			$.each($('div.percentage'), function(index, value) {
				if(current < height) {
					$(this).addClass(animated).one('webkitAnimationEnd', function() {
						$(this).removeClass(animated);
					});
					current += 30;
				} else {
					return false;
				}
			});
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
