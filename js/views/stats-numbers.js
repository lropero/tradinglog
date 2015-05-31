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
			if(attrs.name) {
				this.name = attrs.name;
				this.groups = attrs.groups;
				app.stats.ats.radio = attrs.radio;
				app.stats.ats.slide = attrs.slide;
			} else {
				this.at = parseInt(attrs.at, 10);
				this.period = $('control.segmented li.active').data('period');
				var monthly = true;
				if(typeof attrs.monthly !== 'undefined' && !attrs.monthly) {
					monthly = false;
				}
				this.setAts(monthly, attrs.radio, attrs.slide);
			}
			this.template = Handlebars.compile(app.templateLoader.get('stats-numbers'));
			this.render();
		},

		render: function() {
			app.trigger('change', 'stats-numbers');
			if(this.name) {
				this.$el.html(this.template({
					date: app.date.getString(this.name),
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
			$('div#radio-' + app.stats.ats.radio).addClass('active');
			this.drawStats();
			var $swipePanes = $('ul.swipe-panes');
			$swipePanes.slick({
				accessibility: false,
				arrows: false,
				infinite: false,
				initialSlide: app.stats.ats.slide - 1
			});
			var $control = $('ul.control-box-swipe');
			$swipePanes.on('beforeChange', function(e, slick, currentSlide, nextSlide) {
				app.stats.ats.slide = nextSlide + 1;
				$control.find('li.active').removeClass('active');
				$('li#swipe-control-' + (nextSlide + 1)).addClass('active');
				return false;
			});
			$control.find('li.active').removeClass('active');
			$('li#swipe-control-' + app.stats.ats.slide).addClass('active');
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
					label: 'Commissions',
					value: stats.commissions
				},
				{
					color: '#989898',
					label: 'Operations',
					value: Math.abs(stats.operations)
				},
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
			var $legend = $('div.legend#legend-amounts');
			$legend.html(this.doughnut.generateLegend());
			if(stats.profit > 0) {
				$legend.find('li.profit').addClass('positive');
			}
			if(stats.loss > 0) {
				$legend.find('li.loss').addClass('negative');
			}
			if(stats.commissions > 0) {
				$legend.find('li.commissions').addClass('negative');
			}
			if(stats.operations > 0) {
				$legend.find('li.operations').addClass('positive');
			} else if(stats.operations < 0) {
				$legend.find('li.operations').addClass('negative');
			}
		},

		drawLine: function(balances, noLabels) {
			if(this.line) {
				this.line.stop().destroy();
			}
			var labels = [];
			var values = [];
			var i = 0;
			var last = '';
			var noMonth = false;
			var verticalLines = [];
			$.each(balances, function(index, value) {
				if(index.toString() === '0') {
					index = '<';
				} else {
					var split = index.split('-');
					if(noLabels) {
						index = '';
					} else {
						index = split[2];
						if(index.toString() === '0') {
							index = '';
							noLabels = true;
							noMonth = true;
						}
					}
					if(!last.length) {
						last = split[0] + '-' + split[1];
					} else if(last !== split[0] + '-' + split[1]) {
						verticalLines.push(i - 1);
						if(noLabels) {
							index = app.date.getMonthString(parseInt(split[1], 10), true);
							labels.pop();
							labels.push(index);
							index = '';
						}
						last = split[0] + '-' + split[1];
					}
				}
				labels.push(index);
				values.push(value);
				i++;
			});
			if(!verticalLines.length && noLabels && !noMonth) {
				var split = last.split('-');
				labels[0] = app.date.getMonthString(parseInt(split[1], 10), true);
			}
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
				scaleGridLineColor: 'rgba(44, 22, 142, .3)',
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
			if(isNaN(stats.accuracy)) {
				$('span#numbers-accuracy').html(stats.accuracy);
			} else {
				$('span#numbers-accuracy').html(accounting.toFixed(stats.accuracy, 2) + '%');
			}
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
			if(stats.accuracy !== 'N/A') {
				if(stats.accuracy >= 50) {
					$('span#numbers-accuracy').css('color', '#4bd763');
				} else {
					$('span#numbers-accuracy').css('color', '#ff3b30');
				}
			}
			if(stats.riskRewardRatio !== 'N/A') {
				if(stats.riskRewardRatio >= 1) {
					$('span#numbers-risk_reward_ratio').css('color', '#4bd763');
				} else {
					$('span#numbers-risk_reward_ratio').css('color', '#ff3b30');
				}
			}
		},

		drawStats: function() {
			var self = this;
			$('div#processing').css('display', 'block');
			$('div.wrapper-control-box-swipe').css('display', 'none');
			if(this.name) {
				var deferred = app.stats.get(this.name);
				deferred.done(function(stats) {
					var type = self.$el.find('ul.wrapper-radiobutton div.active').data('type');
					if(type === 'all' && Object.keys(stats[type].balances).length - 1 || type !== 'all' && stats[type].trades) {
						$('div#no-stats').css('display', 'none');
						$('div.wrapper-control-box-swipe').css('display', 'block');
						self.drawDoughnut(stats[type]);
						self.drawNumbers(stats[type]);
						self.drawLine(stats[type].balances, true);
						var $numbers = $('div.numbers');
						if(stats[type].net > 0) {
							$numbers.addClass('positive');
							$numbers.removeClass('negative');
						} else if(stats[type].net < 0) {
							$numbers.addClass('negative');
							$numbers.removeClass('positive');
						}
					} else {
						if(!(Object.keys(stats['all'].balances).length - 1)) {
							delete app.previousCustom;
						}
						$('div#no-stats').css('display', 'block');
						$('div.wrapper-control-box-swipe').css('display', 'none');
					}
					$('div#processing').css('display', 'none');
				});
			} else {
				var deferred = app.stats.get(app.stats.availables[this.period][this.at]);
				deferred.done(function(stats) {
					var type = self.$el.find('ul.wrapper-radiobutton div.active').data('type');
					if(type === 'all' && Object.keys(stats[type].balances).length - 1 || type !== 'all' && stats[type].trades) {
						$('div#no-stats').css('display', 'none');
						$('div.wrapper-control-box-swipe').css('display', 'block');
						self.drawDoughnut(stats[type]);
						self.drawNumbers(stats[type]);
						self.drawLine(stats[type].balances);
						var $numbers = $('div.numbers');
						if(stats[type].net > 0) {
							$numbers.addClass('positive');
							$numbers.removeClass('negative');
						} else if(stats[type].net < 0) {
							$numbers.addClass('negative');
							$numbers.removeClass('positive');
						}
					} else {
						$('div#no-stats').css('display', 'block');
						$('div.wrapper-control-box-swipe').css('display', 'none');
					}
					var name = app.stats.availables[self.period][self.at + 1];
					if(name) {
						$('span.button-left').show();
						if(!app.stats.data[name]) {
							app.stats.get(name);
						}
						name = app.stats.availables[self.period][self.at + 2];
						if(name && !app.stats.data[name]) {
							app.stats.get(name);
						}
					}
					name = app.stats.availables[self.period][self.at - 1];
					if(name) {
						$('span.button-right').show();
						if(!app.stats.data[name]) {
							app.stats.get(name);
						}
						name = app.stats.availables[self.period][self.at - 2];
						if(name && !app.stats.data[name]) {
							app.stats.get(name);
						}
					}
					name = app.stats.availables[self.period][self.at];
					switch(self.period) {
						case 'monthly':
							app.stats.get(app.stats.availables.weekly[app.stats.toWeekly(name)]);
							break;
						case 'weekly':
							app.stats.get(app.stats.availables.monthly[app.stats.toMonthly(name)]);
							break;
					}
					$('div#processing').css('display', 'none');
				});
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
						this.setAts(true, app.stats.ats.radio, app.stats.ats.slide);
						$('div#date').html(app.date.getString(app.stats.availables[this.period][this.at]));
						this.drawStats();
					}
					break;
				case 'right':
					if(app.stats.availables[this.period][this.at - 1]) {
						this.at--;
						this.setAts(true, app.stats.ats.radio, app.stats.ats.slide);
						$('div#date').html(app.date.getString(app.stats.availables[this.period][this.at]));
						this.drawStats();
					}
					break;
			}
			return false;
		},

		radio: function(e) {
			e.preventDefault();
			var $target = $(e.currentTarget);
			var $radio = $target;
			if($target.is('span')) {
				$radio = $target.prev();
			}
			if(!$radio.hasClass('active')) {
				app.stats.ats.radio = $radio.attr('id').replace('radio-', '');
				this.$el.find('ul.wrapper-radiobutton div.active').removeClass('active');
				$radio.addClass('active');
				this.drawStats();
			}
			return false;
		},

		setAts: function(monthly, radio, slide) {
			switch(this.period) {
				case 'monthly':
					if(monthly) {
						app.stats.ats = {
							monthly: this.at,
							weekly: app.stats.toWeekly(app.stats.availables.monthly[this.at]),
							radio: radio,
							slide: slide
						};
					}
					break;
				case 'weekly':
					var monthly = app.stats.toMonthly(app.stats.availables.weekly[this.at]);
					if(app.stats.ats.monthly !== monthly) {
						app.stats.ats = {
							monthly: monthly,
							weekly: this.at,
							radio: radio,
							slide: slide
						};
					} else {
						app.stats.ats.weekly = this.at;
					}
					break;
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
			return false;
		}
	});
})();
