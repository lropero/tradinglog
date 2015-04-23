(function() {
	'use strict';

	app.stats = {
		weekly: {
			all: {
				profit: 50,
				loss: 50,
				gross: 50,
				commission: 50,
				net: 50,
				variation: 50,
				trades: 50,
				winners: 50,
				losers: 50,
				accuracy: 50,
				averageTimeInMarket: 50,
				averageTrade: 50,
				averageWinningTrade: 50,
				averageLosingTrade: 50,
				riskRewardRatio: 50,
				sharpeRatio: 50
			},

			long: {
				profit: 25,
				loss: 25,
				gross: 25,
				commission: 25,
				net: 25,
				variation: 25,
				trades: 25,
				winners: 25,
				losers: 25,
				accuracy: 25,
				averageTimeInMarket: 25,
				averageTrade: 25,
				averageWinningTrade: 25,
				averageLosingTrade: 25,
				riskRewardRatio: 25,
				sharpeRatio: 25
			},

			short: {
				profit: 25,
				loss: 25,
				gross: 25,
				commission: 25,
				net: 25,
				variation: 25,
				trades: 25,
				winners: 25,
				losers: 25,
				accuracy: 25,
				averageTimeInMarket: 25,
				averageTrade: 25,
				averageWinningTrade: 25,
				averageLosingTrade: 25,
				riskRewardRatio: 25,
				sharpeRatio: 25
			}
		},

		monthly: {
			all: {
				profit: Math.floor(Math.random() * 500),
				loss: Math.floor(Math.random() * 500),
				gross: 50,
				commission: Math.floor(Math.random() * 100),
				net: 50,
				variation: 50,
				trades: 50,
				winners: 50,
				losers: 50,
				accuracy: 50,
				averageTimeInMarket: 50,
				averageTrade: 50,
				averageWinningTrade: 50,
				averageLosingTrade: 50,
				riskRewardRatio: 50,
				sharpeRatio: 50
			},

			long: {
				profit: 250,
				loss: 250,
				gross: 250,
				commission: 250,
				net: 250,
				variation: 250,
				trades: 250,
				winners: 250,
				losers: 250,
				accuracy: 250,
				averageTimeInMarket: 250,
				averageTrade: 250,
				averageWinningTrade: 250,
				averageLosingTrade: 250,
				riskRewardRatio: 250,
				sharpeRatio: 250
			},

			short: {
				profit: 250,
				loss: 250,
				gross: 250,
				commission: 250,
				net: 250,
				variation: 250,
				trades: 250,
				winners: 250,
				losers: 250,
				accuracy: 250,
				averageTimeInMarket: 250,
				averageTrade: 250,
				averageWinningTrade: 250,
				averageLosingTrade: 250,
				riskRewardRatio: 250,
				sharpeRatio: 250
			}
		},

		generate: function(trades) {
			for(var i = 0; i < trades.length; i++) {
				console.log('pepe');
			}
		},

		update: function(period) {
			if(!period) {
				var date = new Date();
				date.setDate(date.getDate() - date.getDay());
				date.setHours(0, 0, 0, 0);
				var weekStart = date.getTime();
				// this.generate('weekly');
				console.log(weekStart);
				var date = new Date();
				date.setDate(1);
				date.setHours(0, 0, 0, 0);
				var monthStart = date.getTime();
				console.log(monthStart);
			} else {
				console.log(perdiod);
			}
		}
	};
})();
