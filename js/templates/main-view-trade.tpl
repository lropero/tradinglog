<script type="text/x-handlebars-template" id="main-view-trade-template">
	<ul>
		<li class="wrapper-label">
			<div class="label trade {{#if trade.isLong}}long{{else}}short{{/if}} {{#if trade.isOpen}}open {{/if}}full">
				<div class="ball">
					<div class="icon"></div>
				</div>
				<div class="row">
					<div class="instrument">{{trade.instrument}}</div>
					<div class="net {{#gt trade.net 0}}positive{{else}}negative{{/gt}}">{{#if trade.net}}{{#money trade.net}}{{/money}}{{/if}}</div>
				</div>
				<div class="row">
					<div class="{{#if trade.isOpen}}size-price{{else}}date{{/if}}">{{#if trade.isOpen}}{{trade.sizePrice}}{{else}}{{#date trade.closed_at}}{{/date}}{{/if}}</div>
				</div>
			</div>
		</li>
	</ul>
	<ul class="wrapper-button-default {{#if trade.isOpen}}two{{else}}one{{/if}}-button-default">
		{{#if trade.isOpen}}
			<li class="button-default" data-view="mainAddPosition">Add position</li>
		{{/if}}
		<li class="button-default" data-view="main">Add comment</li>
	</ul>
	<ul>
		{{#each trade.positions}}
			<li class="wrapper-label">
				<div class="label comment {{#gt this.size 0}}buy{{else}}sell{{/gt}}">
					<div class="ball"></div>
					<div class="row">
						<div class="size-price">{{this.sizePrice}}</div>
					</div>
					<div class="row">
						<div class="date">{{#date this.created_at}}{{/date}} - {{#time this.created_at}}{{/time}}</div>
					</div>
				</div>
			</li>
		{{/each}}
	</ul>
</script>
