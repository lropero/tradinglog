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

		initialize: function(attrs) {
			if(attrs.index) {
				this.index = attrs.index;
				this.groups = attrs.groups;
				this.stats = attrs.stats;
				var radio = 1;
				var slide = 1;
			} else {
				this.at = parseInt(attrs.at, 10);
				this.period = $('control.segmented li.active').data('period');
				var radio = attrs.radio;
				var slide = attrs.slide;
			}
			this.template = Handlebars.compile(app.templateLoader.get('stats-numbers'));
			this.render(radio, slide);
		},

		render: function(radio, slide) {
			app.trigger('change', 'stats-numbers');
			if(this.index) {
				this.$el.html(this.template({
					date: app.date.getString(this.index),
					groups: this.groups
				}));
				$('span.button-left').hide();
				$('span.button-right').hide();
			} else {
				this.$el.html(this.template({
					date: app.date.getString(app.stats.availables[this.period][this.at])
				}));
				if(!app.stats.availables[this.period][this.at + 1]) {
					$('span.button-left').hide();
				}
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
			this.drawStats();
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
				animationSteps: 38,
				legendTemplate : '<ul class="graphic"><% for(var i = 0; i < segments.length; i++) { %><li class="<%=segments[i].label.charAt(0).toLowerCase() + segments[i].label.slice(1)%>"><span><%=accounting.formatMoney(segments[i].value, \'$ \')%></span></li><% } %><li class="net"><span><%=accounting.formatMoney(' + stats.net + ', \'$ \')%></span></li></ul>',
				percentageInnerCutout: 60,
				segmentStrokeColor: '#4020d0',
				segmentStrokeWidth: 5,
				showTooltips: false
			};
			var ctx = $doughnut.get(0).getContext('2d');
			this.doughnut = new Chart(ctx).Doughnut(data, options);
			$('div.legend#legend-amounts').html(this.doughnut.generateLegend());
		},

		drawLine: function(balances, noLabels) {
			if(this.line) {
				this.line.stop().destroy();
			}
			var labels = [];
			var values = [];
			var verticalLines = [];
			var i = 0;
			$.each(balances, function(index, value) {
				if(index.toString() === '0') {
					index = '<';
				} else {
					if(noLabels) {
						if(typeof value === 'string') {
							var split = value.split('#');
							index = app.date.getMonthString(parseInt(split[1], 10), true);
						} else {
							index = '';
						}
					} else {
						index = index.split('-')[2];
					}
					if(typeof value === 'string') {
						verticalLines.push(i);
						value = parseInt(value, 10);
					}
				}
				labels.push(index);
				values.push(value);
				i++;
			});
			var data = {
				labels: labels,
				datasets: [
					{
						data: values,
						fillColor: 'rgba(44, 22, 142, .5)',
						pointColor: '#fff',
						pointStrokeColor: '#fff',
						strokeColor: '#fff'
					}
				]
			};
			var options = {
				animationEasing: 'easeOutElastic',
				animationSteps: 38,
				bezierCurve: false,
				datasetStrokeWidth: 1,
				pointDotRadius: 2,
				scaleFontColor: '#2c168e',
				scaleGridLineColor: 'rgba(44, 22, 142, .25)',
				scaleLineColor: '#2c168e',
				scaleShowGridLines: true,
				scaleShowVerticalLines: false,
				showTooltips: false,
				verticalLines: verticalLines
			};
			var ctx = $('canvas#line').get(0).getContext('2d');
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

		drawStats: function() {
			var self = this;
			if(this.index) {
				var type = this.$el.find('ul.wrapper-radiobutton div.active').data('type');
				if(this.stats[type].trades) {
					$('div#no-stats').css('display', 'none');
					$('div.wrapper-control-box-swipe').css('display', 'block');
					this.drawDoughnut(this.stats[type]);
					this.drawNumbers(this.stats[type]);
					this.drawLine(this.stats[type].balances, true);
				} else {
					$('div#no-stats').css('display', 'block');
					$('div.wrapper-control-box-swipe').css('display', 'none');
				}
			} else {
				var deferred = app.stats.get(app.stats.availables[this.period][this.at]);
				deferred.done(function(stats) {
					var type = self.$el.find('ul.wrapper-radiobutton div.active').data('type');
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
					done:
					switch(self.period) {
						case 'monthly':
							for(var i = app.stats.availables.weekly.length; i > 0; i--) {
								var dateValues = app.stats.availables.weekly[i - 1].split('-');
								if(dateValues[0] + '-' + dateValues[1] === index) {
									if(!app.stats.data[app.stats.availables.weekly[i - 1]]) {
										app.stats.get(app.stats.availables.weekly[i - 1]);
									}
									break done;
								}
							}
							var dateValues = index.split('-');
							if(dateValues[1] === '0') {
								index = (dateValues[0] - 1) + '-11';
							} else {
								index = dateValues[0] + '-' + (dateValues[1] - 1);
							}
							for(var i = 0; i < app.stats.availables.weekly.length; i++) {
								var dateValues = app.stats.availables.weekly[i].split('-');
								if(dateValues[0] + '-' + dateValues[1] === index) {
									if(!app.stats.data[app.stats.availables.weekly[i]]) {
										app.stats.get(app.stats.availables.weekly[i]);
									}
									break done;
								}
							}
							break;
						case 'weekly':
							var dateValues = index.split('-');
							var date = new Date(dateValues[0], dateValues[1], dateValues[2], 0, 0, 0, 0);
							date.setDate(date.getDate() + 6);
							for(var i = app.stats.availables.monthly.length; i > 0; i--) {
								if(date.getFullYear() + '-' + date.getMonth() === app.stats.availables.monthly[i - 1]) {
									if(!app.stats.data[app.stats.availables.monthly[i - 1]]) {
										app.stats.get(app.stats.availables.monthly[i - 1]);
									}
									break done;
								}
							}
							break;
					}
				});
			}
			return deferred;
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
						this.drawStats();
					}
					break;
				case 'right':
					if(app.stats.availables[this.period][this.at - 1]) {
						this.at--;
						$('div#date').html(app.date.getString(app.stats.availables[this.period][this.at]));
						this.drawStats();
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
				this.drawStats();
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
		}
	});
})();
