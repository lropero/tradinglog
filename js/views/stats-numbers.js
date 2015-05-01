(function() {
	'use strict';

	app.Views.statsNumbers = Backbone.View.extend({
		el: 'section#main-stats-friends section#content',
		events: {
			'tap div.buttons-calendar span': 'moveDate',
			'tap div.help': 'showHelp',
			'tap ul#type div:not(.active)': 'radio',
			'tap ul#type span': 'radio'
		},

		initialize: function() {
			var self = this;
			this.at = 0;
			this.period = $('control.segmented li.active').data('period');
			app.templateLoader.get('stats-numbers').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},

		render: function() {
			app.trigger('change', 'stats-numbers');
			this.$el.html(this.template({
				date: app.date.getString(app.stats.availables[this.period][this.at])
			}));
			if(!app.stats.availables[this.period][this.at + 1]) {
				$('span.button-left').hide();
			}
			var deferred = this.stats();
			deferred.then(function() {
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

		drawLine: function(balances) {
			var labels = [];
			var data = []
			$.each(balances, function(index, value) {
				labels.push(index);
				data.push(value);
			});
			var $line = $('canvas#line');
			var ctx = $line.get(0).getContext('2d');
			var data = {
				labels: labels,
				datasets: [
					{
						data: data,
						fillColor: 'rgba(44, 22, 142, .5)',
						pointColor: '#fff',
						pointStrokeColor: '#fff',
						strokeColor: '#fff'
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
				scaleGridLineColor: 'rgba(44, 22, 142, .25)',
				scaleLineColor: '#2c168e',
				scaleShowGridLines: true,
				scaleShowVerticalLines: false,
				showTooltips: false
			};
			var line = new Chart(ctx).Line(data, options);
		},

		drawNumbers: function(stats) {
			$('span#numbers-trades').html(stats.trades);
			$('span#numbers-winners').html(stats.winners);
			$('span#numbers-losers').html(stats.losers);
			$('span#numbers-accuracy').html(accounting.toFixed(stats.accuracy, 2) + '%');
			$('span#numbers-average_trade').html(accounting.formatMoney(stats.averageTrade, '$ '));
			$('span#numbers-average_winning_trade').html(accounting.formatMoney(stats.averageWinningTrade, '$ '));
			$('span#numbers-average_losing_trade').html(accounting.formatMoney(stats.averageLosingTrade, '$ '));
			if(isNaN(stats.riskRewardRatio)) {
				$('span#numbers-risk_reward_ratio').html(stats.riskRewardRatio);
			} else {
				$('span#numbers-risk_reward_ratio').html(accounting.toFixed(stats.riskRewardRatio, 2));
			}
			$('span#numbers-average_time_in_market').html(app.date.getAverageTimeInMarketString(stats.averageTimeInMarket));
			if(isNaN(stats.sharpeRatio)) {
				$('span#numbers-sharpe_ratio').html(stats.sharpeRatio);
			} else {
				$('span#numbers-sharpe_ratio').html(accounting.toFixed(stats.sharpeRatio, 2));
			}
			$('span#line-variation').html(accounting.toFixed(stats.variation, 2) + '%');
		},

		moveDate: function(e) {
			e.preventDefault();
			var $target = $(e.currentTarget);
			var direction = $target.attr('class').replace('button-', '');
			switch(direction) {
				case 'left':
					if(app.stats.availables[this.period][this.at + 1]) {
						this.at++;
						$('div#date').html(app.date.getString(app.stats.availables[this.period][this.at]));
						$('span.button-right').show();
						if(!app.stats.availables[this.period][this.at + 1]) {
							$('span.button-left').hide();
						}
						this.stats();
					}
					break;
				case 'right':
					if(app.stats.availables[this.period][this.at - 1]) {
						this.at--;
						$('div#date').html(app.date.getString(app.stats.availables[this.period][this.at]));
						$('span.button-left').show();
						if(!app.stats.availables[this.period][this.at - 1]) {
							$('span.button-right').hide();
						}
						this.stats();
					}
					break;
			}
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
				this.stats();
			}
		},

		showHelp: function(e) {
			e.preventDefault();
			var $amounts = $('div.legend#legend-amounts');
			var $help = $('div.help');
			var $titles = $('div.legend#legend-titles');
			$amounts.hide();
			$help.hide();
			$titles.show();
			setTimeout(function() {
				$titles.fadeOut(250, function() {
					$amounts.fadeIn(250);
					$help.show();
					var animated = 'animated bounceIn';
					$help.addClass(animated).one('webkitAnimationEnd', function() {
						$help.removeClass(animated);
					});
				});
			}, 1000);
		},

		stats: function() {
			var self = this;
			var type = this.$el.find('ul.wrapper-radiobutton div.active').data('type');
			var deferred = app.stats.get(app.stats.availables[this.period][this.at]);
			deferred.done(function(stats) {
				if(stats[type].trades) {
					self.drawDoughnut(stats[type]);
					self.drawNumbers(stats[type]);
					self.drawLine(stats[type].balances);
				}
			});
			return deferred;
		}
	});
})();
