(function() {
	'use strict';

	app.Views.main = Backbone.View.extend({
		initialize: function() {
			var self = this;
			app.Helpers.templateLoader.get('main', function(template) {
				self.template = Handlebars.compile(template);
				self.render();
				self.swipe();
			});
		},
		render: function() {
			app.Helpers.headerNavigation.update({
				'left': {
					'icon': 'f203',
					'view': 'mainMap'
				},
				'right': {
					'icon': 'f218',
					'view': 'mainAdd'
				}
			});
			this.$el.html(this.template());
			$('#main-stats-friends').empty().append(this.$el);
			return this;
		},
		swipe: function() {
			$('.active-swipe').pep({
				'axis': 'x',
				'constrainTo': 'parent',
				'useCSSTranslation': false,
				start: function() {
					$(this.el).removeClass('swiped');
					$.pep.restore();
				},
				revertIf: function() {
					var $el = $(this.el);
					if($el.position().left > 0) {
						return true;
					}
					$el.addClass('swiped');
					return false;
				}
			});
		}
	});
})();
