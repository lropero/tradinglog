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
			var self = this;
			this.deferred = $.Deferred();
			if(!this.isNew()) {
				this.deferred.resolve();
			} else {
				this.listenTo(this, 'validated', function(isValid, model, errors) {
					if(!isValid) {
						$.each(errors, function(index, error) {
							var $el = $('#' + index);
							$el.addClass('error');
						});
					}
				});
			}
		},

		delete: function(callback) {
			var self = this;
			this.deferred.done(function() {
				self.destroy({
					success: function() {
						callback();
					}
				});
			});
		}
	});
})();
