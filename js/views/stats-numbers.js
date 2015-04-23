(function() {
	'use strict';

	app.Views.statsNumbers = Backbone.View.extend({
		el: 'section#main-stats-friends section#content',

		initialize: function() {
			var self = this;
			this.period = $('control.segmented li.active').data('period');
			app.templateLoader.get('stats-numbers').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},

		render: function() {
			app.trigger('change', 'stats-numbers');
			this.$el.html(this.template());

			var $doughnut = $('canvas#doughnut');
			var width = $doughnut.width();
			var height = $doughnut.height();
			if(width > height) {
				$doughnut.width(height);
			}
			var diameter = height * 40 / 100;
			var $center = $('div#center');
			$center.width(diameter);
			$center.height(diameter);
			$center.css('top', $doughnut.position().top + (height * 30 / 100) + 'px');
			$center.css('left', Math.max(0, (($(window).width() - $center.outerWidth()) / 2) + $(window).scrollLeft()) + 'px');

			var ctx = $doughnut.get(0).getContext('2d');
			var data = [
				{
					color: '#4bd763',
					label: 'Profit',
					value: app.stats[this.period].profit
				},
				{
					color:'#ff3b30',
					label: 'Loss',
					value: app.stats[this.period].loss
				},
				{
					color: '#fdb45c',
					label: 'Commission',
					value: app.stats[this.period].commission
				}
			];
			var options = {
				animationEasing: 'easeOutElastic',
				animationSteps: 50,
				segmentStrokeColor: '#4020d0',
				percentageInnerCutout: 60,
				segmentStrokeWidth: 5,
				legendTemplate : '<ul><% for(var i = 0; i < segments.length; i++) { %><li><div style="background-color: <%=segments[i].fillColor%>;">&nbsp;</div><span class="title"><%=segments[i].label%></span><br /><span class="money"><%=accounting.formatMoney(segments[i].value, \'$ \')%></span></li><% } %></ul>'
			};
			var doughnut = new Chart(ctx).Doughnut(data, options);
			// $('div#legend').html(doughnut.generateLegend());
			return this;
		}
	});
})();
