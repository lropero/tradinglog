(function() {
	'use strict';

	Handlebars.registerHelper('abs', function(number) {
		return Math.abs(number);
	});

	Handlebars.registerHelper('date', function(timestamp) {
		var today = new Date(1429707600000);
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
	});

	Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
		if(lvalue === rvalue) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});

	Handlebars.registerHelper('groups', function(groups) {
		var list = '';
		for(var i = 0; i < 5; i++) {
			list += '<li class="group';
			if($.inArray(i, groups) > -1) {
				list += ' selected';
			}
			list += '">' + String.fromCharCode(i + 65) + '</li>';
		}
		return list;
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

	Handlebars.registerHelper('map', function(net, max) {
		var abs = Math.abs(net);
		var percentage = accounting.toFixed(100 - parseFloat(Big(abs * 100).div(max).toString()), 2);
		return percentage;
	});

	Handlebars.registerHelper('money', function(money) {
		return accounting.formatMoney(money, '$ ');
	});

	Handlebars.registerHelper('nl2br', function(string) {
		return string.replace(/(\r\n|\n\r|\r|\n)/g, '<br />');
	});

	Handlebars.registerHelper('notequal', function(lvalue, rvalue, options) {
		if(lvalue !== rvalue) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});

	Handlebars.registerHelper('variation', function(variation) {
		return accounting.toFixed(variation, 2) + '%';
	});
})();
