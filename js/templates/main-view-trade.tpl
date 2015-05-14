<div id="loading"><span></span></div>
<div id="top">
	<ul>
		<li class="wrapper-label">
			<div class="label trade {{#if trade.isLong}}long{{else}}short{{/if}} {{#if trade.isOpen}}open {{/if}}full">
				<div class="ball">
					{{#if trade.edit_commission}}
						<div class="globe-commission"></div>
					{{/if}}
					<div class="icon"></div>
				</div>
				<div class="row">
					<div class="instrument">{{trade.instrument}}</div>
					<div class="net {{#gt trade.net 0}}positive{{else}}negative{{/gt}}">{{#unless trade.isOpen}}{{#money trade.net}}{{/money}}{{/unless}}</div>
				</div>
				<div class="row">
					<div class="{{#if trade.isOpen}}size-price{{else}}date{{/if}}">{{#if trade.isOpen}}{{trade.sizePrice}}{{else}}{{#date trade.closed_at}}{{/date}}{{/if}}</div>
					{{#unless trade.isOpen}}
						<div class="variation">{{#variation trade.variation}}{{/variation}}</div>
					{{/unless}}
				</div>
			</div>
		</li>
	</ul>
	<ul class="wrapper-button-default {{#if trade.isOpen}}two{{else}}one{{/if}}-button-default">
		{{#if trade.isOpen}}
			<li class="button-default" data-view="mainAddPosition">Add position</li>
		{{/if}}
		<li class="button-default" data-view="mainAddComment">Add comment</li>
	</ul>
</div>
<div id="loading" style="clear:both;">
	<span></span>
</div>