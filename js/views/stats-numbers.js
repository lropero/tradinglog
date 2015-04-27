(function() {
	'use strict';

	app.Views.statsNumbers = Backbone.View.extend({
		el: 'section#main-stats-friends section#content',
		events: {
			'tap div.buttons-calendar span': 'movePeriod',
			'tap ul#type div:not(.active)': 'radio',
			'tap ul#type span': 'radio'
		},

		initialize: function() {
			var self = this;
			this.period = $('control.segmented li.active').data('period');
			// switch(this.period) {
			// 	case 'monthly':
			// 		var
			// 		break;
			// }
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
			var diameter = height * 70 / 100;
			var $center = $('div#center');
			$center.width(diameter);
			$center.height(diameter);
			$center.css('top', $doughnut.position().top + (height * 15 / 100) + 'px');
			$center.css('left', Math.max(0, (($(window).width() - $center.outerWidth()) / 2) + $(window).scrollLeft()) + 'px');

			var type = this.$el.find('ul.wrapper-radiobutton div.active').data('type');
			this.drawDoughnut(type);
			return this;
		},

		destroy: function() {
			this.undelegateEvents();
		},

		drawDoughnut: function(type) {
			var $doughnut = $('canvas#doughnut');
			var ctx = $doughnut.get(0).getContext('2d');
			var data = [
				{
					color: '#4bd763',
					label: 'Profit',
					value: app.stats[this.period][type].profit
				},
				{
					color:'#ff3b30',
					label: 'Loss',
					value: app.stats[this.period][type].loss
				},
				{
					color: '#fdb45c',
					label: 'Commission',
					value: app.stats[this.period][type].commission
				}
			];
			var options = {
				animationEasing: 'easeOutElastic',
				animationSteps: 50,
				segmentStrokeColor: '#4020d0',
				percentageInnerCutout: 70,
				segmentStrokeWidth: 5,
				legendTemplate : '<ul><% for(var i = 0; i < segments.length; i++) { %><li><div style="background-color: <%=segments[i].fillColor%>;">&nbsp;</div><span class="title"><%=segments[i].label%></span><br /><span class="money"><%=accounting.formatMoney(segments[i].value, \'$ \')%></span></li><% } %><li><div style="background-color: #9f8fe7;">&nbsp;</div><span class="title">Net</span><br /><span class="money"><%=accounting.formatMoney(1000, \'$ \')%></span></li></ul>'
			};
			var doughnut = new Chart(ctx).Doughnut(data, options);
			$('div#legend').html(doughnut.generateLegend());
		},

		movePeriod: function(e) {
			e.preventDefault();
			var $target = $(e.currentTarget);
		},

		radio: function(e) {
			e.preventDefault();
			var $target = $(e.currentTarget);
			var $radio = $target;
			if($target.is('span')) {
				$radio = $target.prev();
			}
			if(!$radio.hasClass('active')) {
				var $active = this.$el.find('ul.wrapper-radiobutton div.active');
				$active.removeClass('active');
				$radio.addClass('active');
				var type = $radio.data('type');
				this.drawDoughnut(type);
			}
		}
	});
})();
