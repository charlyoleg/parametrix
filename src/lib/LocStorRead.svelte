<script lang="ts">
	import { browser } from '$app/environment';

	export let pageName: string;
	export let storeName: string;

	// get the list of localStorage keys
	function getLocalKey() {
		let rKeyList: Array<string> = [];
		const re = new RegExp(`^${pageName}_`);
		if (browser) {
			const keyList = Object.keys(window.localStorage).filter((k) => re.test(k));
			//console.log(keyList);
			rKeyList = keyList.map((k) => k.replace(re, ''));
		}
		//console.log(rKeyList);
		return rKeyList;
	}
	const localKeys = getLocalKey();
	// create a default key name
	function defaultName() {
		let rname = '';
		if (localKeys.length > 0) {
			rname = localKeys[0];
		}
		return rname;
	}
	storeName = defaultName();
</script>

<table>
	<tbody>
		{#each localKeys as kname}
			<tr><td>{kname}</td></tr>
		{/each}
	</tbody>
</table>
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

	/*
	label {
		display: block;
	}
	input {
		display: block;
	}
	*/
</style>
