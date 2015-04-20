(function() {
	'use strict';

	app.Views.statsNumbers = Backbone.View.extend({
		el: 'section#main-stats-friends section#content',

		initialize: function() {
			var self = this;
			app.templateLoader.get('stats-numbers').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},

		render: function() {
			app.trigger('change', 'stats-numbers');
			this.$el.html(this.template());
			var ctx = $('#doughnut').get(0).getContext('2d');
			var data = [
				{
					value: 300,
					color:"#ff3b30",
					label: "Red"
				},
				{
					value: 50,
					color: "#4bd763",
					label: "Green"
				},
				{
					value: 100,
					color: "#FDB45C",
					label: "Yellow"
				}
			];
			var options = {
				animationEasing: 'easeOutElastic',
				animationSteps: 50,
				segmentStrokeColor: '#4020d0',
				percentageInnerCutout: 60,
				segmentStrokeWidth: 5,
				legendTemplate : "<ul><% for(var i = 0; i < segments.length; i++) { %><li><div class=\"comm-how\"><%=segments[i].value%>%</div><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
			};
			var doughnut = new Chart(ctx).Doughnut(data, options);
			// $('#legend').html(doughnut.generateLegend());
			return this;
		}
	});
})();
