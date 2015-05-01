(function() {
	'use strict';

	app.date = {
		getAverageTimeInMarketString: function(time) {
			time = Math.floor(time / 1000);
			var days = Math.floor(time / 86400);
			time -= days * 86400;
			var hours = Math.floor(time / 3600);
			time -= hours * 3600;
			var minutes = Math.floor(time / 60);
			var string = '';
			if(days > 0) {
				string = days + 'd ' + hours + 'h ';
			} else if(hours > 0) {
				string = hours + 'h ';
			}
			string += minutes + 'm';
			return string;
		},

		getMonthString: function(month, short) {
			var string;
			switch(month) {
				case 0:
					string = 'January';
					break;
				case 1:
					string = 'February';
					break;
				case 2:
					string = 'March';
					break;
				case 3:
					string = 'April';
					break;
				case 4:
					string = 'May';
					break;
				case 5:
					string = 'June';
					break;
				case 6:
					string = 'July';
					break;
				case 7:
					string = 'August';
					break;
				case 8:
					string = 'September';
					break;
				case 9:
					string = 'October';
					break;
				case 10:
					string = 'November';
					break;
				case 11:
					string = 'December';
					break;
			}
			if(short) {
				string = string.slice(0, 3);
			}
			return string;
		},

		getString: function(index) {
			var string;
			var dateValues = index.split('-');
			switch(dateValues.length) {
				case 2:
					string = this.getMonthString(parseInt(dateValues[1], 10)) + ' ' + dateValues[0];
					break;
				case 3:
					var month = this.getMonthString(parseInt(dateValues[1], 10), true);
					var digit = dateValues[2] % 10;
					string = month + ' ' + dateValues[2] + (digit === 1 ? 'st' : (digit === 2 ? 'nd' : (digit === 3 ? 'rd' : 'th'))) + ', ' + dateValues[0] + ' - ';
					var date = new Date(dateValues[0] + '-' + (parseInt(dateValues[1], 10) + 1) + '-' + dateValues[2]);
					date.setDate(date.getDate() + 6);
					var today = new Date();
					if(date.getTime() > today.getTime()) {
						string += 'Today';
					} else {
						var month = this.getMonthString(date.getMonth(), true);
						var digit = date.getDate() % 10;
						string += month + ' ' + date.getDate() + (digit === 1 ? 'st' : (digit === 2 ? 'nd' : (digit === 3 ? 'rd' : 'th'))) + ', ' + date.getFullYear();
					}
					break;
			}
			return string;
		}
	};
})();
