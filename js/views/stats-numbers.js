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
			this.drawLine(type);
			var $swipePanes = $('ul.swipe-panes');
			$swipePanes.slick({
				accessibility: false,
				arrows: false,
				infinite: false
			});
			$swipePanes.on('beforeChange', function(e, slick, currentSlide, nextSlide) {
				var $control = $('ul.control-box-swipe');
				$control.find('li.active').removeClass('active');
				$('li#swipe-control-' + (nextSlide + 1)).addClass('active');
				switch(nextSlide) {
					case 0:
						$control.addClass('end-left');
						$control.removeClass('end-right');
						break;
					case 1:
						$control.removeClass('end-left');
						$control.removeClass('end-right');
						break;
					case 2:
						$control.removeClass('end-left');
						$control.addClass('end-right');
						break;
				}
			});
			return this;
		},

		destroy: function() {
			$('ul.swipe-panes').off();
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
				legendTemplate : '<ul class="graphic"><% for(var i = 0; i < segments.length; i++) { %><li class="<%=segments[i].label.charAt(0).toLowerCase() + segments[i].label.slice(1)%>"><span><%=accounting.formatMoney(segments[i].value, \'$ \')%></span></li><% } %><li class="net"><span><%=accounting.formatMoney(' + app.stats[this.period][type].net + ', \'$ \')%></span></li></ul>',
				percentageInnerCutout: 60,
				segmentStrokeColor: '#4020d0',
				segmentStrokeWidth: 5,
				showTooltips: false
			};
			var doughnut = new Chart(ctx).Doughnut(data, options);
			$('div.legend#legend-amounts').html(doughnut.generateLegend());
		},

		drawLine: function(type) {
			// Remove
			var balance = app.account.get('balance');
			var pepe = [];
			for(var i = 0; i < 22; i++) {
				var temp = Math.random() * 500;
				if(Math.floor(Math.random() * 2) === 1) {
					temp = temp * -1;
				}
				balance += temp;
				pepe.push(balance);
			}

			var $line = $('canvas#line');
			var ctx = $line.get(0).getContext('2d');
			var data = {
				labels: ['1', '2', '3', '6', '7', '8', '9', '10', '13', '14', '15', '16', '17', '20', '21', '22', '23', '24', '27', '28', '29', '30'],
				datasets: [
					{
						label: 'My First dataset',
						fillColor: '#2c168e',
						strokeColor: '#fff',
						pointColor: '#fff',
						pointStrokeColor: '#fff',
						data: pepe
					}
				]
			};
			var options = {
				animationEasing: 'easeOutElastic',
				animationSteps: 50,
				bezierCurve: false,
				datasetStrokeWidth: 1,
				pointDotRadius: 2,
				scaleFontColor: '#2c168e',
				scaleLineColor: '#2c168e',
				scaleShowGridLines: false,
				showTooltips: false
			};
			var line = new Chart(ctx).Line(data, options);
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
				this.$el.find('ul.wrapper-radiobutton div.active').removeClass('active');
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
