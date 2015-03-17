<script type="text/x-handlebars-template" id="main-add-trade-template">
	<div class="wrapper-select">
		<div class="select">Instrument</div>
		<span class="help-block">Manage your instruments through Settings.</span>
	</div>
	<ul class="wrapper-radiobutton">
		<li class="group-radiobutton">
			<div class="radiobutton active"></div>
			<span>Long</span>
		</li>
		<li class="group-radiobutton">
			<div class="radiobutton"></div>
			<span>Short</span>
		</li>
	</ul>
	<form>
		<div class="wrapper-input">
			<input type="" placeholder="Position size">
			<span class="help-block">Quantity of shares or contracts.</span>
		</div>
		<div class="wrapper-input">
			<div class="input-icon price">
				<input type="" placeholder="Price">
			</div>
			<span class="help-block">Buy or sell price.</span>
		</div>
		<span class="text-note">Note: The trade will remain open in order to allow trade management (i.e. add positions) until you close it by adding an exit position which results in zero open shares or contracts. Reversing a trade is accomplished by closing the trade and opening a new one in opposite direction.</span>
	</form>
</script>
