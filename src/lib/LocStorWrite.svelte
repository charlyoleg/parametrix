<script lang="ts">
	export let pageName: string;
	export let storeName: string;

	function defaultName(prefix: string) {
		const re1 = /[-:]/g;
		const re2 = /\..*$/;
		const datestr = new Date()
			.toISOString()
			.replace(re1, '')
			.replace(re2, '')
			.replace('T', '_');
		const rname = `${prefix}_${datestr}`;
		return rname;
	}
	storeName = defaultName(pageName);
	function validInput(eve: Event) {
		console.log(eve);
		//console.log(`dbg161: ${(eve.target as HTMLInputElement).value}`);
		console.log(`dbg161: ${storeName}`);
		//storeName = eve.target.value;
	}
</script>

<label for="storName">Give a name to your parameter-set:</label>
<input
	type="text"
	id="storName"
	bind:value={storeName}
	required
	minlength="4"
	maxlength="30"
	size="32"
	on:input={validInput}
/>
<p>Warning name already used</p>

<style lang="scss">
	@use '$lib/style/colors.scss';

	/*
	label {
		display: block;
	}
	input {
		display: block;
	}
	*/
</style>
