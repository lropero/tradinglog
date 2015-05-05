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

		initialize: function(at, radio, slide) {
			var self = this;
			this.at = parseInt(at, 10);
			this.period = $('control.segmented li.active').data('period');
			app.templateLoader.get('stats-numbers').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render(radio, slide);
			});
		},

		render: function(radio, slide) {
			app.trigger('change', 'stats-numbers');
			this.$el.html(this.template({
				date: app.date.getString(app.stats.availables[this.period][this.at])
			}));
			if(!app.stats.availables[this.period][this.at + 1]) {
				$('span.button-left').hide();
			}
			$('div#radio-' + radio).addClass('active');
			var $swipePanes = $('ul.swipe-panes');
			$swipePanes.slick({
				accessibility: false,
				arrows: false,
				infinite: false,
				initialSlide: slide - 1
			});
			$swipePanes.on('beforeChange', function(e, slick, currentSlide, nextSlide) {
				var $control = $('ul.control-box-swipe');
				$control.find('li.active').removeClass('active');
				$('li#swipe-control-' + (nextSlide + 1)).addClass('active');
			});
			var $control = $('ul.control-box-swipe');
			$control.find('li.active').removeClass('active');
			$('li#swipe-control-' + slide).addClass('active');
			this.stats();
			return this;
		},

		destroy: function() {
			$('ul.swipe-panes').off();
			this.undelegateEvents();
		},

		drawDoughnut: function(stats) {
			if(this.doughnut) {
				this.doughnut.stop().destroy();
			}
			var $doughnut = $('canvas#doughnut');
            var width = $doughnut.width();
            var height = $doughnut.height();
            if(width > height) {
                $doughnut.width(height);
            }
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
			this.doughnut = new Chart(ctx).Doughnut(data, options);
			$('div.legend#legend-amounts').html(this.doughnut.generateLegend());
		},

		drawLine: function(balances) {
			if(this.line) {
				this.line.stop().destroy();
			}
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
			this.line = new Chart(ctx).Line(data, options);
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
			$('span.highlight').css('color', '#fff');
			if(stats.net > 0) {
				$('span.highlight').css('color', '#4bd763');
			} else if(stats.net < 0) {
				$('span.highlight').css('color', '#ff3b30');
			}
		},

		moveDate: function(e) {
			e.preventDefault();
			$('span.button-left').hide();
			$('span.button-right').hide();
			var $target = $(e.currentTarget);
			var direction = $target.attr('class').replace('button-', '');
			switch(direction) {
				case 'left':
					if(app.stats.availables[this.period][this.at + 1]) {
						this.at++;
						$('div#date').html(app.date.getString(app.stats.availables[this.period][this.at]));
						this.stats();
					}
					break;
				case 'right':
					if(app.stats.availables[this.period][this.at - 1]) {
						this.at--;
						$('div#date').html(app.date.getString(app.stats.availables[this.period][this.at]));
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
					$('div#no-stats').css('display', 'none');
					$('div.wrapper-control-box-swipe').css('display', 'block');
					self.drawDoughnut(stats[type]);
					self.drawNumbers(stats[type]);
					self.drawLine(stats[type].balances);
				} else {
					$('div#no-stats').css('display', 'block');
					$('div.wrapper-control-box-swipe').css('display', 'none');
				}
				var index = app.stats.availables[self.period][self.at + 1];
				if(index) {
					$('span.button-left').show();
					if(!app.stats.data[index]) {
						app.stats.get(index);
					}
					index = app.stats.availables[self.period][self.at + 2];
					if(index && !app.stats.data[index]) {
						app.stats.get(index);
					}
				}
				index = app.stats.availables[self.period][self.at - 1];
				if(index) {
					$('span.button-right').show();
					if(!app.stats.data[index]) {
						app.stats.get(index);
					}
					index = app.stats.availables[self.period][self.at - 2];
					if(index && !app.stats.data[index]) {
						app.stats.get(index);
					}
				}
				index = app.stats.availables[self.period][self.at];
				switch(self.period) {
					case 'monthly':
						for(var i = app.stats.availables.weekly.length; i > 0; i--) {
							var dateValues = app.stats.availables.weekly[i - 1].split('-');
							if(dateValues[0] + '-' + dateValues[1] === index) {
								if(!app.stats.data[app.stats.availables.weekly[i - 1]]) {
									app.stats.get(app.stats.availables.weekly[i - 1]);
								}
								break;
							}
						}
						break;
					case 'weekly':
						var dateValues = index.split('-');
						for(var i = app.stats.availables.monthly.length; i > 0; i--) {
							if(dateValues[0] + '-' + dateValues[1] === app.stats.availables.monthly[i - 1]) {
								if(!app.stats.data[app.stats.availables.monthly[i - 1]]) {
									app.stats.get(app.stats.availables.monthly[i - 1]);
								}
								break;
							}
						}
						break;
				}
			});
			return deferred;
		}
	});
})();
