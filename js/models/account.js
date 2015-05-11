(function() {
	'use strict';

	app.Models.account = Backbone.Model.extend({
		dao: app.DAOs.account,
		defaults: {
			name: '',
			balance: 0,
			is_active: 0
		},
		validation: {
			name: {
				required: true
			},
			balance: {
				gt: 0
			}
		},

		initialize: function() {
			this.listenTo(this, 'validated', function(isValid, model, errors) {
				if(!isValid) {
					$.each(errors, function(index, error) {
						var $el = $('#' + index);
						$el.addClass('error');
						var $price = $el.parent('div.price');
						if($price) {
							$price.addClass('error');
						}
					});
				}
			});
		},

		delete: function() {
			this.destroy();
		}
	});
})();
