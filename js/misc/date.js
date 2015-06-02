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

		getString: function(name) {
			var string;
			if(name.indexOf('#') > -1) {
				var split = name.split('#');
				var fromDateValues = split[0].split('-');
				var toDateValues = split[1].split('-');
				var month = this.getMonthString(parseInt(fromDateValues[1], 10), true) + '.';
				var digit = fromDateValues[2] % 10;
				string = month + ' ' + fromDateValues[2] + (digit === 1 ? 'st' : (digit === 2 ? 'nd' : (digit === 3 ? 'rd' : 'th'))) + ', ' + fromDateValues[0] + ' - ';
				month = this.getMonthString(parseInt(toDateValues[1], 10), true) + '.';
				digit = toDateValues[2] % 10;
				string += month + ' ' + toDateValues[2] + (digit === 1 ? 'st' : (digit === 2 ? 'nd' : (digit === 3 ? 'rd' : 'th'))) + ', ' + toDateValues[0];
			} else {
				var dateValues = name.split('-');
				switch(dateValues.length) {
					case 2:
						string = this.getMonthString(parseInt(dateValues[1], 10)) + ' ' + dateValues[0];
						break;
					case 3:
						var month = this.getMonthString(parseInt(dateValues[1], 10), true) + '.';
						var digit = dateValues[2] % 10;
						string = month + ' ' + dateValues[2] + (digit === 1 ? 'st' : (digit === 2 ? 'nd' : (digit === 3 ? 'rd' : 'th'))) + ', ' + dateValues[0] + ' - ';
						var date = new Date(dateValues[0], dateValues[1], dateValues[2], 0, 0, 0, 0);
						date.setDate(date.getDate() + 6);
						var today = new Date();
						if(date.getTime() > today.getTime()) {
							string += 'Today';
						} else {
							var month = this.getMonthString(date.getMonth(), true) + '.';
							var digit = date.getDate() % 10;
							string += month + ' ' + date.getDate() + (digit === 1 ? 'st' : (digit === 2 ? 'nd' : (digit === 3 ? 'rd' : 'th'))) + ', ' + date.getFullYear();
						}
						break;
				}
			}
			return string;
		},

		toDate: function(timestamp) {
			var today = new Date();
			today.setHours(0, 0, 0, 0);
			var time = today.getTime();
			if(timestamp > time) {
				return 'Today';
			} else if(timestamp > time - (24 * 60 * 60 * 1000)) {
				return 'Yesterday';
			} else {
				var week = new Date(today.getTime());
				week.setDate(today.getDate() - 6);
				if(timestamp > week.getTime()) {
					switch((new Date(timestamp)).getDay()) {
						case 0:
							return 'Sunday';
							break;
						case 1:
							return 'Monday';
							break;
						case 2:
							return 'Tuesday';
							break;
						case 3:
							return 'Wednesday';
							break;
						case 4:
							return 'Thursday';
							break;
						case 5:
							return 'Friday';
							break;
						case 6:
							return 'Saturday';
							break;
					}
				} else {
					var then = new Date(timestamp);
					var month = '';
					switch(then.getMonth()) {
						case 0:
							month = 'Jan';
							break;
						case 1:
							month = 'Feb';
							break;
						case 2:
							month = 'Mar';
							break;
						case 3:
							month = 'Apr';
							break;
						case 4:
							month = 'May';
							break;
						case 5:
							month = 'Jun';
							break;
						case 6:
							month = 'Jul';
							break;
						case 7:
							month = 'Aug';
							break;
						case 8:
							month = 'Sep';
							break;
						case 9:
							month = 'Oct';
							break;
						case 10:
							month = 'Nov';
							break;
						case 11:
							month = 'Dec';
							break;
					}
					var date = then.getDate();
					var digit = date % 10;
					var string = month + '. ' + date + (digit === 1 ? 'st' : (digit === 2 ? 'nd' : (digit === 3 ? 'rd' : 'th'))) + ', ' + then.getFullYear();
					return string;
				}
			}
		},

		toTime: function(timestamp) {
			var then = new Date(timestamp);
			var hours = then.getHours();
			var minutes = then.getMinutes();
			if(minutes < 10) {
				minutes = '0' + minutes;
			}
			var meridiem = 'am';
			if(hours > 12) {
				hours -= 12;
				meridiem = 'pm';
			}
			return hours + ':' + minutes + meridiem;
		}
	};
})();
