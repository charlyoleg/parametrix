<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { tOkFunc } from '$lib/ModalDiag.svelte';
	import ModalDiag from '$lib/ModalDiag.svelte';
	import type { tParamDef, tParamVal } from '$lib/paramGeom';
	import { onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	export let pDef: tParamDef;
	export let pVal: tParamVal;

	// initialization
	function paramChange() {
		dispatch('paramChg', { foo: 'bla' });
	}
	for (const p of pDef.params) {
		pVal[p.name] = p.init;
	}
	onMount(() => {
		paramChange();
	});
	// load parameters
	let paramFiles: FileList;
	function loadFile(fileP: File) {
		const reader = new FileReader();
		reader.addEventListener('loadend', () => {
			const paramJson: tParamVal = JSON.parse(reader.result as string);
			//console.log(`dbg345`);
			for (const p of pDef.params) {
				if (Object.hasOwn(paramJson, p.name)) {
					pVal[p.name] = paramJson[p.name];
				}
			}
			paramChange();
		});
		reader.readAsText(fileP);
	}
	$: if (paramFiles) {
		//console.log(paramFiles);
		loadFile(paramFiles[0]);
	}
	// download parameters
	function download_file(file_name: string, file_content: string) {
		//create temporary an invisible element
		let elem_a_download = document.createElement('a');
		elem_a_download.setAttribute(
			'href',
			'data:text/plain;charset=utf-8,' + encodeURIComponent(file_content)
		);
		elem_a_download.setAttribute('download', file_name);
		//document.body.appendChild(elem_a_download); // it does not seem required to append the element to the DOM to use it
		elem_a_download.click();
		//document.body.removeChild(elem_a_download);
		elem_a_download.remove(); // Is this really required?
	}
	function dowloadParams() {
		const re1 = /[-:]/g;
		const re2 = /\..*$/;
		const datestr = new Date()
			.toISOString()
			.replace(re1, '')
			.replace(re2, '')
			.replace('T', '_');
		const file_name = `px_${pDef.page}_${datestr}.json`;
		const file_content = JSON.stringify(pVal, null, '  ');
		download_file(file_name, file_content);
		console.log(`dbg343: ${file_name}`);
	}
	// modal
	let modalLoadDefault = false;
	let modalLoadLocal = false;
	let modalSaveLocal = false;
	const foop: tOkFunc = () => {
		console.log('hyop');
	};
</script>

<section>
	<h2>Parameters</h2>
	<label for="loadParams" class="fileUpload">Load Params from File</label>
	<input
		id="loadParams"
		type="file"
		accept="text/plain, application/json"
		bind:files={paramFiles}
	/>
	<button
		on:click={() => {
			modalLoadDefault = true;
		}}>Set Params Default</button
	>
	<button
		on:click={() => {
			modalLoadLocal = true;
		}}>Load Params from localStorage</button
	>
	<ModalDiag bind:modalOpen={modalLoadDefault} okName="Load Default Parameters" okFunc={foop}
		>Load the default parameters ?</ModalDiag
	>
	<ModalDiag bind:modalOpen={modalLoadLocal} okName="Load Parameters" okFunc={foop}
		>Load parameters from localStorage ?</ModalDiag
	>
	{#each pDef.params as param}
		<article class="oneParam">
			<span>{param.name}:</span>
			<input
				type="number"
				bind:value={pVal[param.name]}
				min={param.min}
				max={param.max}
				step={param.step}
				on:change={paramChange}
			/>
			<input
				type="range"
				bind:value={pVal[param.name]}
				min={param.min}
				max={param.max}
				step={param.step}
				on:change={paramChange}
			/>
			<span
				>unit: {param.unit}, init: {param.init}, min: {param.min}, max: {param.max}, step: {param.step}</span
			>
		</article>
	{/each}
	<button on:click={dowloadParams}>Save Parameters to File</button>
	<button
		on:click={() => {
			modalSaveLocal = true;
		}}>Save Parameters to localStorage</button
	>
	<ModalDiag bind:modalOpen={modalSaveLocal} okName="Save to localStorage" okFunc={foop}
		>Save parameters to localStorage ?</ModalDiag
	>
</section>

<style lang="scss">
	@use '$lib/style/colors.scss';
	@use '$lib/style/ParamDrawExport.scss';

	section > h2 {
		@include ParamDrawExport.mix-h2;
	}
	section > label.fileUpload {
		display: inline-block;
		height: 1.2rem;
		/*width: 1.6rem;*/
		color: colors.$timectrl-sign;
		font-size: 0.8rem;
		font-weight: 400;
		padding: 0.1rem 0.4rem 0.1rem;
		border-style: solid;
		border-width: 0.1rem;
		border-radius: 0.2rem;
		border-color: colors.$timectrl-sign;
		margin: 0.5rem;
		background-color: colors.$timectrl-bg;
	}
	section > input[type='file'] {
		display: none;
	}
	section > article > span {
		color: colors.$pde-params;
	}
	section > button {
		@include ParamDrawExport.mix-button;
	}
</style>
