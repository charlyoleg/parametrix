<script lang="ts">
	export let pageName: string;

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
</script>

<label for="storName">Give a name to your parameter-set:</label>
<input
	type="text"
	id="storName"
	value={defaultName(pageName)}
	required
	minlength="4"
	maxlength="30"
	size="32"
/>
<p>Warning name already used</p>

<style lang="scss">
	@use '$lib/style/colors.scss';

	label {
		display: block;
	}
	input {
		display: block;
	}
</style>
