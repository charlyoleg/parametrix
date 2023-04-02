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
	let localKeys = getLocalKey();
	// create a default key name
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
	// check if the key already exist
	let warn = false;
	function validInput(eve: Event) {
		const storeName2 = (eve.target as HTMLInputElement).value;
		//const storeName2 = storeName;
		//console.log(`dbg162: ${storeName2}`);
		warn = localKeys.includes(storeName2);
		//console.log(`dbg040: ${warn}`);
	}
</script>

<table>
	<tbody>
		{#each localKeys as kname}
			<tr><td>{kname}</td></tr>
		{/each}
	</tbody>
</table>
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
{#if warn}
	<p>Warning: name {storeName} already used</p>
{/if}

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
