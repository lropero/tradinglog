<script type="text/x-handlebars-template" id="main-add-operation-template">
	<ul class="wrapper-radiobutton">
		<li class="group-radiobutton">
			<div class="radiobutton active"></div>
			<span>Deposit</span>
		</li>
		<li class="group-radiobutton">
			<div class="radiobutton"></div>
			<span>Withdraw</span>
		</li>
	</ul>
	<form>
		<div class="wrapper-input">
			<div class="input-icon price">
				<input type="" placeholder="Amount">
			</div>
			<span class="help-block">Total amount.</span>
		</div>
		<div class="wrapper-comment">
			<textarea rows="5" placeholder="Description"></textarea>
			<span class="help-block">Optional comment in which you can describe the reasons for this operation. For example, 'Monthly contribution', 'Balance adjustment', etc.</span>
		</div>
	</form>
</script>
