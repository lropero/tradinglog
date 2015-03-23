<script type="text/x-handlebars-template" id="main-template">
	<section id="content">
		<ul>
			{{#each trades}}
				<li class="wrapper-label" style="left: -80px; width: 400px;">
					<div class="label trade {{#if this.isLong}}long{{else}}short{{/if}} {{#if this.isOpen}}open {{/if}}active-swipe one-button-swipe" style="left: 80px; width: 320px;">
						<div class="ball">
							{{#if this.comments}}
								<div class="globe-comments">{{ this.comments }}</div>
							{{/if}}
							<div class="icon"></div>
						</div>
						<div class="row">
							<div class="instrument">{{ this.instrument }}</div>
							<div class="net {{#gt this.net 0}}positive{{else}}negative{{/gt}}">$ {{ this.net }}</div>
						</div>
						<div class="row">
							<div class="{{#if this.isOpen}}size-price{{else}}date{{/if}}">2 @ 1,853.50</div>
						</div>
					</div>
					<div class="wrapper-swipe" style="width: 320px;">
						<div class="swipe">
							<ul>
								<li class="button-swipe {{#if this.isOpen}}delete{{else}}commission{{/if}}"></li>
							</ul>
						</div>
					</div>
				</li>
			{{/each}}
		</ul>
	</section>
</script>
