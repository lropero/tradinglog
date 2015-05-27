(function() {
	'use strict';

	app.Views.settingsGeneralFeedback = Backbone.View.extend({
		el: 'section#settings section#content',
		events: {
			'tap div#done': 'combine',
			'tap input, textarea': 'isolate',
			'tap ul.wrapper-feedback li:not(.active)': 'radio'
		},

		initialize: function() {
			var self = this;
			app.submit = function() {
				self.submit();
			}
			this.template = Handlebars.compile(app.templateLoader.get('settings-general-feedback'));
			this.render();
		},

		render: function() {
			app.trigger('change', 'settings-general-feedback');
			this.$el.html(this.template());
			return this;
		},

		destroy: function() {
			delete app.submit;
			this.undelegateEvents();
		},

		combine: function(e) {
			e.preventDefault();
			app.combine();
		},

		isolate: function(e) {
			e.preventDefault();
			app.isolate(e);
		},

		radio: function(e) {
			e.preventDefault();
			var $target = $(e.currentTarget);
			$('ul.wrapper-feedback').find('li.active').removeClass('active');
			$target.addClass('active');
		},

		submit: function() {
			var feeling = $('ul.wrapper-feedback').find('li.active').data('type');
			var body = this.$el.find('textarea#body').val().trim();
			var email = this.$el.find('input#email').val().trim();

			var feedback = new app.Models.feedback();
			feedback.set({
				body: body,
				email: email
			});
			feedback.validate();
			if(feedback.isValid()) {
				$('header button').hide();
				$('div#thank-you').css('display', 'block');
				// SEND
			}
		}
	});
})();
