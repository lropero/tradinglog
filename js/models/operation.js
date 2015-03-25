(function() {
	'use strict';

	app.Models.operation = Backbone.Model.extend({
		dao: app.DAOs.operation,
		defaults: {
			account_id: 0,
			amount: 0,
			description: '',
			variation: 0,
			created_at: 0
		},
		validation: {
			amount: {
				gt: 0
			}
		},

		// initialize: function() {
		// 	_.extend(Backbone.Validation.callbacks, {
		// 		valid: function(view, attr, selector) {
		// 			var $input = $('#' + attr);
		// 			$input.removeClass('error');
		// 			$input.parent('div.price').removeClass('error');
		// 		},
		// 		invalid: function(view, attr, error, selector) {
		// 			var $input = $('#' + attr);
		// 			$input.addClass('error');
		// 			$input.parent('div.price').addClass('error');
		// 		}
		// 	});
		// }
	});
})();
