<div class="header-box-swipe">
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
							<li class="commission"><span>Commission</span></li>
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
