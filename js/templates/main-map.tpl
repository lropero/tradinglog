<section id="content">
	<ul id="map">
		{{#each trades}}
			<li class="wrapper-label">
				<div class="label trade {{#if this.isLong}}long{{else}}short{{/if}} {{#gt this.net 0}}positive{{else}}{{#lt this.net 0}}negative{{else}}zero{{/lt}}{{/gt}}">
					<div class="ball">
						<div class="icon"></div>
					</div>
					<div class="row">
						<div class="instrument">{{this.instrument}}</div>
						<div class="net {{#gt this.net 0}}positive{{else}}{{#lt this.net 0}}negative{{else}}zero{{/lt}}{{/gt}}">{{#money this.net}}{{/money}}</div>
					</div>
					<div class="percentage" style="-webkit-animation-delay: {{multiply @index 0.02}}s;">
						<div class="bar-percentage" style="width: {{#map this.net ../this.max}}{{/map}}%;"></div>
					</div>
				</div>
			</li>
		{{/each}}
	</ul>
</section>
