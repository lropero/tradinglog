(function() {
	'use strict';

	app.Models.comment = Backbone.Model.extend({
		dao: app.DAOs.comment,
		validation: {
			body: {
				required: true
			}
		},

		initialize: function() {
			if(this.isNew()) {
				this.listenTo(this, 'validated', function(isValid, model, errors) {
					if(!isValid) {
						$.each(errors, function(index) {
							var $el = $('#' + index);
							$el.addClass('error');
						});
					}
				});
			}
		},

		delete: function(callback) {
			this.destroy({
				success: function() {
					callback();
				}
			});
		}
	});
})();
