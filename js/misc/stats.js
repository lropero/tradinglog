(function() {
	'use strict';

	app.stats = {
		availables: {
			monthly: [],
			weekly: []
		},
		data: {},

		affect: function(timestamp) {
			var date = new Date(timestamp);
			var monthly = date.getFullYear() + '-' + date.getMonth();
			date.setDate(date.getDate() - date.getDay());
			var weekly = date.getFullYear() + '-' + date.getMonth() + '-' + (date.getDate());
			if($.inArray(monthly, app.stats.availables.monthly) > -1) {
				app.stats.delete(monthly);
			}
			if($.inArray(weekly, app.stats.availables.weekly) > -1) {
				app.stats.delete(weekly);
			}
			delete app.dates.firstDate;
			delete app.dates.lastDate;
			app.stats.availables.monthly = [];
			app.stats.availables.weekly = [];
			for(var i = app.count.open; i < app.objects.length - 1; i++) {
				if(app.objects[i].instrument_id) {
					var timestamp = app.objects[i].closed_at;
				} else {
					var timestamp = app.objects[i].created_at;
				}
				app.dates.firstDate = timestamp;
				if(!app.dates.lastDate) {
					app.dates.lastDate = timestamp;
				}
				var date = new Date(timestamp);
				var monthly = date.getFullYear() + '-' + date.getMonth();
				date.setDate(date.getDate() - date.getDay());
				var weekly = date.getFullYear() + '-' + date.getMonth() + '-' + (date.getDate());
				if(!app.stats.availables.monthly.length || app.stats.availables.monthly[app.stats.availables.monthly.length - 1] !== monthly) {
					app.stats.availables.monthly.push(monthly);
				}
				if(!app.stats.availables.weekly.length || app.stats.availables.weekly[app.stats.availables.weekly.length - 1] !== weekly) {
					app.stats.availables.weekly.push(weekly);
				}
			}
		},

		calculateSharpeRatio: function(nets, average) {
			if(nets.length < 2) {
				return 'N/A';
			}
			var carry = Big(0);
			for(var i = 0; i < nets.length; i++) {
				var difference = Big(nets[i]).minus(average);
				carry = carry.plus(difference.pow(2));
			}
			var standardDeviation = carry.div(nets.length - 1).sqrt();
			if(standardDeviation.toString() === '0') {
				return 'N/A';
			}
			return parseFloat(Big(average).div(standardDeviation).toString());
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
				var properties = split[1].substring(1, split[1].length).split(',');
				data[type] = {};
				var fields = ['balances', 'profit', 'loss', 'commissions', 'operations', 'net', 'trades', 'winners', 'losers', 'accuracy', 'averageTrade', 'averageWinningTrade', 'averageLosingTrade', 'riskRewardRatio', 'averageTimeInMarket', 'sharpeRatio', 'variation'];
				for(var j = 0; j < fields.length; j++) {
					if(j === 0) {
						data[type][fields[j]] = balances;
					} else if(properties[j - 1] !== 'N/A') {
						data[type][fields[j]] = parseFloat(properties[j - 1]);
					} else {
						data[type][fields[j]] = properties[j - 1];
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
					profit: Big(0),
					loss: Big(0),
					commissions: Big(0),
					operations: Big(0),
					net: Big(0),
					trades: 0,
					winners: 0,
					losers: 0,
					accuracy: 'N/A',
					averageTrade: 0,
					averageWinningTrade: Big(0),
					averageLosingTrade: Big(0),
					riskRewardRatio: 0,
					averageTimeInMarket: 0,
					sharpeRatio: 0,
					variation: 0
				},

				longs: {
					balances: {},
					profit: Big(0),
					loss: Big(0),
					commissions: Big(0),
					operations: Big(0),
					net: Big(0),
					trades: 0,
					winners: 0,
					losers: 0,
					accuracy: 'N/A',
					averageTrade: 0,
					averageWinningTrade: Big(0),
					averageLosingTrade: Big(0),
					riskRewardRatio: 0,
					averageTimeInMarket: 0,
					sharpeRatio: 0,
					variation: 0
				},

				shorts: {
					balances: {},
					profit: Big(0),
					loss: Big(0),
					commissions: Big(0),
					operations: Big(0),
					net: Big(0),
					trades: 0,
					winners: 0,
					losers: 0,
					accuracy: 'N/A',
					averageTrade: 0,
					averageWinningTrade: Big(0),
					averageLosingTrade: Big(0),
					riskRewardRatio: 0,
					averageTimeInMarket: 0,
					sharpeRatio: 0,
					variation: 0
				}
			};

			var initialBalance = Big(app.account.get('balance'));
			for(var i = app.count.open; i <= keys[0]; i++) {
				if(app.objects[i].instrument_id) {
					initialBalance = initialBalance.minus(app.objects[i].net);
				} else {
					initialBalance = initialBalance.minus(app.objects[i].amount);
				}
			}
			var balance = initialBalance;
			var balanceLongs = initialBalance;
			var balanceShorts = initialBalance;
			data['all'].balances[0] = parseFloat(initialBalance.toString());
			data['longs'].balances[0] = parseFloat(initialBalance.toString());
			data['shorts'].balances[0] = parseFloat(initialBalance.toString());
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
					balance = balance.plus(object.net);
					data['all'].balances[day] = parseFloat(balance.toString());
					switch(object.type) {
						case 1:
							balanceLongs = balanceLongs.plus(object.net);
							data['longs'].balances[day] = parseFloat(balanceLongs.toString());
							break;
						case 2:
							balanceShorts = balanceShorts.plus(object.net);
							data['shorts'].balances[day] = parseFloat(balanceShorts.toString());
							break;
					}
					data['all'].profit = data['all'].profit.plus(object.profit);
					data['all'].loss = data['all'].loss.plus(object.loss);
					data['all'].commissions = data['all'].commissions.plus(object.commission);
					data['all'].net = data['all'].net.plus(object.net);
					data['all'].trades++;
					if(object.net > 0) {
						data['all'].winners++;
						data['all'].averageWinningTrade = data['all'].averageWinningTrade.plus(object.net);
					} else if(object.net < 0) {
						data['all'].losers++;
						data['all'].averageLosingTrade = data['all'].averageLosingTrade.minus(object.net);
					}
					data['all'].averageTimeInMarket += object.closed_at - object.objects[0].created_at;
					nets.all.push(object.net);
					switch(object.type) {
						case 1:
							data['longs'].profit = data['longs'].profit.plus(object.profit);
							data['longs'].loss = data['longs'].loss.plus(object.loss);
							data['longs'].commissions = data['longs'].commissions.plus(object.commission);
							data['longs'].net = data['longs'].net.plus(object.net);
							data['longs'].trades++;
							if(object.net > 0) {
								data['longs'].winners++;
								data['longs'].averageWinningTrade = data['longs'].averageWinningTrade.plus(object.net);
							} else if(object.net < 0) {
								data['longs'].losers++;
								data['longs'].averageLosingTrade = data['longs'].averageLosingTrade.minus(object.net);
							}
							data['longs'].averageTimeInMarket += object.closed_at - object.objects[0].created_at;
							nets.longs.push(object.net);
							break;
						case 2:
							data['shorts'].profit = data['shorts'].profit.plus(object.profit);
							data['shorts'].loss = data['shorts'].loss.plus(object.loss);
							data['shorts'].commissions = data['shorts'].commissions.plus(object.commission);
							data['shorts'].net = data['shorts'].net.plus(object.net);
							data['shorts'].trades++;
							if(object.net > 0) {
								data['shorts'].winners++;
								data['shorts'].averageWinningTrade = data['shorts'].averageWinningTrade.plus(object.net);
							} else if(object.net < 0) {
								data['shorts'].losers++;
								data['shorts'].averageLosingTrade = data['shorts'].averageLosingTrade.minus(object.net);
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
					balance = balance.plus(object.amount);
					data['all'].balances[day] = parseFloat(balance.toString());
					balanceLongs = balanceLongs.plus(object.amount);
					data['longs'].balances[day] = parseFloat(balanceLongs.toString());
					balanceShorts = balanceShorts.plus(object.amount);
					data['shorts'].balances[day] = parseFloat(balanceShorts.toString());
					data['all'].operations = data['all'].operations.plus(object.amount);
					data['longs'].operations = data['longs'].operations.plus(object.amount);
					data['shorts'].operations = data['shorts'].operations.plus(object.amount);
					data['all'].net = data['all'].net.plus(object.amount);
					data['longs'].net = data['longs'].net.plus(object.amount);
					data['shorts'].net = data['shorts'].net.plus(object.amount);
				}
			});

			if(data['all'].trades > 0) {
				data['all'].accuracy = data['all'].winners * 100 / data['all'].trades;
				data['all'].averageTrade = parseFloat(data['all'].net.div(data['all'].trades).toString());
			}
			if(data['longs'].trades > 0) {
				data['longs'].accuracy = data['longs'].winners * 100 / data['longs'].trades;
				data['longs'].averageTrade = parseFloat(data['longs'].net.div(data['longs'].trades).toString());
			}
			if(data['shorts'].trades > 0) {
				data['shorts'].accuracy = data['shorts'].winners * 100 / data['shorts'].trades;
				data['shorts'].averageTrade = parseFloat(data['shorts'].net.div(data['shorts'].trades).toString());
			}
			if(data['all'].winners > 0) {
				data['all'].averageWinningTrade = data['all'].averageWinningTrade.div(data['all'].winners);
			}
			if(data['longs'].winners > 0) {
				data['longs'].averageWinningTrade = data['longs'].averageWinningTrade.div(data['longs'].winners);
			}
			if(data['shorts'].winners > 0) {
				data['shorts'].averageWinningTrade = data['shorts'].averageWinningTrade.div(data['shorts'].winners);
			}
			if(data['all'].losers > 0) {
				data['all'].averageLosingTrade = data['all'].averageLosingTrade.div(data['all'].losers);
			}
			if(data['longs'].losers > 0) {
				data['longs'].averageLosingTrade = data['longs'].averageLosingTrade.div(data['longs'].losers);
			}
			if(data['shorts'].losers > 0) {
				data['shorts'].averageLosingTrade = data['shorts'].averageLosingTrade.div(data['shorts'].losers);
			}
			if(data['all'].averageLosingTrade.toString() === '0') {
				data['all'].riskRewardRatio = 'N/A';
			} else {
				data['all'].riskRewardRatio = parseFloat(data['all'].averageWinningTrade.div(data['all'].averageLosingTrade).toString());
			}
			if(data['longs'].averageLosingTrade.toString() === '0') {
				data['longs'].riskRewardRatio = 'N/A';
			} else {
				data['longs'].riskRewardRatio = parseFloat(data['longs'].averageWinningTrade.div(data['longs'].averageLosingTrade).toString());
			}
			if(data['shorts'].averageLosingTrade.toString() === '0') {
				data['shorts'].riskRewardRatio = 'N/A';
			} else {
				data['shorts'].riskRewardRatio = parseFloat(data['shorts'].averageWinningTrade.div(data['shorts'].averageLosingTrade).toString());
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
			if(initialBalance.toString() !== '0') {
				data['all'].variation = parseFloat(data['all'].net.times(100).div(initialBalance).toString());
				data['longs'].variation = parseFloat(data['longs'].net.times(100).div(initialBalance).toString());
				data['shorts'].variation = parseFloat(data['shorts'].net.times(100).div(initialBalance).toString());
			}

			data['all'].balances = self.rebalance(data['all'].balances);
			data['longs'].balances = self.rebalance(data['longs'].balances);
			data['shorts'].balances = self.rebalance(data['shorts'].balances);
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
				data[type].profit = parseFloat(data[type].profit.toString());
				data[type].loss = parseFloat(data[type].loss.toString());
				data[type].commissions = parseFloat(data[type].commissions.toString());
				data[type].operations = parseFloat(data[type].operations.toString());
				data[type].net = parseFloat(data[type].net.toString());
				data[type].averageWinningTrade = parseFloat(data[type].averageWinningTrade.toString());
				data[type].averageLosingTrade = parseFloat(data[type].averageLosingTrade.toString());
			}

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
				var sum = Big(0);
				for(var j = 1; j < temp.length - 1; j++) {
					if(typeof temp[j] === 'string') {
						var split = temp[j].split('#');
						temp[j] = parseFloat(split[0]);
						split = split[1].split('-');
						if(!at.length) {
							at = split[0] + '-' + split[1] + '-';
						} else if(at !== split[0] + '-' + split[1] + '-') {
							counter = 0;
						}
					}
					sum = sum.plus(temp[j]);
					if(counter > -1) {
						counter++;
					}
					if(j % (length - 2) === 0) {
						var halfStep = (steps - 2) / 2;
						if(counter > -1 && counter === halfStep) {

							// Schrödinger's cat
							counter += Math.round(Math.random()) * 2 - 1;

						}
						if(counter >= halfStep) {
							at = split[0] + '-' + split[1] + '-';
							i = 0;
						}
						balancesNew[at + i++] = parseFloat(sum.div(length - 2).toString());
						sum = Big(0);
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
					last = parseFloat(split[0]);
					split = split[1].split('-');
					if(at !== split[0] + '-' + split[1] + '-') {
						at = split[0] + '-' + split[1] + '-';
					}
				}
				balancesNew[at + i] = last;
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
