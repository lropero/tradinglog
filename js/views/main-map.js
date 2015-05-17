(function() {
	'use strict';

	app.Views.mainMap = Backbone.View.extend({
		el: 'section#main-stats-friends',

		initialize: function(cache) {
			this.trades = [];
			this.fetchTrades()
			this.template = Handlebars.compile(app.templateLoader.get('main-map'));
			this.render(cache);
		},

		render: function(cache) {
			var html = app.cache.get('mainMap', this.template, {
				trades: this.trades,
				max: this.max
			});
			if(typeof cache !== 'boolean') {
				app.trigger('change', 'main-map');
				this.$el.html(html);
				$('section#main-stats-friends').addClass('map');
				this.decorate();
				this.animate();
			}
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
		},

		fetchTrades: function() {
			for(var i = app.count.open; i < app.objects.length; i++) {
				if(app.objects[i].instrument_id) {
					var abs = Math.abs(app.objects[i].net);
					if(!this.max || abs > this.max) {
						this.max = abs;
					}
					this.trades.push(app.objects[i]);
				}
			}
			if(this.max === 0) {
				this.max = 1;
			}
		}
	});
})();
