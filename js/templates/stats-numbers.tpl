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
	<ul class="box-swipe">
		<li class="content-swipe" style="top: 7.5px;">
			<span class="help"></span>
			<canvas id="doughnut"></canvas>
			<div class="center">
				<div class="legend"></div>
			</div>
		</li>
	</ul>
	<div class="wrapper-control-box-swipe">
		<ul class="control-box-swipe end-left">
			<li class="active"></li>
			<li></li>
			<li></li>
		</ul>
	</div>
</script>
