(function() {
	'use strict';

	app.Models.feedback = Backbone.Model.extend({
		validation: {
			body: {
				required: true
			}
		},

		initialize: function() {
			var self = this;
			this.deferred = $.Deferred();
			
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