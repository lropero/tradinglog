(function() {
	'use strict';

	app.stats = {
		availables: {
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

		compress: function(stats) {
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
						string += JSON.stringify(value).replace(/"/g, '\'') + '&';
					} else {
						string += value;
					}
					string += ',';
				});
				string = string.substring(0, string.length - 1);
			}
			return LZString.compressToBase64(string);
		},

		decompress: function(stats) {
			var partials = LZString.decompressFromBase64(stats).split('#');
			var data = {};
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
				var split = partials[i].split('&');
				var balances = JSON.parse(split[0].replace(/'/g, '"'));
				var properties = split[1].substring(0, split[1].length - 1).split(',');
				data[type] = {};
				var fields = ['balances', 'profit', 'loss', 'commission', 'net', 'trades', 'winners', 'losers', 'accuracy', 'averageTrade', 'averageWinningTrade', 'averageLosingTrade', 'riskRewardRatio', 'averageTimeInMarket', 'sharpeRatio', 'variation'];
				for(var j = 0; j < fields.length; j++) {
					if(j === 0) {
						data[type][fields[j]] = balances;
					} else {
						data[type][fields[j]] = properties[j];
					}
				}
			}
			return data;
		},

		delete: function(name) {
			var self = this;
			var deferred = $.Deferred();
			var statss = new app.Collections.statss();
			statss.setAccountId(app.account.id);
			statss.setName(name);
			statss.fetch({
				success: function() {
					if(statss.length) {
						var stats = statss.at(0);
						stats.obsolete(function() {
							delete self.data[name];
							deferred.resolve();
						});
					}
				}
			});
			return deferred;
		},

		generate: function(name, from, to) {
			var self = this;

			var groups = [0, 1, 2, 3, 4];
			if(name.indexOf('#') > -1) {
				groups = [];
				var split = name.split('#');
				for(var i = 0; i < split[2].length; i ++) {
					groups.push(parseInt(split[2][i], 10));
				}
			}

			var keys = [];
			for(var i = app.objects.length - 1; i >= app.count.open; i--) {
				if(app.objects[i].instrument_id) {
					var timestamp = app.objects[i].closed_at;
				} else {
					var timestamp = app.objects[i].created_at;
				}
				if(!keys.length) {
					if(timestamp >= from && i !== app.objects.length - 1) {
						if(app.objects[i].instrument_id) {
							if($.inArray(app.objects[i].group_id, groups) > -1) {
								keys.push(i);
							}
						} else {
							keys.push(i);
						}
					}
				} else {
					if(timestamp > to) {
						break;
					}
					if(app.objects[i].instrument_id) {
						if($.inArray(app.objects[i].group_id, groups) > -1) {
							keys.push(i);
						}
					} else {
						keys.push(i);
					}
				}
			}

			var data = {
				all: {
					balances: {},
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
					variation: 0
				},

				longs: {
					balances: {},
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
					variation: 0
				},

				shorts: {
					balances: {},
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
					variation: 0
				}
			};

			var initialBalance = app.account.get('balance');
			for(var i = app.count.open; i <= keys[0]; i++) {
				if(app.objects[i].instrument_id) {
					initialBalance -= app.objects[i].net;
				} else {
					initialBalance -= app.objects[i].amount;
				}
			}
			var balance = initialBalance;
			var balanceLongs = initialBalance;
			var balanceShorts = initialBalance;
			data['all'].balances[0] = initialBalance;
			data['longs'].balances[0] = initialBalance;
			data['shorts'].balances[0] = initialBalance;

			var nets = {
				all: [],
				longs: [],
				shorts: []
			};

			$.each(keys, function(index, key) {
				var object = app.objects[key];
				if(object.instrument_id) {
					var date = new Date(object.closed_at);
					var year = date.getFullYear();
					var month = date.getMonth();
					var day = year + '-' + month + '-' + date.getDate();
					balance += object.net;
					data['all'].balances[day] = balance;
					switch(object.type) {
						case 1:
							balanceLongs += object.net;
							data['longs'].balances[day] = balanceLongs;
							break;
						case 2:
							balanceShorts += object.net;
							data['shorts'].balances[day] = balanceShorts;
							break;
					}
					data['all'].profit += object.profit;
					data['all'].loss += object.loss;
					data['all'].commission += object.commission;
					data['all'].net += object.net;
					data['all'].trades++;
					if(object.net > 0) {
						data['all'].winners++;
						data['all'].averageWinningTrade += object.net
					} else if(object.net < 0) {
						data['all'].losers++;
						data['all'].averageLosingTrade += object.net
					}
					data['all'].averageTimeInMarket += object.closed_at - object.objects[0].created_at;
					nets.all.push(object.net);
					switch(object.type) {
						case 1:
							data['longs'].profit += object.profit;
							data['longs'].loss += object.loss;
							data['longs'].commission += object.commission;
							data['longs'].net += object.net;
							data['longs'].trades++;
							if(object.net > 0) {
								data['longs'].winners++;
								data['longs'].averageWinningTrade += object.net
							} else if(object.net < 0) {
								data['longs'].losers++;
								data['longs'].averageLosingTrade += object.net
							}
							data['longs'].averageTimeInMarket += object.closed_at - object.objects[0].created_at;
							nets.longs.push(object.net);
							break;
						case 2:
							data['shorts'].profit += object.profit;
							data['shorts'].loss += object.loss;
							data['shorts'].commission += object.commission;
							data['shorts'].net += object.net;
							data['shorts'].trades++;
							if(object.net > 0) {
								data['shorts'].winners++;
								data['shorts'].averageWinningTrade += object.net
							} else if(object.net < 0) {
								data['shorts'].losers++;
								data['shorts'].averageLosingTrade += object.net
							}
							data['shorts'].averageTimeInMarket += object.closed_at - object.objects[0].created_at;
							nets.shorts.push(object.net);
							break;
					}
				} else {
					var date = new Date(object.created_at);
					var year = date.getFullYear();
					var month = date.getMonth();
					var day = year + '-' + month + '-' + date.getDate();
					balance += object.amount;
					data['all'].balances[day] = balance;
					balanceLongs += object.amount;
					data['longs'].balances[day] = balanceLongs;
					balanceShorts += object.amount;
					data['shorts'].balances[day] = balanceShorts;
				}
			});

			if(data['all'].trades > 0) {
				data['all'].accuracy = data['all'].winners * 100 / data['all'].trades;
				data['all'].averageTrade = data['all'].net / data['all'].trades;
			}
			if(data['longs'].trades > 0) {
				data['longs'].accuracy = data['longs'].winners * 100 / data['longs'].trades;
				data['longs'].averageTrade = data['longs'].net / data['longs'].trades;
			}
			if(data['shorts'].trades > 0) {
				data['shorts'].accuracy = data['shorts'].winners * 100 / data['shorts'].trades;
				data['shorts'].averageTrade = data['shorts'].net / data['shorts'].trades;
			}
			if(data['all'].winners > 0) {
				data['all'].averageWinningTrade /= data['all'].winners;
			}
			if(data['longs'].winners > 0) {
				data['longs'].averageWinningTrade /= data['longs'].winners;
			}
			if(data['shorts'].winners > 0) {
				data['shorts'].averageWinningTrade /= data['shorts'].winners;
			}
			if(data['all'].losers > 0) {
				data['all'].averageLosingTrade = Math.abs(data['all'].averageLosingTrade / data['all'].losers);
			}
			if(data['longs'].losers > 0) {
				data['longs'].averageLosingTrade = Math.abs(data['longs'].averageLosingTrade / data['longs'].losers);
			}
			if(data['shorts'].losers > 0) {
				data['shorts'].averageLosingTrade = Math.abs(data['shorts'].averageLosingTrade / data['shorts'].losers);
			}
			if(data['all'].averageLosingTrade === 0) {
				data['all'].riskRewardRatio = 'N/A';
			} else {
				data['all'].riskRewardRatio = data['all'].averageWinningTrade / data['all'].averageLosingTrade;
			}
			if(data['longs'].averageLosingTrade === 0) {
				data['longs'].riskRewardRatio = 'N/A';
			} else {
				data['longs'].riskRewardRatio = data['longs'].averageWinningTrade / data['longs'].averageLosingTrade;
			}
			if(data['shorts'].averageLosingTrade === 0) {
				data['shorts'].riskRewardRatio = 'N/A';
			} else {
				data['shorts'].riskRewardRatio = data['shorts'].averageWinningTrade / data['shorts'].averageLosingTrade;
			}
			if(data['all'].trades > 0) {
				data['all'].averageTimeInMarket /= data['all'].trades;
			}
			if(data['longs'].trades > 0) {
				data['longs'].averageTimeInMarket /= data['longs'].trades;
			}
			if(data['shorts'].trades > 0) {
				data['shorts'].averageTimeInMarket /= data['shorts'].trades;
			}
			data['all'].sharpeRatio = self.calculateSharpeRatio(nets.all, data['all'].averageTrade);
			data['longs'].sharpeRatio = self.calculateSharpeRatio(nets.longs, data['longs'].averageTrade);
			data['shorts'].sharpeRatio = self.calculateSharpeRatio(nets.shorts, data['shorts'].averageTrade);
			if(initialBalance > 0) {
				data['all'].variation = data['all'].net * 100 / initialBalance;
				data['longs'].variation = data['longs'].net * 100 / initialBalance;
				data['shorts'].variation = data['shorts'].net * 100 / initialBalance;
			}
			data['all'].balances = self.rebalance(data['all'].balances);
			data['longs'].balances = self.rebalance(data['longs'].balances);
			data['shorts'].balances = self.rebalance(data['shorts'].balances);

			self.data[name] = self.compress(data);
			if(name.indexOf('#') === -1) {
				var stats = new app.Models.stats();
				stats.set({
					account_id: app.account.id,
					name: name,
					data: self.data[name],
					is_obsolete: 0
				});
				stats.save();
			}

			return data;
		},

		get: function(name) {
			var self = this;
			var deferred = $.Deferred();
			if(this.data[name]) {
				deferred.resolve(this.decompress(this.data[name]));
			} else {
				var statss = new app.Collections.statss();
				statss.setAccountId(app.account.id);
				statss.setName(name);
				statss.fetch({
					success: function() {
						if(statss.length) {
							var stats = statss.at(0).toJSON();
							self.data[stats.name] = stats.data;
							deferred.resolve(self.decompress(stats.data));
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
							var stats = self.generate(name, dateFrom.getTime(), dateTo.getTime());
							deferred.resolve(stats);
						}
					}
				});
			}
			return deferred;
		},

		rebalance: function(balances) {
			var steps = Math.floor($(document).width() / 12);
			var length = Object.keys(balances).length;
			if(length > steps) {
				var temp = [];
				$.each(balances, function(index, value) {
					for(var i = 0; i < steps - 2; i++) {
						if(i === 0) {
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
				var i = 0;
				var sum = 0;
				for(var j = 1; j < temp.length - 1; j++) {
					if(typeof temp[j] === 'string') {
						var split = temp[j].split('#');
						temp[j] = parseInt(split[0], 10);
						split = split[1].split('-');
						if(!at.length) {
							at = split[0] + '-' + split[1] + '-';
						} else if(at !== split[0] + '-' + split[1] + '-') {
							counter = 0;
						}
					}
					sum += temp[j];
					if(counter > -1) {
						counter++;
					}
					if(j % (length - 2) === 0) {
						var halfStep = (steps - 2) / 2;
						if(counter > -1) {
							if(counter === halfStep) {

								// Schrödinger's cat
								counter += Math.round(Math.random()) * 2 - 1;

							}
						}
						if(counter >= halfStep) {
							at = split[0] + '-' + split[1] + '-';
							i = 0;
						}
						balancesNew[at + i++] = sum / (length - 2);
						sum = 0;
						if(counter > -1) {
							if(counter < halfStep) {
								at = split[0] + '-' + split[1] + '-';
								i = 0;
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
				balancesNew[at + i] = parseInt(temp[temp.length - 1], 10);
				return balancesNew;
			}
			return balances;
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
