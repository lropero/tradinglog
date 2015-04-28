<script type="text/x-handlebars-template" id="stats-numbers-template">
	<div class="header-box-swipe">
		<div class="wrapper-calendar">
			<div class="buttons-calendar">
				<span class="button-left"></span>
				<span class="button-right"></span>
			</div>
			<div class="calendar">April 2015</div>
		</div>
		<ul class="wrapper-radiobutton" id="type">
			<li class="group-radiobutton">
				<div class="radiobutton active" data-type="all"></div>
				<span>All</span>
			</li>
			<li class="group-radiobutton">
				<div class="radiobutton" data-type="long"></div>
				<span>Long</span>
			</li>
			<li class="group-radiobutton">
				<div class="radiobutton" data-type="short"></div>
				<span>Short</span>
			</li>
		</ul>
	</div>
	<div class="box-swipe">
		<ul class="swipe-panes" style="height: 100%;">
			<li class="content-swipe" style="top: 6px;">
				<canvas id="doughnut"></canvas>
				<div class="center">
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
				<div class="help">&nbsp;</div>
			</li>
			<li class="content-swipe">
				pepe
			</li>
			<li class="content-swipe">
				ganga
			</li>
		</ul>
	</div>
	<div class="wrapper-control-box-swipe">
		<ul class="control-box-swipe end-left">
			<li class="active" id="swipe-control-1"></li>
			<li id="swipe-control-2"></li>
			<li id="swipe-control-3"></li>
		</ul>
	</div>
</script>
