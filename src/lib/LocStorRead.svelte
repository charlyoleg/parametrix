<script lang="ts">
	import LocStorTable from '$lib/LocStorTable.svelte';
	//import { browser } from '$app/environment';

	export let pageName: string;
	export let storeName: string;

	let localKeys: Array<string> = [];
	// create a default key name
	function defaultName(ilocalKeys: Array<string>) {
		let rname = '';
		if (ilocalKeys.length > 0) {
			rname = ilocalKeys[0];
		}
		return rname;
	}
	$: storeName = defaultName(localKeys);
</script>

<LocStorTable {pageName} bind:storeName bind:localKeys />
<label for="storName">Select a parameter-set:</label>
<input
	type="text"
	id="storName"
	value={storeName}
	readonly
	minlength="4"
	maxlength="30"
	size="32"
/>

<style lang="scss">
	@use '$lib/style/colors.scss';
</style>
