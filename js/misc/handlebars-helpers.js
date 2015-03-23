(function() {
	'use strict';

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
})();
