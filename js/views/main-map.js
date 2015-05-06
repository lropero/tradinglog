(function() {
	'use strict';

	app.Views.mainMap = Backbone.View.extend({
		el: 'section#main-stats-friends',

		initialize: function(cache) {
			var self = this;
			this.trades = [];
			this.fetchTrades()
			this.template = app.templateLoader.get('main-map');
			this.template = Handlebars.compile(this.template);
			this.render(cache);
		},

		render: function(cache) {
			var template = app.cache.get('mainMap', this.template, {
				trades: this.trades,
				max: this.max
			});
			if(typeof cache !== 'boolean') {
				app.trigger('change', 'main-map');
				this.$el.html(template);
				$('section#main-stats-friends').addClass('map');
				this.decorate();
			}
			//return this;
		},

		destroy: function() {
			$('section#main-stats-friends').removeClass('map');
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
