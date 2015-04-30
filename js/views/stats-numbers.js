(function() {
	'use strict';

	app.Views.statsNumbers = Backbone.View.extend({
		el: 'section#main-stats-friends section#content',
		events: {
			'tap div.buttons-calendar span': 'moveDate',
			'tap div.help': 'toggleHelp',
			'tap ul#type div:not(.active)': 'radio',
			'tap ul#type span': 'radio'
		},

		initialize: function() {
			var self = this;
			this.period = $('control.segmented li.active').data('period');
			this.date = new Date();
			switch(this.period) {
				case 'monthly':
					this.date.setDate(1);
					break;
				case 'weekly':
					this.date.setDate(this.date.getDate() - this.date.getDay());
					break;
			}
			this.date.setHours(0, 0, 0, 0);
			app.templateLoader.get('stats-numbers').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},

		render: function() {
			app.trigger('change', 'stats-numbers');
			this.$el.html(this.template({
				date: app.date.getString(this.period, this.date)
			}));

			this.type = this.$el.find('ul.wrapper-radiobutton div.active').data('type');
			this.stats(this.period, this.date, this.type);
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
			});

			return this;
		},

		destroy: function() {
			$('ul.swipe-panes').off();
			this.undelegateEvents();
		},

		drawDoughnut: function(stats) {
			var $doughnut = $('canvas#doughnut');
			var ctx = $doughnut.get(0).getContext('2d');
			var data = [
				{
					color: '#4bd763',
					label: 'Profit',
					value: stats.profit
				},
				{
					color:'#ff3b30',
					label: 'Loss',
					value: stats.loss
				},
				{
					color: '#fdb45c',
					label: 'Commission',
					value: stats.commission
				}
			];
			var options = {
				animationEasing: 'easeOutElastic',
				animationSteps: 50,
				legendTemplate : '<ul class="graphic"><% for(var i = 0; i < segments.length; i++) { %><li class="<%=segments[i].label.charAt(0).toLowerCase() + segments[i].label.slice(1)%>"><span><%=accounting.formatMoney(segments[i].value, \'$ \')%></span></li><% } %><li class="net"><span><%=accounting.formatMoney(' + stats.net + ', \'$ \')%></span></li></ul>',
				percentageInnerCutout: 60,
				segmentStrokeColor: '#4020d0',
				segmentStrokeWidth: 5,
				showTooltips: false
			};
			var doughnut = new Chart(ctx).Doughnut(data, options);
			$('div.legend#legend-amounts').html(doughnut.generateLegend());
		},

		drawLine: function(stats) {
			var labels = [];
			var data = []
			$.each(stats, function(index, value) {
				labels.push(index);
				data.push(value);
			});
			var $line = $('canvas#line');
			var ctx = $line.get(0).getContext('2d');
			var data = {
				labels: labels,
				datasets: [
					{
						label: 'My First dataset',
						fillColor: '#2c168e',
						strokeColor: '#fff',
						pointColor: '#fff',
						pointStrokeColor: '#fff',
						data: data
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

		drawNumbers: function(stats) {
			$('span#numbers-trades').html(stats.trades);
			$('span#numbers-winners').html(stats.winners);
			$('span#numbers-losers').html(stats.losers);
			$('span#numbers-accuracy').html(accounting.toFixed(stats.accuracy, 2) + '%');
			$('span#numbers-average_time_in_market').html(stats.averageTimeInMarket);
			$('span#numbers-average_trade').html(stats.averageTrade);
			$('span#numbers-average_winning_trade').html(stats.averageWinningTrade);
			$('span#numbers-average_losing_trade').html(stats.averageLosingTrade);
			$('span#numbers-risk_reward_ratio').html(stats.riskRewardRatio);
			$('span#numbers-sharpe_ratio').html(stats.sharpeRatio);
			$('span#line-variation').html(stats.variation);
		},

		moveDate: function(e) {
			e.preventDefault();
			var $target = $(e.currentTarget);
			var direction = $target.attr('class').replace('button-', '');
			switch(this.period) {
				case 'monthly':
					switch(direction) {
						case 'left':
							this.date.setMonth(this.date.getMonth() - 1);
							$('span.button-right').show();
							break;
						case 'right':
							this.date.setMonth(this.date.getMonth() + 2);
							var today = new Date();
							if(today.getTime() < this.date.getTime()) {
								$('span.button-right').hide();
							}
							this.date.setMonth(this.date.getMonth() - 1);
							break;
					}
					break;
				case 'weekly':
					switch(direction) {
						case 'left':
							this.date.setDate(this.date.getDate() - 7);
							$('span.button-right').show();
							break;
						case 'right':
							this.date.setDate(this.date.getDate() + 14);
							var today = new Date();
							if(today.getTime() < this.date.getTime()) {
								$('span.button-right').hide();
							}
							this.date.setDate(this.date.getDate() - 7);
							break;
					}
					break;
			}
			$('div#date').html(app.date.getString(this.period, this.date));
			this.stats(this.period, this.date, this.type);
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
				this.type = $radio.data('type');
				this.stats(this.period, this.date, this.type);
			}
		},

		stats: function(period, date, type) {
			var self = this;
			var index;
			switch(period) {
				case 'monthly':
					index = date.getFullYear() + '-' + date.getMonth();
					break;
				case 'weekly':
					index = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
					break;
			}
			var deferred = app.stats.get(index);
			deferred.done(function(stats) {
				self.drawDoughnut(stats[type]);
				self.drawNumbers(stats[type]);
				self.drawLine(stats.balances);
			});
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
