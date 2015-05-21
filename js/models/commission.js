(function() {
	'use strict';

	app.Models.commission = Backbone.Model.extend({
		validation: {
			commission: {
				min: 0
			}
		},

		initialize: function() {
			this.listenTo(this, 'validated', function(isValid, model, errors) {
				if(!isValid) {
					$.each(errors, function(index) {
						var $el = $('#' + index);
						$el.addClass('error');
						var $price = $el.parent('div.price');
						if($price) {
							$price.addClass('error');
						}
					});
				}
			});
		}
	});
})();
