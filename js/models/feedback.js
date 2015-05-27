(function() {
	'use strict';

	app.Models.feedback = Backbone.Model.extend({
		validation: {
			body: {
				required: true
			},
			email: {
				pattern: 'email',
				required: true
			}
		},

		initialize: function() {
			this.listenTo(this, 'validated', function(isValid, model, errors) {
				if(!isValid) {
					$.each(errors, function(index) {
						var $el = $('#' + index);
						$el.addClass('error');
					});
				}
			});
		}
	});
})();
