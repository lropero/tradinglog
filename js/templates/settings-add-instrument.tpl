<script type="text/x-handlebars-template" id="settings-add-instrument-template">
	<div id="isolate">
		<div class="button-primary" id="done">Done</div>
	</div>
	<div id="complete">
		<div class="box-violet">
			<ul class="wrapper-radiobutton" id="type">
				<li class="group-radiobutton">
					<div class="radiobutton{{#if this.instrument}}{{#equal this.instrument.type 1}} active{{/equal}}{{/if}}{{#unless this.instrument}} active{{/unless}}" data-type="1"></div>
					<span>Future</span>
				</li>
				<li class="group-radiobutton">
					<div class="radiobutton{{#if this.instrument}}{{#equal this.instrument.type 2}} active{{/equal}}{{/if}}" data-type="2"></div>
					<span>Currency</span>
				</li>
				<li class="group-radiobutton">
					<div class="radiobutton{{#if this.instrument}}{{#equal this.instrument.type 3}} active{{/equal}}{{/if}}" data-type="3"></div>
					<span>Stock</span>
				</li>
			</ul>
			<form>
				<div class="wrapper-input isolate">
					<input id="name" type="text" placeholder="Instrument name" {{#if this.instrument}}value="{{this.instrument.name}}" {{/if}}disabled />
					<span class="help-block">For example, 'E-mini S&P 500' or 'ES'. You can use any name as long as it lets you identify which trading vehicle refers to.</span>
				</div>
				<div class="wrapper-input isolate" id="form-point_value"{{#if this.instrument}}{{#gt this.instrument.type 2}} style="display: none;"{{/gt}}{{/if}}>
					<div class="input-icon price">
						<input id="point_value" type="number" placeholder="Point value" {{#if this.instrument}}value="{{this.instrument.point_value}}" {{/if}}disabled />
					</div>
					<span class="help-block">A point is the smallest possible price change on the left side of the decimal point (i.e. the integer part) and its value is the difference in money that is affected by this movement. For example, a point variation in the ES (four 0.25 movements) represents a gain or loss of $ 50.</span>
				</div>
				<div class="wrapper-input isolate" id="form-broker_commission"{{#if this.instrument}}{{#gt this.instrument.type 1}} style="display: none;"{{/gt}}{{/if}}>
					<div class="input-icon price">
						<input id="commission" type="number" placeholder="Broker commission" {{#if this.instrument}}value="{{this.instrument.commission}}" {{/if}}disabled />
					</div>
					<span class="help-block">This is a round-trip commission (charged once per buy/sell match). You'll be able to manually edit the commission by swiping the trade to the left once it's closed.</span>
				</div>
				<span class="text-note" id="text-currency"{{#if this.instrument}}{{#notequal this.instrument.type 2}} style="display: none;"{{/notequal}}{{/if}}{{#unless this.instrument}} style="display: none;"{{/unless}}>Note: Since Forex markets are not exchange-based, such instruments does not have commissions.</span>
				<span class="text-note" id="text-stock"{{#if this.instrument}}{{#notequal this.instrument.type 3}} style="display: none;"{{/notequal}}{{/if}}{{#unless this.instrument}} style="display: none;"{{/unless}}>Note: Since there are many commission schemas for stocks (flat rate, percentage, etc.), such trades will display an alert icon after you close them and will require you to manually edit the commission by swiping the closed trade to the left. We strongly recommend that you verify broker's reports periodically in order to keep your numbers and stats accurate.</span>
			</form>
		</div>
	</div>
</script>
