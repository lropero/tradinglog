(function() {
	'use strict';

	app.Views.main = Backbone.View.extend({
		events: {
			'click div.operation': 'viewOperation',
			'click div.trade:not(.operation):not(.swiped)': 'viewTrade'
		},
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
				'shouldPreventDefault': false,
				'useCSSTranslation': false,
				rest: function() {
					var $el = $(this.el);
					if($el.hasClass('swiped') && $el.position().left > 0) {
						$el.removeClass('swiped');
					}
				},
				revertIf: function() {
					var $el = $(this.el);
					if($el.position().left > 0) {
						return true;
					}
					$el.addClass('swiped');
					return false;
				},
				start: function() {
					$(this.el).removeClass('swiped');
					$.pep.restore();
				},
				stop: function(e) {
					e.preventDefault();
				}
			});
		},
		viewOperation: function() {
			this.content = new app.Views['mainViewOperation']();
		},
		viewTrade: function() {
			this.content = new app.Views['mainViewTrade']();
		}
	});
})();
