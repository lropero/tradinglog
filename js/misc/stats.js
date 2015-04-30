(function() {
	'use strict';

	app.stats = {
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

		generate: function(index, from, to) {
			var self = this;
			var deferred = $.Deferred();
			var trades = new app.Collections.trades();
			trades.setAccountId(app.account.get('id'));
			trades.setRange(from, to);
			trades.deferreds = [];
			trades.fetch({
				success: function() {
					$.when.apply($, trades.deferreds).done(function() {
						trades = trades.toJSON();

						self.data[index] = {
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

						var nets = {
							all: [],
							longs: [],
							shorts: []
						};

						for(var i = 0; i < trades.length; i++) {
							if(i === 0) {
								var initialBalance = trades[i].net * 100 / trades[i].variation;
								var balanceLongs = initialBalance;
								var balanceShorts = initialBalance;
								self.data[index]['all'].balances[0] = initialBalance;
								self.data[index]['longs'].balances[0] = initialBalance;
								self.data[index]['shorts'].balances[0] = initialBalance;

								var date = new Date(trades[i].closed_at);
								var day = date.getDate();
								var balance = initialBalance + trades[i].net;
								self.data[index]['all'].balances[day] = balance;
								switch(trades[i].type) {
									case 1:
										balanceLongs += trades[i].net;
										self.data[index]['longs'].balances[day] = balanceLongs;
										break;
									case 2:
										balanceShorts += trades[i].net;
										self.data[index]['shorts'].balances[day] = balanceShorts;
										break;
								}
							} else {
								var date = new Date(trades[i].closed_at);
								var day = date.getDate();
								balance += trades[i].net;
								self.data[index]['all'].balances[day] = balance;
								switch(trades[i].type) {
									case 1:
										balanceLongs += trades[i].net;
										self.data[index]['longs'].balances[day] = balanceLongs;
										break;
									case 2:
										balanceShorts += trades[i].net;
										self.data[index]['shorts'].balances[day] = balanceShorts;
										break;
								}
							}
							self.data[index]['all'].profit += trades[i].profit;
							self.data[index]['all'].loss += trades[i].loss;
							self.data[index]['all'].commission += trades[i].commission;
							self.data[index]['all'].net += trades[i].net;
							self.data[index]['all'].trades++;
							if(trades[i].net > 0) {
								self.data[index]['all'].winners++;
								self.data[index]['all'].averageWinningTrade += trades[i].net
							} else if(trades[i].net < 0) {
								self.data[index]['all'].losers++;
								self.data[index]['all'].averageLosingTrade += trades[i].net
							}
							self.data[index]['all'].averageTimeInMarket += trades[i].closed_at - trades[i].objects[0].created_at;
							nets.all.push(trades[i].net);
							switch(trades[i].type) {
								case 1:
									self.data[index]['longs'].profit += trades[i].profit;
									self.data[index]['longs'].loss += trades[i].loss;
									self.data[index]['longs'].commission += trades[i].commission;
									self.data[index]['longs'].net += trades[i].net;
									self.data[index]['longs'].trades++;
									if(trades[i].net > 0) {
										self.data[index]['longs'].winners++;
										self.data[index]['longs'].averageWinningTrade += trades[i].net
									} else if(trades[i].net < 0) {
										self.data[index]['longs'].losers++;
										self.data[index]['longs'].averageLosingTrade += trades[i].net
									}
									self.data[index]['longs'].averageTimeInMarket += trades[i].closed_at - trades[i].objects[0].created_at;
									nets.longs.push(trades[i].net);
									break;
								case 2:
									self.data[index]['shorts'].profit += trades[i].profit;
									self.data[index]['shorts'].loss += trades[i].loss;
									self.data[index]['shorts'].commission += trades[i].commission;
									self.data[index]['shorts'].net += trades[i].net;
									self.data[index]['shorts'].trades++;
									if(trades[i].net > 0) {
										self.data[index]['shorts'].winners++;
										self.data[index]['shorts'].averageWinningTrade += trades[i].net
									} else if(trades[i].net < 0) {
										self.data[index]['shorts'].losers++;
										self.data[index]['shorts'].averageLosingTrade += trades[i].net
									}
									self.data[index]['shorts'].averageTimeInMarket += trades[i].closed_at - trades[i].objects[0].created_at;
									nets.shorts.push(trades[i].net);
									break;
							}
						}

						self.data[index]['all'].accuracy = self.data[index]['all'].winners * 100 / self.data[index]['all'].trades;
						self.data[index]['longs'].accuracy = self.data[index]['longs'].winners * 100 / self.data[index]['longs'].trades;
						self.data[index]['shorts'].accuracy = self.data[index]['shorts'].winners * 100 / self.data[index]['shorts'].trades;
						self.data[index]['all'].averageTrade = self.data[index]['all'].net / self.data[index]['all'].trades;
						self.data[index]['longs'].averageTrade = self.data[index]['longs'].net / self.data[index]['longs'].trades;
						self.data[index]['shorts'].averageTrade = self.data[index]['shorts'].net / self.data[index]['shorts'].trades;
						if(self.data[index]['all'].winners > 0) {
							self.data[index]['all'].averageWinningTrade /= self.data[index]['all'].winners;
						}
						if(self.data[index]['longs'].winners > 0) {
							self.data[index]['longs'].averageWinningTrade /= self.data[index]['longs'].winners;
						}
						if(self.data[index]['shorts'].winners > 0) {
							self.data[index]['shorts'].averageWinningTrade /= self.data[index]['shorts'].winners;
						}
						if(self.data[index]['all'].losers > 0) {
							self.data[index]['all'].averageLosingTrade = Math.abs(self.data[index]['all'].averageLosingTrade / self.data[index]['all'].losers);
						}
						if(self.data[index]['longs'].losers > 0) {
							self.data[index]['longs'].averageLosingTrade = Math.abs(self.data[index]['longs'].averageLosingTrade / self.data[index]['longs'].losers);
						}
						if(self.data[index]['shorts'].losers > 0) {
							self.data[index]['shorts'].averageLosingTrade = Math.abs(self.data[index]['shorts'].averageLosingTrade / self.data[index]['shorts'].losers);
						}
						if(self.data[index]['all'].averageLosingTrade === 0) {
							self.data[index]['all'].riskRewardRatio = 'N/A';
						} else {
							self.data[index]['all'].riskRewardRatio = self.data[index]['all'].averageWinningTrade / self.data[index]['all'].averageLosingTrade;
						}
						if(self.data[index]['longs'].averageLosingTrade === 0) {
							self.data[index]['longs'].riskRewardRatio = 'N/A';
						} else {
							self.data[index]['longs'].riskRewardRatio = self.data[index]['longs'].averageWinningTrade / self.data[index]['longs'].averageLosingTrade;
						}
						if(self.data[index]['shorts'].averageLosingTrade === 0) {
							self.data[index]['shorts'].riskRewardRatio = 'N/A';
						} else {
							self.data[index]['shorts'].riskRewardRatio = self.data[index]['shorts'].averageWinningTrade / self.data[index]['shorts'].averageLosingTrade;
						}
						if(self.data[index]['all'].trades > 0) {
							self.data[index]['all'].averageTimeInMarket /= self.data[index]['all'].trades;
						}
						if(self.data[index]['longs'].trades > 0) {
							self.data[index]['longs'].averageTimeInMarket /= self.data[index]['longs'].trades;
						}
						if(self.data[index]['shorts'].trades > 0) {
							self.data[index]['shorts'].averageTimeInMarket /= self.data[index]['shorts'].trades;
						}
						self.data[index]['all'].sharpeRatio = self.calculateSharpeRatio(nets.all, self.data[index]['all'].averageTrade);
						self.data[index]['longs'].sharpeRatio = self.calculateSharpeRatio(nets.longs, self.data[index]['longs'].averageTrade);
						self.data[index]['shorts'].sharpeRatio = self.calculateSharpeRatio(nets.shorts, self.data[index]['shorts'].averageTrade);

						self.data[index]['all'].variation = (balance - initialBalance) * 100 / initialBalance;
						self.data[index]['longs'].variation = (balanceLongs - initialBalance) * 100 / initialBalance;
						self.data[index]['shorts'].variation = (balanceShorts - initialBalance) * 100 / initialBalance;

						deferred.resolve(self.data[index]);
					});
				}
			});
			return deferred;
		},

		get: function(index) {
			var self = this;
			if(!this.data[index]) {
				var dateFrom = new Date();
				dateFrom.setDate(1);
				dateFrom.setHours(0, 0, 0, 0);
				var dateTo = new Date();
				dateTo.setDate(1);
				dateTo.setHours(23, 59, 59, 999);
				var dateValues = index.split('-');
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
				var deferred = this.generate(index, dateFrom.getTime(), dateTo.getTime());
				return deferred;
			}
			var deferred = $.Deferred();
			deferred.resolve(this.data[index]);
			return deferred;
		}
	};
})();
