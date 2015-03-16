(function() {
	'use strict';

	app.templateLoader = {
		get: function(name) {
			if(!app.Templates[name]) {
				var date = new Date();
				app.Templates[name] = $.get('js/templates/' + name + '.tpl?' + date.getTime());
			}
			return app.Templates[name];
		}
	};
})();
