(function() {
	'use strict';

	app.Models.custom = Backbone.Model.extend({
		validation: {
			from: {
				required: true
			},
			to: {
				required: true
			}
		},

		initialize: function() {
			this.listenTo(this, 'validated', function(isValid, model, errors) {
				if(!isValid) {
					$.each(errors, function(index, error) {
						var $el = $('#' + index);
						$el.addClass('error');
					});
				}
			});
		}
	});
})();
