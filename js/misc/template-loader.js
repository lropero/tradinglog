(function() {
	'use strict';

	app.templateLoader = {
		// Recursively pre-load all the templates for the app.
        // This implementation should be changed in a production environment:
        // All the template files should be concatenated in a single file.
        loadTemplates: function (callback) {
            var that = this;
            var cachebuster = Math.round(new Date().getTime() / 1000);
            $.get('tmp/output.min.html', function (data) {
            	console.log("loaded");
                that.templates = data;
                that.$templates = jQuery(data);
                jQuery("#preload").append(that.$templates);
                callback.apply();
            });
        },

        // Get template by name from hash of preloaded templates
        get: function (name) {
          var $template = jQuery("#" + name + "-template");
          return $template.html();
        },
		/*get: function(name) {
			if(!app.Templates[name]) {
				var date = new Date();
				app.Templates[name] = $.get('js/templates/' + name + '.tpl?' + date.getTime());
			}
			return app.Templates[name];
		}*/
	};
})();
