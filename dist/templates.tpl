<script type="text/x-handlebars-template" id="footer-template"><bar class="tab">
	<a class="item active" data-view="main"><span class="icon ion-home"></span></a>
	<a class="item" data-view="stats"><span class="icon ion-stats-bars"></span></a>
	<a class="item" data-view="friends"><span class="icon ion-ios-people"></span></a>
	<a class="item" data-view="settings"><span class="icon ion-ios-gear"></span></a>
</bar>
</script>
<script type="text/x-handlebars-template" id="friends-connect-template"><div class="content">
	<div class="button-primary twitter" id="button-help"><i class="ion-social-twitter"></i> Connect with Twitter</div>
</div>
</script>
<script type="text/x-handlebars-template" id="friends-template"><section id="content">
	<img src="{{this.avatar}}" />{{this.name}} ({{this.alias}})
</section>
</script>
<script type="text/x-handlebars-template" id="header-template"><bar class="navigation">
	<button class="left" id="button-left"></button>
	<div class="logo"><div onclick="if($('section#settings').is(':hidden') && typeof app.view.addRandomTrade === 'function') { $('header button').hide(); app.view.addRandomTrade(); }" style="height: 100%; margin: auto; width: 20%;">&nbsp;</div></div>
	<button class="right" id="button-right"></button>
</bar>
</script>
<script type="text/x-handlebars-template" id="layout-template"><header></header>
<div id="drag"></div>
<section id="main-stats-friends"></section>
<section id="settings"></section>
<footer></footer>
</script>
<script type="text/x-handlebars-template" id="main-add-comment-template"><div id="isolate">
	<div class="button-primary" id="done">Done</div>
</div>
<div id="complete">
	<form>
		<div class="wrapper-comment isolate">
			<textarea id="body" rows="5" placeholder="Comment" disabled></textarea>
			<span class="help-block">Comment in which you can describe anything related to this trade.</span>
		</div>
	</form>
</div>
</script>
<script type="text/x-handlebars-template" id="main-add-operation-template"><div id="isolate">
	<div class="button-primary" id="done">Done</div>
</div>
<div id="complete">
	<ul class="wrapper-radiobutton" id="type">
		<li class="group-radiobutton">
			<div class="radiobutton active" data-type="1"></div>
			<span>Deposit</span>
		</li>
		<li class="group-radiobutton">
			<div class="radiobutton" data-type="2"></div>
			<span>Withdraw</span>
		</li>
	</ul>
	<form>
		<div class="wrapper-input isolate">
			<div class="input-icon price">
				<input id="amount" type="number" placeholder="Amount" disabled />
			</div>
			<span class="help-block">Total amount.</span>
		</div>
		<div class="wrapper-comment isolate">
			<textarea id="description" rows="5" placeholder="Description" disabled></textarea>
			<span class="help-block">Optional comment in which you can describe the reasons for this operation. For example, 'Monthly contribution', 'Balance adjustment', etc.</span>
		</div>
	</form>
</div>
</script>
<script type="text/x-handlebars-template" id="main-add-position-template"><div id="isolate">
	<div class="button-primary" id="done">Done</div>
</div>
<div id="complete">
	<ul class="wrapper-radiobutton" id="type">
		<li class="group-radiobutton">
			<div class="radiobutton{{#lt this.closeSize 0}} active{{/lt}}" data-type="1"></div>
			<span>Long</span>
		</li>
		<li class="group-radiobutton">
			<div class="radiobutton{{#gt this.closeSize 0}} active{{/gt}}" data-type="2"></div>
			<span>Short</span>
		</li>
	</ul>
	<form>
		<div class="wrapper-input isolate">
			<input id="size" type="number" placeholder="Position size" value="{{#abs this.closeSize}}{{/abs}}" disabled />
			<span class="help-block">Quantity of shares or contracts.</span>
		</div>
		<div class="wrapper-input isolate">
			<div class="input-icon price">
				<input id="price" type="number" placeholder="Price" disabled />
			</div>
			<span class="help-block">Buy or sell price.</span>
		</div>
	</form>
</div>
</script>
<script type="text/x-handlebars-template" id="main-add-trade-template"><div id="isolate">
	<div class="button-primary" id="done">Done</div>
</div>
<div id="complete">
	<div class="wrapper-select isolate">
		<form>
			<div class="select">
				<select id="instrument_id" disabled>
					<option value="0">Instrument</option>
					{{#each this.instruments}}
						<option value="{{this.id}}">{{this.name}}</option>
					{{/each}}
				</select>
			</div>
			<span class="help-block">Manage your instruments through Settings.</span>
		</form>
	</div>
	<ul class="wrapper-radiobutton" id="type">
		<li class="group-radiobutton">
			<div class="radiobutton active" data-type="1"></div>
			<span>Long</span>
		</li>
		<li class="group-radiobutton">
			<div class="radiobutton" data-type="2"></div>
			<span>Short</span>
		</li>
	</ul>
	<form>
		<div class="wrapper-input isolate">
			<input id="size" type="number" placeholder="Position size" disabled />
			<span class="help-block">Quantity of shares or contracts.</span>
		</div>
		<div class="wrapper-input isolate">
			<div class="input-icon price">
				<input id="price" type="number" placeholder="Price" disabled />
			</div>
			<span class="help-block">Buy or sell price.</span>
		</div>
		<span class="text-note">Note: The trade will remain open in order to allow trade management (i.e. add positions) until you close it by adding an exit position which results in zero open shares or contracts. Reversing a trade is accomplished by closing the trade and opening a new one in opposite direction.</span>
	</form>
</div>
</script>
<script type="text/x-handlebars-template" id="main-add-template"><control class="segmented">
	<ul>
		<li class="active" data-section="AddTrade">Trade</li>
		<li data-section="AddOperation">Operation</li>
	</ul>
</control>
<section id="content"></section>
</script>
<script type="text/x-handlebars-template" id="main-drag-template"><div class="drag-account">
	<div class="account">Account: <span>{{this.account}}</span></div>
	<div class="balance">Balance: <span>{{#money this.balance}}{{/money}}</span></div>
	<div class="peeking"></div>
</div>
</script>
<script type="text/x-handlebars-template" id="main-edit-commission-template"><div id="isolate">
	<div class="button-primary" id="done">Done</div>
</div>
<div id="complete">
	<form>
		<div class="wrapper-input isolate">
			<div class="input-icon price">
				<input id="commission" type="number" placeholder="{{#money this.commission}}{{/money}}" disabled />
			</div>
			<span class="help-block">Commission total amount.</span>
		</div>
	</form>
</div>
</script>
<script type="text/x-handlebars-template" id="main-map-template"><section id="content">
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
					<div class="percentage">
						<div class="bar-percentage" style="width: {{#map this.net ../this.max}}{{/map}}%;"></div>
					</div>
				</div>
			</li>
		{{/each}}
	</ul>
</section>
</script>
<script type="text/x-handlebars-template" id="main-view-operation-template"><p class="text-body">{{#nl2br operation.description}}{{/nl2br}}</p>
</script>
<script type="text/x-handlebars-template" id="main-view-trade-template"><div id="view" style="display: none;">
	<div id="loading"><span></span></div>
	<div id="top">
		<ul>
			<li class="wrapper-label">
				<div class="label trade full">
					<div class="ball">
						<div class="globe-commission"></div>
						<div class="icon"></div>
					</div>
					<div class="row">
						<div class="instrument"></div>
						<div class="net"></div>
					</div>
					<div class="row">
						<div id="info"></div>
						<div class="variation"></div>
					</div>
				</div>
			</li>
		</ul>
		<ul class="wrapper-button-default two-button-default">
			<li class="button-default" data-view="mainAddPosition" id="add-position">Add position</li>
			<li class="button-default" data-view="mainEditCommission" id="edit-commission">Edit commission</li>
			<li class="button-default" data-view="mainAddComment">Add comment</li>
		</ul>
	</div>
	<section id="content">
		<ul></ul>
	</section>
</div>
</script>
<script type="text/x-handlebars-template" id="main-template"><section id="content">
	<ul>
		{{#each objects}}
			{{#if this.instrument}}
				<li class="wrapper-label" data-key="{{@key}}"{{#if this.isOpen}} data-swipe="1"{{/if}}>
					<div class="label trade {{#if this.isLong}}long{{else}}short{{/if}}{{#if this.isOpen}} open swipe{{/if}}"{{#unless this.isOpen}} data-net="{{this.net}}"{{else}}{{#if this.net}} data-net="{{this.net}}"{{/if}}{{/unless}}>
						<div class="ball">
							{{#if this.comments}}
								<div class="globe-comments">{{this.comments}}</div>
							{{/if}}
							{{#if this.edit_commission}}
								<div class="globe-commission"></div>
							{{/if}}
							<div class="icon"></div>
						</div>
						<div class="row">
							<div class="instrument">{{this.instrument}}</div>
							<div class="net {{#gt this.net 0}}positive{{else}}{{#lt this.net 0}}negative{{else}}zero{{/lt}}{{/gt}}">{{#unless this.isOpen}}{{#money this.net}}{{/money}}{{else}}{{#if this.hasClosedPositions}}{{#money this.net}}{{/money}}{{/if}}{{/unless}}</div>
						</div>
						<div class="row">
							<div class="{{#if this.isOpen}}size-price{{else}}date{{/if}}">{{#if this.isOpen}}{{this.sizePrice}}{{else}}{{#date this.closed_at}}{{/date}}{{/if}}</div>
							{{#unless this.isOpen}}
								<div class="variation">{{#variation this.variation}}{{/variation}}</div>
							{{/unless}}
						</div>
						{{#if this.isOpen}}
							<div class="swipe-triangle"></div>
						{{/if}}
					</div>
					{{#if this.isOpen}}
						<div class="wrapper-swipe">
							<div class="swipe-buttons">
								<ul>
									<li class="button-swipe delete" data-id="{{this.id}}"></li>
								</ul>
							</div>
						</div>
					{{/if}}
				</li>
			{{else}}
				<li class="wrapper-label" data-key="{{@key}}"{{#if this.isNewest}} data-swipe="1"{{/if}}>
					<div class="label operation {{#gt this.amount 0}}deposit{{else}}withdraw{{/gt}}{{#unless this.description.length}} no-click{{/unless}}{{#if this.isNewest}} swipe{{/if}}" data-net="{{this.amount}}">
						<div class="ball">
							<div class="icon"></div>
						</div>
						<div class="row">
							<div class="instrument">{{#gt this.amount 0}}Deposit{{else}}Withdraw{{/gt}}</div>
							<div class="net {{#gt this.amount 0}}positive{{else}}negative{{/gt}}">{{#money this.amount}}{{/money}}</div>
						</div>
						<div class="row">
							<div class="date">{{#date this.created_at}}{{/date}}</div>
							{{#if this.variation}}
								<div class="variation">{{#variation this.variation}}{{/variation}}</div>
							{{/if}}
						</div>
						{{#if this.isNewest}}
							<div class="swipe-triangle"></div>
						{{/if}}
					</div>
					{{#if this.isNewest}}
						<div class="wrapper-swipe">
							<div class="swipe-buttons">
								<ul>
									<li class="button-swipe delete" data-id="{{this.id}}"></li>
								</ul>
							</div>
						</div>
					{{/if}}
				</li>
			{{/if}}
		{{/each}}
	</ul>
</section>
</script>
<script type="text/x-handlebars-template" id="no-connection-template"><section id="content">
	<div id="no-connection">
		<div class="center">
			<span>No connection</span>
		</div>
	</div>
</section>
</script>
<script type="text/x-handlebars-template" id="settings-accounts-template"><div class="box-violet">
	<ul>
		{{#each accounts}}
			<li class="wrapper-label" data-key="{{@key}}"{{#unless this.is_active}} data-swipe="1"{{/unless}}>
				<div class="label account{{#unless this.is_active}} swipe{{/unless}}">
					<div class="radiobutton{{#if this.is_active}} active{{/if}}"></div>
					<div class="row">
						<div class="name">{{this.name}}</div>
					</div>
					<div class="row">
						<div class="balance">{{#money this.balance}}{{/money}}</div>
					</div>
					{{#unless this.is_active}}
						<div class="swipe-triangle"></div>
					{{/unless}}
				</div>
				{{#unless this.is_active}}
					<div class="wrapper-swipe">
						<div class="swipe-buttons">
							<ul>
								<li class="button-swipe delete" data-id="{{this.id}}"></li>
							</ul>
						</div>
					</div>
				{{/unless}}
			</li>
		{{/each}}
	</ul>
</div>
</script>
<script type="text/x-handlebars-template" id="settings-add-account-template"><div class="box-violet" id="isolate">
	<div class="button-primary" id="done">Done</div>
</div>
<div id="complete">
	<div class="box-violet">
		<form>
			<div class="wrapper-input isolate">
				<input id="name" type="text" placeholder="Account name" {{#if this.account}}value="{{this.account.name}}" {{/if}}disabled />
				<span class="help-block">For example, 'Demo', 'Real', etc.</span>
			</div>
			{{#unless this.account}}
				<div class="wrapper-input isolate">
					<div class="input-icon price">
						<input id="balance" type="number" placeholder="Initial balance" disabled />
					</div>
					<span class="help-block">You need to have sufficient funds in order to add trades. You'll be able to deposit or withdraw money at any time.</span>
				</div>
			{{/unless}}
		</form>
		{{#unless this.account}}
			<div class="wrapper-checkbox">
				<div class="checkbox active" id="is_active"></div>
				<span>Use this account</span>
			</div>
		{{/unless}}
	</div>
</div>
</script>
<script type="text/x-handlebars-template" id="settings-add-instrument-template"><div id="view" style="display: none;">
	<div class="box-violet" id="isolate">
		<div class="button-primary" id="done">Done</div>
	</div>
	<div id="complete">
		<div class="box-violet">
			<ul class="wrapper-radiobutton" id="type">
				<li class="group-radiobutton">
					<div class="radiobutton active" data-type="1" id="radio-1"></div>
					<span>Future</span>
				</li>
				<li class="group-radiobutton">
					<div class="radiobutton" data-type="2" id="radio-2"></div>
					<span>Stock</span>
				</li>
				<li class="group-radiobutton">
					<div class="radiobutton" data-type="3" id="radio-3"></div>
					<span>Other</span>
				</li>
			</ul>
			<form>
				<div class="wrapper-input isolate">
					<input id="name" type="text" placeholder="Instrument name" disabled />
					<span class="help-block"><span class="type-1 type-2">For example, <span class="type-1">'E-mini S&P 500' or 'ES'</span><span class="type-2">'Apple' or 'AAPL'</span>. </span>You can use any name as long as it lets you identify which trading vehicle refers to.</span>
				</div>
				<div class="wrapper-input isolate type-1 type-3">
					<div class="input-icon price">
						<input id="point_value" type="number" placeholder="Point value" disabled />
					</div>
					<span class="help-block">A point is the smallest possible price change on the left side of the decimal point (i.e. the integer part) and its value is the difference in money that is affected by this movement.<span class="type-1"> For example, a point variation in the ES (four 0.25 movements) represents a gain or loss of $50.</span><span class="type-3"> Defaults to $1.</span></span>
				</div>
				<div class="wrapper-input isolate type-1 type-3">
					<div class="input-icon price">
						<input id="commission" type="number" placeholder="Commission" disabled />
					</div>
					<span class="help-block">This is a round-trip commission (charged once per buy/sell match). You'll be able to manually edit the commission by swiping the trade to the left once it's closed.<span class="type-3"> Defaults to $0.</span></span>
				</div>
				<div class="wrapper-checkbox type-3">
					<div class="checkbox-tap">
						<div class="checkbox active" id="alert"></div>
						<span>Commission alert icon <i class="ion-alert-circled"></i></span>
					</div>
					<span class="help-block">We strongly recommend that you verify broker's reports periodically in order to keep your numbers and stats accurate. An alert icon <i class="ion-alert-circled"></i> will be shown in every closed trade for this instrument to remind you of doing so. The icon will disappear after you manually edit the commission by swiping the trade to the left.</span>
				</div>
				<div class="text-note type-2"><b>Point value</b>: Stock's point value is always $1.</div>
				<div class="text-note type-2"><b>Commission</b>: Since there are many commission schemas for stocks (flat rate, percentage, etc.), stock's commission is always $0 and such trades will display an alert icon <i class="ion-alert-circled"></i> after you close them to remind you of manually editing the commission by swiping the closed trade to the left. We strongly recommend that you verify broker's reports periodically in order to keep your numbers and stats accurate.</div>
			</form>
		</div>
	</div>
</div>
</script>
<script type="text/x-handlebars-template" id="settings-general-feedback-template"><div class="box-violet" id="isolate">
	<div class="button-primary" id="done">Done</div>
</div>
<div id="complete">
	<div id="thank-you" style="display: none;">
		<div class="center">
			<span>Thank you!</span>
		</div>
	</div>
	<div class="box-violet">
		<ul class="wrapper-feedback">
			<span class="help-block header">How are you feeling?</span>
			<li class="button-feedback happy active" data-type="1"></li>
			<li class="button-feedback sad" data-type="2"></li>
		</ul>
		<div class="wrapper-comment isolate">
			<textarea id="body" rows="5" placeholder="Feedback" disabled></textarea>
			<span class="help-block">Send us your comments and suggestions.</span>
		</div>
		<div class="wrapper-input isolate">
			<input id="email" type="text" placeholder="Email" disabled />
			<span class="help-block">Your email address.</span>
		</div>
	</div>
</div>
</script>
<script type="text/x-handlebars-template" id="settings-general-template"><div class="box-violet" id="complete">
	<div class="button-primary" id="button-help">Help</div>
	<div class="button-primary" id="button-feedback">Feedback</div>
	<br />
	<div class="button-primary" id="button-reset" style="color: #ff3b30;">Reset DB</div>
	<span class="copyright">
		TradingLog &copy; 2015<br />
		www.tradinglog.com<br />
		All rights reserved
	</span>
</div>
</script>
<script type="text/x-handlebars-template" id="settings-instruments-template"><div class="box-violet">
	<ul>
		{{#each instruments}}
			<li class="wrapper-label" data-key="{{@key}}" data-swipe="2">
				<div class="label instrument swipe">
					<div class="ball">
						{{#if this.alert}}
							<div class="globe-commission"></div>
						{{/if}}
						<span class="group">{{this.group}}</span>
					</div>
					<div class="row">
						<div class="name">{{this.name}}</div>
					</div>
					<div class="row">
						<div class="type">{{this.typeName}}</div>
						{{#gt this.commission 0}}
							<div class="commission">{{#money this.commission}}{{/money}}</div>
						{{/gt}}
					</div>
					<div class="swipe-triangle"></div>
				</div>
				<div class="wrapper-swipe">
					<div class="swipe-buttons">
						<ul>
							<li class="button-swipe delete" data-id="{{this.id}}"></li>
							<li class="button-swipe group" data-id="{{this.id}}"><span>{{this.group}}</span></li>
						</ul>
					</div>
				</div>
			</li>
		{{/each}}
	</ul>
</div>
</script>
<script type="text/x-handlebars-template" id="settings-template"><control class="segmented">
	<ul>
		<li class="{{#equal section 'instruments'}}active{{/equal}}" data-section="Instruments">Instruments</li>
		<li class="middle{{#equal section 'accounts'}} active{{/equal}}" data-section="Accounts">Accounts</li>
		<li data-section="General">General</li>
	</ul>
</control>
<section id="content"></section>
</script>
<script type="text/x-handlebars-template" id="stats-custom-template"><div class="box-violet" id="isolate">
	<div class="button-primary" id="done">Done</div>
</div>
<div id="complete">
	<div id="no-stats" style="display: none;">
		<div class="center">
			<span>No data</span>
		</div>
	</div>
	<div class="box-violet">
		<div class="title-section">Group of instruments</div>
		<ul class="wrapper-select-group">
			<li class="group selected">A</li>
			<li class="group selected">B</li>
			<li class="group selected">C</li>
			<li class="group selected">D</li>
			<li class="group selected">E</li>
			<span class="help-block">You can group instruments by swiping them to the left in Settings.</span>
		</ul>
		<div class="title-section">Date range</div>
		<form>
			<div class="wrapper-input two-input isolate">
				<div class="wrapper-input">
					<input id="from" type="text" placeholder="From" disabled />
					<span class="help-block">From and to dates.</span>
				</div>
				<div class="wrapper-input">
					<input id="to" type="text" placeholder="To" disabled />
				</div>
			</div>
		</form>
		<div class="button-primary" id="generate">Generate</div>
	</div>
</div>
</script>
<script type="text/x-handlebars-template" id="stats-numbers-template"><div class="header-box-swipe">
	<div class="wrapper-calendar">
		<div class="buttons-calendar">
			<span class="button-left"></span>
			<span class="button-right" style="display: none;"></span>
		</div>
		<div class="calendar" id="date">{{this.date}}</div>
	</div>
	<ul class="wrapper-radiobutton" id="type">
		<li class="group-radiobutton">
			<div class="radiobutton" id="radio-1" data-type="all"></div>
			<span>All</span>
		</li>
		<li class="group-radiobutton">
			<div class="radiobutton" id="radio-2" data-type="longs"></div>
			<span>Longs</span>
		</li>
		<li class="group-radiobutton">
			<div class="radiobutton" id="radio-3" data-type="shorts"></div>
			<span>Shorts</span>
		</li>
	</ul>
</div>
<div id="processing" style="display: none; top: 147px;">
	<div class="center">
		<span>Processing</span>
	</div>
</div>
<div id="no-stats" style="display: none; top: 147px;">
	<div class="center">
		<span>No data</span>
	</div>
</div>
<div class="box-swipe">
	<ul class="swipe-panes" style="height: 100%;">
		<li class="content-swipe" style="top: 8px;">
			<canvas id="doughnut"></canvas>
			<div class="center">
				<div>
					<div class="legend" id="legend-amounts"></div>
					<div class="legend" id="legend-titles" style="display: none;">
						<ul class="graphic">
							<li class="profit"><span>Profit</span></li>
							<li class="loss"><span>Loss</span></li>
							<li class="commissions"><span>Commissions</span></li>
							<li class="operations"><span>Operations</span></li>
							<li class="net"><span>Net</span></li>
						</ul>
					</div>
				</div>
			</div>
			<div class="help">&nbsp;</div>
		</li>
		<li class="content-swipe">
			<div class="center numbers">
				<div style="width: 100%;">
					<ul class="pane">
						<li>
							<div class="col-1">Trades</div>
							<div class="col-2">
								<span id="numbers-trades"></span>
							</div>
						</li>
						<li>
							<div class="col-1">Winners</div>
							<div class="col-2">
								<span id="numbers-winners"></span>
							</div>
						</li>
						<li>
							<div class="col-1">Losers</div>
							<div class="col-2">
								<span id="numbers-losers"></span>
							</div>
						</li>
						<li>
							<div class="col-1">Accuracy</div>
							<div class="col-2">
								<span class="highlight" id="numbers-accuracy"></span>
							</div>
						</li>
					</ul>
					<ul class="pane">
						<li>
							<div class="col-1">Average trade</div>
							<div class="col-2">
								<span id="numbers-average_trade"></span>
							</div>
						</li>
						<li>
							<div class="col-1">Average winning trade</div>
							<div class="col-2">
								<span id="numbers-average_winning_trade"></span>
							</div>
						</li>
						<li>
							<div class="col-1">Average losing trade</div>
							<div class="col-2">
								<span id="numbers-average_losing_trade"></span>
							</div>
						</li>
						<li>
							<div class="col-1">Risk/reward ratio</div>
							<div class="col-2">
								<span class="highlight" id="numbers-risk_reward_ratio"></span>
							</div>
						</li>
					</ul>
					<ul class="pane">
						<li>
							<div class="col-1">Average time in market</div>
							<div class="col-2">
								<span id="numbers-average_time_in_market"></span>
							</div>
						</li>
						<li>
							<div class="col-1">Sharpe ratio</div>
							<div class="col-2">
								<span id="numbers-sharpe_ratio"></span>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</li>
		<li class="content-swipe">
			<div class="center">
				<div style="height: 100%; max-height: 400px; padding-bottom: 28px; width: 100%;">
					<canvas id="line"></canvas>
					<ul class="pane" style="margin: 0;">
						<li>
							<div class="col-1">Variation</div>
							<div class="col-2">
								<span id="line-variation"></span>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</li>
	</ul>
</div>
<div class="wrapper-control-box-swipe">
	{{#if this.groups}}
		<ul class="wrapper-active-group">
			{{#groups this.groups}}{{/groups}}
		</ul>
	{{/if}}
	<ul class="control-box-swipe">
		<li class="active" id="swipe-control-1"></li>
		<li id="swipe-control-2"></li>
		<li id="swipe-control-3"></li>
	</ul>
</div>
</script>
<script type="text/x-handlebars-template" id="stats-template"><control class="segmented">
	<ul>
		<li data-period="weekly" data-section="Numbers">Weekly</li>
		<li class="middle active" data-period="monthly" data-section="Numbers">Monthly</li>
		<li data-period="custom" data-section="Custom" id="control-custom">Custom</li>
	</ul>
</control>
<section id="content" style="background-color: #4020d0;">
	<div id="no-stats" style="display: none;">
		<div class="center">
			<span>No data</span>
		</div>
	</div>
</section>
</script>
<script type="text/x-handlebars-template" id="welcome-template"><div class="welcome box-violet">
	<div class="content">
		<h1>Welcome</h1>
		<div id="isolate">
			<div class="button-primary" id="done">Done</div>
		</div>
		<div id="complete">
			<span class="text-body">Since this is your first time using TradingLog, you need to create an account that you'll be trading with. You'll be able to add or edit accounts later on. <b>All data is private and stored in your device.</b></span>
			<form>
				<div class="wrapper-input isolate">
					<input id="name" type="text" placeholder="Account name" disabled />
					<span class="help-block">For example, 'Demo', 'Real', etc.</span>
				</div>
				<div class="wrapper-input isolate">
					<div class="input-icon price">
						<input id="balance" type="number" placeholder="Initial balance" disabled />
					</div>
					<span class="help-block">You need to have sufficient funds in order to add trades. You'll be able to deposit or withdraw money at any time.</span>
				</div>
			</form>
			<div class="button-primary" id="start">Start</div>
		</div>
	</div>
	<div class="video"></div>
</div>
</script>