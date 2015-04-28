(function() {
	'use strict';

	app.Views.statsNumbers = Backbone.View.extend({
		el: 'section#main-stats-friends section#content',
		events: {
			'tap div.buttons-calendar span': 'movePeriod',
			'tap div.help': 'toggleHelp',
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
				percentageInnerCutout: 60,
				segmentStrokeWidth: 5,
				legendTemplate : '<ul class="graphic"><% for(var i = 0; i < segments.length; i++) { %><li class="<%=segments[i].label.charAt(0).toLowerCase() + segments[i].label.slice(1)%>"><span><%=accounting.formatMoney(segments[i].value, \'$ \')%></span></li><% } %><li class="net"><span><%=accounting.formatMoney(' + app.stats[this.period][type].net + ', \'$ \')%></span></li></ul>'
			};
			var doughnut = new Chart(ctx).Doughnut(data, options);
			$('div.legend#legend-amounts').html(doughnut.generateLegend());
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
		},

		toggleHelp: function(e) {
			e.preventDefault();
			var $amounts = $('div.legend#legend-amounts');
			var $titles = $('div.legend#legend-titles');
			if($amounts.is(':visible')) {
				$amounts.hide();
				$titles.show();
			} else {
				$amounts.show();
				$titles.hide();
			}
		}
	});
})();
