(function() {
	'use strict';

	app.stats = {
		data: {},

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
								profit: 0,
								loss: 0,
								commission: 0,
								net: 0,
								trades: 0,
								winners: 0,
								losers: 0,
								accuracy: 0,
								averageTimeInMarket: 500,
								averageTrade: 500,
								averageWinningTrade: 500,
								averageLosingTrade: 500,
								riskRewardRatio: 500,
								sharpeRatio: 500,
								variation: 500
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
								averageTimeInMarket: 250,
								averageTrade: 250,
								averageWinningTrade: 250,
								averageLosingTrade: 250,
								riskRewardRatio: 250,
								sharpeRatio: 250,
								variation: 250
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
								averageTimeInMarket: 250,
								averageTrade: 250,
								averageWinningTrade: 250,
								averageLosingTrade: 250,
								riskRewardRatio: 250,
								sharpeRatio: 250,
								variation: 250
							},

							balances: {
								1: 100,
								2: 200,
								3: 300,
								4: 250,
								5: 320
							}
						};

						for(var i = 0; i < trades.length; i++) {
							self.data[index]['all'].profit += trades[i].profit;
							self.data[index]['all'].loss += trades[i].loss;
							self.data[index]['all'].commission += trades[i].commission;
							self.data[index]['all'].net += trades[i].net;
							self.data[index]['all'].trades++;
							if(trades[i].net > 0) {
								self.data[index]['all'].winners++;
							} else if(trades[i].net < 0) {
								self.data[index]['all'].losers++;
							}
							switch(trades[i].type) {
								case 1:
									self.data[index]['longs'].profit += trades[i].profit;
									self.data[index]['longs'].loss += trades[i].loss;
									self.data[index]['longs'].commission += trades[i].commission;
									self.data[index]['longs'].net += trades[i].net;
									self.data[index]['longs'].trades++;
									if(trades[i].net > 0) {
										self.data[index]['longs'].winners++;
									} else if(trades[i].net < 0) {
										self.data[index]['longs'].losers++;
									}
									break;
								case 2:
									self.data[index]['shorts'].profit += trades[i].profit;
									self.data[index]['shorts'].loss += trades[i].loss;
									self.data[index]['shorts'].commission += trades[i].commission;
									self.data[index]['shorts'].net += trades[i].net;
									self.data[index]['shorts'].trades++;
									if(trades[i].net > 0) {
										self.data[index]['shorts'].winners++;
									} else if(trades[i].net < 0) {
										self.data[index]['shorts'].losers++;
									}
									break;
							}
						}

						self.data[index]['all'].accuracy = self.data[index]['all'].winners * 100 / self.data[index]['all'].trades;
						self.data[index]['longs'].accuracy = self.data[index]['longs'].winners * 100 / self.data[index]['longs'].trades;
						self.data[index]['shorts'].accuracy = self.data[index]['shorts'].winners * 100 / self.data[index]['shorts'].trades;

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
