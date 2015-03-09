<script id="settings-template" type="text/x-handlebars-template">
	<control class="segmented">
		<ul>
			<li class="{{#equal subview 'Instruments'}}active{{/equal}}" data-subview="Instruments">Instruments</li>
			<li class="middle{{#equal subview 'Accounts'}} active{{/equal}}" data-subview="Accounts">Accounts</li>
			<li data-subview="General">General</li>
		</ul>
	</control>
	<section id="content"></section>
</script>
