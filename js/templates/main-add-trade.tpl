<div id="isolate">
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
	</form>
</div>
