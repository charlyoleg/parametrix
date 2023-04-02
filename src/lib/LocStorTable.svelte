<script lang="ts">
	import { browser } from '$app/environment';

	export let pageName: string;
	export let storeName: string;
	export let localKeys: Array<string>;

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
	localKeys = getLocalKey();
	function modifInput(iname: string) {
		storeName = iname;
	}
	// last modification date
	type tLocalDate = { [index: string]: string };
	let localDate: tLocalDate = {};
	function getLocalDate(iKeys: Array<string>): tLocalDate {
		let rLocalDate: tLocalDate = {};
		if (browser) {
			for (const k of iKeys) {
				let lastModif = '';
				const k2 = `${pageName}_${k}`;
				const storeStr = window.localStorage.getItem(k2);
				if (storeStr !== null) {
					const val2 = JSON.parse(storeStr);
					lastModif = val2.lastModif;
				}
				console.log(`dbg194: ${lastModif}`);
				rLocalDate[k] = lastModif;
			}
		}
		return rLocalDate;
	}
	localDate = getLocalDate(localKeys);
	// delete checkbox
	type tLocalDel = { [index: string]: boolean };
	let localDel: tLocalDel = {};
	function getInitDel(iKeys: Array<string>): tLocalDel {
		let rLocalDel: tLocalDel = {};
		for (const k of iKeys) {
			rLocalDel[k] = false;
		}
		return rLocalDel;
	}
	localDel = getInitDel(localKeys);
	// global delete
	let globalDel = false;
	function setGlobalDel(iGlobalDel: boolean) {
		for (const k of localKeys) {
			localDel[k] = iGlobalDel;
		}
	}
	$: setGlobalDel(globalDel);
	// delete unlock
	let unlock = [false, false];
	let borColor = ['transparent', 'transparent'];
	function delay(milliseconds: number) {
		return new Promise((resolve) => {
			setTimeout(resolve, milliseconds);
		});
	}
	async function actionDel() {
		unlock = [false, false];
		if (browser) {
			for (const k of localKeys) {
				if (localDel[k]) {
					console.log(`delete ${k}`);
					const k2 = `${pageName}_${k}`;
					window.localStorage.removeItem(k2);
				}
			}
		}
		localKeys = getLocalKey();
		await delay(500);
		borColor = ['transparent', 'transparent'];
	}
	function toggleDel(idx: number) {
		//console.log(`dbg756: ${idx}`);
		unlock[idx] = !unlock[idx];
		borColor[idx] = unlock[idx] ? 'red' : 'transparent';
		if (unlock[0] && unlock[1]) {
			actionDel();
		}
	}
</script>

<div class="deleteKeys">
	<div class="lock" style:border-color={borColor[0]}>
		<button on:click={() => toggleDel(0)}>Delete<br />unlock-1</button>
	</div>
	<table>
		<thead>
			<tr>
				<td>Delete</td>
				<td>Key name</td>
				<td>Last modification</td>
			</tr>
			<tr>
				<td><input type="checkbox" bind:checked={globalDel} /></td>
				<td class="instruction">delete all</td>
				<td />
			</tr>
		</thead>
		<tbody>
			{#each localKeys as kname}
				<tr>
					<td><input type="checkbox" bind:checked={localDel[kname]} /></td>
					<td><button on:click={() => modifInput(kname)}>{kname}</button></td>
					<td>{localDate[kname]}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<div class="lock" style:border-color={borColor[1]}>
		<button on:click={() => toggleDel(1)}>Delete<br />unlock-2</button>
	</div>
</div>

<style lang="scss">
	@use '$lib/style/colors.scss';
	@use '$lib/style/styling.scss';

	div.deleteKeys {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	div > div.lock {
		border-style: solid;
		border-radius: 0.6rem;
		border-width: 0.5rem;
		border-color: transparent;
		transition-property: border-color;
		transition-duration: 0.2s;
	}
	div > div.lock > button {
		@include styling.mix-button;
		height: 2.6rem;
	}
	div > table {
		font-size: 0.8rem;
		font-weight: 400;
		margin: 2rem;
	}
	div > table > thead {
		background-color: colors.$table-head;
	}
	div > table > tbody {
		background-color: colors.$table-body;
	}
	div > table > tbody > tr > td > button {
		color: colors.$timectrl-sign;
		background-color: transparent;
		border: 0;
	}
</style>
