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
					<div class="{{#if trade.isOpen}}size-price{{else}}date{{/if}}">{{#if trade.isOpen}}{{trade.sizePrice}}{{else}}date{{/if}}</div>
				</div>
			</div>
		</li>
	</ul>
</script>
