(function() {
	'use strict';

	app.stats = {
		weekly: {
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

		monthly: {
			profit: Math.floor(Math.random() * 500),
			loss: Math.floor(Math.random() * 500),
			gross: 500,
			commission: Math.floor(Math.random() * 100),
			net: 500,
			variation: 500,
			trades: 500,
			winners: 500,
			losers: 500,
			accuracy: 500,
			averageTimeInMarket: 500,
			averageTrade: 500,
			averageWinningTrade: 500,
			averageLosingTrade: 500,
			riskRewardRatio: 500,
			sharpeRatio: 500
		},

		generate: function(trades) {
			for(var i = 0; i < trades.length; i++) {
				console.log('pepe');
			}
		},

		update: function(period) {
			switch(period) {
				case 'weekly':
						var date = new Date();
						date.setDate(date.getDate() - date.getDay());
						date.setHours(0, 0, 0, 0);
						var weekStart = date.getTime();
					break;
				case 'monthly':
						var date = new Date();
						date.setDate(1);
						date.setHours(0, 0, 0, 0);
						var monthStart = date.getTime();
					break;
			}
		}
	};
})();
