(function() {
	'use strict';

	app.stats = {
		availables:{
			monthly: [],
			weekly: []
		},
		data: {},

		calculateSharpeRatio: function(nets, average) {
			if(nets.length < 2) {
				return 'N/A';
			}
			var carry = 0;
			for(var i = 0; i < nets.length; i++) {
				var difference = nets[i] - average;
				carry += Math.pow(difference, 2);
			}
			var standardDeviation = Math.sqrt(carry / (nets.length - 1));
			if(standardDeviation === 0) {
				return 'N/A';
			}
			return average / standardDeviation;
		},

		compress: function(name) {
			var steps = Math.floor($(document).width() / 12);
			for(var i = 0; i < 3; i++) {
				switch(i) {
					case 0:
						var type = 'all';
						break;
					case 1:
						var type = 'longs';
						break;
					case 2:
						var type = 'shorts';
						break;
				}
				var balances = this.data[name][type].balances;
				var length = Object.keys(balances).length;
				if(length > steps) {
					var temp = [];
					$.each(balances, function(index, value) {
						for(var j = 0; j < steps - 2; j++) {
							if(j === 0) {
								temp.push(value + '#' + index);
							} else {
								temp.push(value);
							}
						}
					});
					temp = temp.slice(steps - 3, temp.length - (steps - 3));
					var balancesNew = {
						0: temp[0]
					};
					var at = '';
					var counter = -1;
					var j = 0;
					var sum = 0;
					for(var k = 1; k < temp.length - 1; k++) {
						if(typeof temp[k] === 'string') {
							var split = temp[k].split('#');
							temp[k] = parseInt(split[0], 10);
							split = split[1].split('-');
							if(!at.length) {
								at = split[0] + '-' + split[1] + '-';
							} else if(at !== split[0] + '-' + split[1] + '-') {
								counter = 0;
							}
						}
						sum += temp[k];
						if(counter > -1) {
							counter++;
						}
						if(k % (length - 2) === 0) {
							var halfStep = (steps - 2) / 2;
							if(counter > -1) {
								if(counter === halfStep) {
									// Schrödinger's cat
									counter += Math.round(Math.random()) * 2 - 1;
								}
							}
							if(counter >= halfStep) {
								at = split[0] + '-' + split[1] + '-';
								j = 0;
							}
							balancesNew[at + j++] = sum / (length - 2);
							sum = 0;
							if(counter > -1) {
								if(counter < halfStep) {
									at = split[0] + '-' + split[1] + '-';
									j = 0;
								}
								counter = -1;
							}
						}
					}
					var last = temp[temp.length - 1];
					if(typeof last === 'string') {
						var split = last.split('#');
						last = parseInt(split[0], 10);
						split = split[1].split('-');
						if(at !== split[0] + '-' + split[1] + '-') {
							at = split[0] + '-' + split[1] + '-';
						}
					}
					balancesNew[at + j] = parseInt(temp[temp.length - 1], 10);
					this.data[name][type].balances = balancesNew;
				}
			}
		},

		generate: function(name, from, to) {
			var self = this;
			var deferred = $.Deferred();
			var trades = new app.Collections.trades();
			trades.setAccountId(app.account.get('id'));
			if(name.indexOf('#') > -1) {
				var split = name.split('#');
				var groups = [];
				for(var i = 0; i < split[2].length; i ++) {
					groups.push(split[2][i]);
				}
				trades.setGroups(groups);
			}
			trades.setRange(from, to);
			trades.deferreds = [];
			trades.fetch({
				success: function() {
					$.when.apply($, trades.deferreds).done(function() {
						trades = trades.toJSON();

						self.data[name] = {
							all: {
								profit: 0,
								loss: 0,
								commission: 0,
								net: 0,
								trades: 0,
								winners: 0,
								losers: 0,
								accuracy: 0,
								averageTrade: 0,
								averageWinningTrade: 0,
								averageLosingTrade: 0,
								riskRewardRatio: 0,
								averageTimeInMarket: 0,
								sharpeRatio: 0,
								variation: 0,
								balances: {}
							},

							longs: {
								profit: 0,
								loss: 0,
								commission: 0,
								net: 0,
								trades: 0,
								winners: 0,
								losers: 0,
								accuracy: 0,
								averageTrade: 0,
								averageWinningTrade: 0,
								averageLosingTrade: 0,
								riskRewardRatio: 0,
								averageTimeInMarket: 0,
								sharpeRatio: 0,
								variation: 0,
								balances: {}
							},

							shorts: {
								profit: 0,
								loss: 0,
								commission: 0,
								net: 0,
								trades: 0,
								winners: 0,
								losers: 0,
								accuracy: 0,
								averageTrade: 0,
								averageWinningTrade: 0,
								averageLosingTrade: 0,
								riskRewardRatio: 0,
								averageTimeInMarket: 0,
								sharpeRatio: 0,
								variation: 0,
								balances: {}
							}
						};

						var nets = {
							all: [],
							longs: [],
							shorts: []
						};

						for(var i = 0; i < trades.length; i++) {
							self.data[name]['all'].profit += trades[i].profit;
							self.data[name]['all'].loss += trades[i].loss;
							self.data[name]['all'].commission += trades[i].commission;
							self.data[name]['all'].net += trades[i].net;
							self.data[name]['all'].trades++;
							if(trades[i].net > 0) {
								self.data[name]['all'].winners++;
								self.data[name]['all'].averageWinningTrade += trades[i].net
							} else if(trades[i].net < 0) {
								self.data[name]['all'].losers++;
								self.data[name]['all'].averageLosingTrade += trades[i].net
							}
							self.data[name]['all'].averageTimeInMarket += trades[i].closed_at - trades[i].objects[0].created_at;
							nets.all.push(trades[i].net);
							switch(trades[i].type) {
								case 1:
									self.data[name]['longs'].profit += trades[i].profit;
									self.data[name]['longs'].loss += trades[i].loss;
									self.data[name]['longs'].commission += trades[i].commission;
									self.data[name]['longs'].net += trades[i].net;
									self.data[name]['longs'].trades++;
									if(trades[i].net > 0) {
										self.data[name]['longs'].winners++;
										self.data[name]['longs'].averageWinningTrade += trades[i].net
									} else if(trades[i].net < 0) {
										self.data[name]['longs'].losers++;
										self.data[name]['longs'].averageLosingTrade += trades[i].net
									}
									self.data[name]['longs'].averageTimeInMarket += trades[i].closed_at - trades[i].objects[0].created_at;
									nets.longs.push(trades[i].net);
									break;
								case 2:
									self.data[name]['shorts'].profit += trades[i].profit;
									self.data[name]['shorts'].loss += trades[i].loss;
									self.data[name]['shorts'].commission += trades[i].commission;
									self.data[name]['shorts'].net += trades[i].net;
									self.data[name]['shorts'].trades++;
									if(trades[i].net > 0) {
										self.data[name]['shorts'].winners++;
										self.data[name]['shorts'].averageWinningTrade += trades[i].net
									} else if(trades[i].net < 0) {
										self.data[name]['shorts'].losers++;
										self.data[name]['shorts'].averageLosingTrade += trades[i].net
									}
									self.data[name]['shorts'].averageTimeInMarket += trades[i].closed_at - trades[i].objects[0].created_at;
									nets.shorts.push(trades[i].net);
									break;
							}
							if(i === 0) {
								var initialBalance = trades[i].net * 100 / trades[i].variation;
								var balance = initialBalance;
								var balanceLongs = initialBalance;
								var balanceShorts = initialBalance;
								self.data[name]['all'].balances[0] = initialBalance;
								self.data[name]['longs'].balances[0] = initialBalance;
								self.data[name]['shorts'].balances[0] = initialBalance;
							}
							var date = new Date(trades[i].closed_at);
							var year = date.getFullYear();
							var month = date.getMonth();
							var day = year + '-' + month + '-' + date.getDate();
							balance += trades[i].net;
							self.data[name]['all'].balances[day] = balance;
							switch(trades[i].type) {
								case 1:
									balanceLongs += trades[i].net;
									self.data[name]['longs'].balances[day] = balanceLongs;
									break;
								case 2:
									balanceShorts += trades[i].net;
									self.data[name]['shorts'].balances[day] = balanceShorts;
									break;
							}
						}

						if(self.data[name]['all'].trades > 0) {
							self.data[name]['all'].accuracy = self.data[name]['all'].winners * 100 / self.data[name]['all'].trades;
							self.data[name]['all'].averageTrade = self.data[name]['all'].net / self.data[name]['all'].trades;
						}
						if(self.data[name]['longs'].trades > 0) {
							self.data[name]['longs'].accuracy = self.data[name]['longs'].winners * 100 / self.data[name]['longs'].trades;
							self.data[name]['longs'].averageTrade = self.data[name]['longs'].net / self.data[name]['longs'].trades;
						}
						if(self.data[name]['shorts'].trades > 0) {
							self.data[name]['shorts'].accuracy = self.data[name]['shorts'].winners * 100 / self.data[name]['shorts'].trades;
							self.data[name]['shorts'].averageTrade = self.data[name]['shorts'].net / self.data[name]['shorts'].trades;
						}
						if(self.data[name]['all'].winners > 0) {
							self.data[name]['all'].averageWinningTrade /= self.data[name]['all'].winners;
						}
						if(self.data[name]['longs'].winners > 0) {
							self.data[name]['longs'].averageWinningTrade /= self.data[name]['longs'].winners;
						}
						if(self.data[name]['shorts'].winners > 0) {
							self.data[name]['shorts'].averageWinningTrade /= self.data[name]['shorts'].winners;
						}
						if(self.data[name]['all'].losers > 0) {
							self.data[name]['all'].averageLosingTrade = Math.abs(self.data[name]['all'].averageLosingTrade / self.data[name]['all'].losers);
						}
						if(self.data[name]['longs'].losers > 0) {
							self.data[name]['longs'].averageLosingTrade = Math.abs(self.data[name]['longs'].averageLosingTrade / self.data[name]['longs'].losers);
						}
						if(self.data[name]['shorts'].losers > 0) {
							self.data[name]['shorts'].averageLosingTrade = Math.abs(self.data[name]['shorts'].averageLosingTrade / self.data[name]['shorts'].losers);
						}
						if(self.data[name]['all'].averageLosingTrade === 0) {
							self.data[name]['all'].riskRewardRatio = 'N/A';
						} else {
							self.data[name]['all'].riskRewardRatio = self.data[name]['all'].averageWinningTrade / self.data[name]['all'].averageLosingTrade;
						}
						if(self.data[name]['longs'].averageLosingTrade === 0) {
							self.data[name]['longs'].riskRewardRatio = 'N/A';
						} else {
							self.data[name]['longs'].riskRewardRatio = self.data[name]['longs'].averageWinningTrade / self.data[name]['longs'].averageLosingTrade;
						}
						if(self.data[name]['shorts'].averageLosingTrade === 0) {
							self.data[name]['shorts'].riskRewardRatio = 'N/A';
						} else {
							self.data[name]['shorts'].riskRewardRatio = self.data[name]['shorts'].averageWinningTrade / self.data[name]['shorts'].averageLosingTrade;
						}
						if(self.data[name]['all'].trades > 0) {
							self.data[name]['all'].averageTimeInMarket /= self.data[name]['all'].trades;
						}
						if(self.data[name]['longs'].trades > 0) {
							self.data[name]['longs'].averageTimeInMarket /= self.data[name]['longs'].trades;
						}
						if(self.data[name]['shorts'].trades > 0) {
							self.data[name]['shorts'].averageTimeInMarket /= self.data[name]['shorts'].trades;
						}
						self.data[name]['all'].sharpeRatio = self.calculateSharpeRatio(nets.all, self.data[name]['all'].averageTrade);
						self.data[name]['longs'].sharpeRatio = self.calculateSharpeRatio(nets.longs, self.data[name]['longs'].averageTrade);
						self.data[name]['shorts'].sharpeRatio = self.calculateSharpeRatio(nets.shorts, self.data[name]['shorts'].averageTrade);
						if(initialBalance > 0) {
							self.data[name]['all'].variation = (balance - initialBalance) * 100 / initialBalance;
							self.data[name]['longs'].variation = (balanceLongs - initialBalance) * 100 / initialBalance;
							self.data[name]['shorts'].variation = (balanceShorts - initialBalance) * 100 / initialBalance;
						}
						self.compress(name);

						if(name.indexOf('#') > -1) {
							deferred.resolve(self.data[name]);
						} else {
							var stats = new app.Models.stats();
							stats.set({
								name: name,
								data: self.stringify(self.data[name]),
								created_at: (new Date()).getTime()
							});
							stats.save(null, {
								success: function() {
									deferred.resolve(self.data[name]);
								}
							});
						}
					});
				}
			});
			return deferred;
		},

		get: function(name) {
			var self = this;
			var deferred = $.Deferred();
			if(this.data[name]) {
				deferred.resolve(this.data[name]);
			} else {
				var statss = new app.Collections.statss();
				statss.setName(name);
				statss.fetch({
					success: function() {
						if(statss.length) {
							var stats = statss.at(0).toJSON();
							self.recover(stats);
							deferred.resolve(self.data[stats.name]);
						} else {
							var dateFrom = new Date();
							dateFrom.setHours(0, 0, 0, 0);
							var dateTo = new Date();
							dateTo.setHours(23, 59, 59, 999);
							if(name.indexOf('#') > -1) {
								var split = name.split('#');
								var fromDateValues = split[0].split('-');
								var toDateValues = split[1].split('-');
								dateFrom.setFullYear(fromDateValues[0]);
								dateFrom.setMonth(fromDateValues[1]);
								dateFrom.setDate(fromDateValues[2]);
								dateTo.setFullYear(toDateValues[0]);
								dateTo.setMonth(toDateValues[1]);
								dateTo.setDate(toDateValues[2]);
							} else {
								dateFrom.setDate(1);
								dateTo.setDate(1);
								var dateValues = name.split('-');
								switch(dateValues.length) {
									case 2:
										dateFrom.setFullYear(dateValues[0]);
										dateFrom.setMonth(dateValues[1]);
										dateTo.setFullYear(dateValues[0]);
										dateTo.setMonth(parseInt(dateValues[1], 10) + 1);
										dateTo.setDate(0);
										break;
									case 3:
										dateFrom.setFullYear(dateValues[0]);
										dateFrom.setMonth(dateValues[1]);
										dateFrom.setDate(dateValues[2]);
										dateTo.setFullYear(dateValues[0]);
										dateTo.setMonth(dateValues[1]);
										dateTo.setDate(parseInt(dateValues[2], 10) + 6);
										break;
								}
							}
							var deferred2 = self.generate(name, dateFrom.getTime(), dateTo.getTime());
							deferred2.then(function(stats) {
								deferred.resolve(stats);
							});
						}
					}
				});
			}
			return deferred;
		},

		recover: function(stats) {
			var name = stats.name;
			var data = stats.data.split('#');
			var stats = {};
			for(var i = 0; i < 3; i++) {
				switch(i) {
					case 0:
						var type = 'all';
						break;
					case 1:
						var type = 'longs';
						break;
					case 2:
						var type = 'shorts';
						break;
				}
				var split = data[i].split('&');
				var properties = split[0].substring(0, split[0].length - 1).split(',');
				var balances = JSON.parse(split[1].replace(/'/g, '"'));
				stats[type] = {};
				var fields = ['profit', 'loss', 'commission', 'net', 'trades', 'winners', 'losers', 'accuracy', 'averageTrade', 'averageWinningTrade', 'averageLosingTrade', 'riskRewardRatio', 'averageTimeInMarket', 'sharpeRatio', 'variation', 'balances'];
				for(var j = 0; j <= properties.length; j++) {
					if(j < properties.length) {
						stats[type][fields[j]] = properties[j];
					} else {
						stats[type][fields[j]] = balances;
					}
				}
			}
			this.data[name] = stats;
		},

		stringify: function(stats) {
			var string = '';
			for(var i = 0; i < 3; i++) {
				switch(i) {
					case 0:
						var type = 'all';
						break;
					case 1:
						var type = 'longs';
						string += '#';
						break;
					case 2:
						var type = 'shorts';
						string += '#';
						break;
				}
				$.each(stats[type], function(index, value) {
					if(typeof value === 'object') {
						string += '&' + JSON.stringify(value).replace(/"/g, '\'');
					} else {
						string += value;
					}
					string += ',';
				});
				string = string.substring(0, string.length - 1);
			}
			return string;
		},

		toMonthly: function(name) {
			var dateValues = name.split('-');
			var date = new Date(dateValues[0], dateValues[1], dateValues[2], 0, 0, 0, 0);
			date.setDate(date.getDate() + 6);
			for(var i = app.stats.availables.monthly.length; i > 0; i--) {
				if(date.getFullYear() + '-' + date.getMonth() === app.stats.availables.monthly[i - 1]) {
					return i - 1;
				}
			}
			return false;
		},

		toWeekly: function(name) {
			for(var i = app.stats.availables.weekly.length; i > 0; i--) {
				var dateValues = app.stats.availables.weekly[i - 1].split('-');
				if(dateValues[0] + '-' + dateValues[1] === name) {
					return i - 1;
				}
			}
			var dateValues = name.split('-');
			if(dateValues[1] === '0') {
				name = (dateValues[0] - 1) + '-11';
			} else {
				name = dateValues[0] + '-' + (dateValues[1] - 1);
			}
			for(var i = 0; i < app.stats.availables.weekly.length; i++) {
				var dateValues = app.stats.availables.weekly[i].split('-');
				if(dateValues[0] + '-' + dateValues[1] === name) {
					return i;
				}
			}
			return false;
		}
	};
})();
