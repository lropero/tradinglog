(function() {
	'use strict';

	Handlebars.registerHelper('date', function(date) {
		var today = new Date();
		today.setHours(0, 0, 0, 0);
		var time = today.getTime();
		if(date > time) {
			return 'Today';
		} else if(date > time - (24 * 60 * 60 * 1000)) {
			return 'Yesterday';
		} else {
			var week = new Date(today.getTime());
			week.setDate(today.getDate() - 6);
			if(date > week.getTime()) {
				switch((new Date(date)).getDay()) {
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
				var then = new Date(date);
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
				var string = month + ' ' + date + (date === 1 ? 'st' : (date === 2 ? 'nd' : (date === 3 ? 'rd' : 'th'))) + ', ' + then.getFullYear();
				return string;
			}
		}
	});

	Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
		if(lvalue === rvalue) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});

	Handlebars.registerHelper('gt', function(lvalue, rvalue, options) {
		if(lvalue > rvalue) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});

	Handlebars.registerHelper('lt', function(lvalue, rvalue, options) {
		if(lvalue < rvalue) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});

	Handlebars.registerHelper('money', function(money) {
		return accounting.formatMoney(money, '$ ');
	});
})();
