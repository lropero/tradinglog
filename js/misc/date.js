(function() {
	'use strict';

	app.date = {
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

		getString: function(period, date) {
			var string;
			switch(period) {
				case 'weekly':
					var month = this.getMonthString(date.getMonth(), true);
					var digit = date.getDate() % 10;
					string = month + ' ' + date.getDate() + (digit === 1 ? 'st' : (digit === 2 ? 'nd' : (digit === 3 ? 'rd' : 'th'))) + ', ' + date.getFullYear();
					string += ' - '
					date.setDate(date.getDate() + 6);
					var today = new Date();
					if(date.getTime() > today.getTime()) {
						string += 'Today';
					} else {
						var month = this.getMonthString(date.getMonth(), true);
						var digit = date.getDate() % 10;
						string += month + ' ' + date.getDate() + (digit === 1 ? 'st' : (digit === 2 ? 'nd' : (digit === 3 ? 'rd' : 'th'))) + ', ' + date.getFullYear();
					}
					date.setDate(date.getDate() - 6);
					break;
				case 'monthly':
					string = this.getMonthString(date.getMonth());
					string += ' ' + date.getFullYear();
					break;
			}
			return string;
		}
	};
})();
