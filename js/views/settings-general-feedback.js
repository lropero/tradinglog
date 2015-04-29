(function() {
	'use strict';

	app.Views.settingsGeneralFeedback = Backbone.View.extend({
		state: 1, 
		el: 'section#settings section#content',
		events: {
			"tap .button-feedback": "switchState",
			"tap #submit": "submit",
			'tap div#done': 'combine',
			'tap textarea': 'isolate'
		},

		initialize: function () {
			var self = this;
			app.templateLoader.get('settings-general-feedback').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
				self.$buttons = $("li.button-feedback");
				self.$textarea = $(".wrapper-comment textarea");
			});
		},

		clear: function () {
			this.$buttons.removeClass("active");
		},

		destroy: function () {
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

		render: function () {
			app.trigger('change', 'settings-general-feedback');
			this.$el.html(this.template());
			return this;
		},

		switchState: function (e) {
			var $clicked = $(e.target);
			this.state = $clicked.hasClass("happy") ? 1 : 0;
			this.clear();
			$clicked.addClass("active");
		},

		submit: function () {
			console.log("submit");
			//submit form
			var self = this;
			// feedback@tradinlog.com
			var feedback = new app.Models.feedback({
				state: self.state,
				body: self.$textarea.val()
			});

			feedback.validate();
			if (feedback.isValid()) {
				// send
				console.log("send this motherfucker");
				console.dir(feedback.toJSON());
			} else {
				this.$textarea.addClass("error");
				console.log("error");
			}
		}
	});
})();
