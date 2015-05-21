<div class="box-violet" id="isolate">
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
				<span>Stock</span>
			</li>
			<li class="group-radiobutton">
				<div class="radiobutton{{#if this.instrument}}{{#equal this.instrument.type 3}} active{{/equal}}{{/if}}" data-type="3"></div>
				<span>Other</span>
			</li>
		</ul>
		<form>
			<div class="wrapper-input isolate">
				<input id="name" type="text" placeholder="Instrument name" {{#if this.instrument}}value="{{this.instrument.name}}" {{/if}}disabled />
				<span class="help-block"><span class="type-1 type-2">For example, <span class="type-1">'E-mini S&P 500' or 'ES'</span><span class="type-2">'Apple' or 'AAPL'</span>. </span>You can use any name as long as it lets you identify which trading vehicle refers to.</span>
			</div>
			<div class="wrapper-input isolate type-1 type-3">
				<div class="input-icon price">
					<input id="point_value" type="number" placeholder="Point value" {{#if this.instrument}}value="{{this.instrument.point_value}}" {{/if}}disabled />
				</div>
				<span class="help-block">A point is the smallest possible price change on the left side of the decimal point (i.e. the integer part) and its value is the difference in money that is affected by this movement.<span class="type-1"> For example, a point variation in the ES (four 0.25 movements) represents a gain or loss of $50.</span><span class="type-3"> Defaults to $1.</span></span>
			</div>
			<div class="wrapper-input isolate type-1 type-3">
				<div class="input-icon price">
					<input id="commission" type="number" placeholder="Commission" {{#if this.instrument}}value="{{this.instrument.commission}}" {{/if}}disabled />
				</div>
				<span class="help-block">This is a round-trip commission (charged once per buy/sell match). You'll be able to manually edit the commission by swiping the trade to the left once it's closed.<span class="type-3"> Defaults to $0.</span></span>
			</div>
			<div class="wrapper-checkbox type-3">
				<div class="checkbox-tap">
					<div class="checkbox{{#if this.instrument}}{{#equal this.instrument.alert 1}} active{{/equal}}{{/if}}{{#unless this.instrument}} active{{/unless}}" id="alert"></div>
					<span>Commission alert icon <i class="ion-alert-circled"></i></span>
				</div>
				<span class="help-block">We strongly recommend that you verify broker's reports periodically in order to keep your numbers and stats accurate. An alert icon <i class="ion-alert-circled"></i> will be shown in every closed trade for this instrument to remind you of doing so. The icon will disappear after you manually edit the commission by swiping the trade to the left.</span>
			</div>
			<div class="text-note type-2"><b>Point value</b>: Stock's point value is always $1.</div>
			<div class="text-note type-2"><b>Commission</b>: Since there are many commission schemas for stocks (flat rate, percentage, etc.), stock's commission is always $0 and such trades will display an alert icon <i class="ion-alert-circled"></i> after you close them to remind you of manually editing the commission by swiping the closed trade to the left. We strongly recommend that you verify broker's reports periodically in order to keep your numbers and stats accurate.</div>
		</form>
	</div>
</div>
