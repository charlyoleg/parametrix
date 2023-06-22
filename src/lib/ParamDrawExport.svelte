<script lang="ts">
	import type { tParamDef, tGeomFunc } from '$lib/design/aaParamGeom';
	import InputParams from '$lib/InputParams.svelte';
	import Drawing from '$lib/Drawing.svelte';
	import { storePV } from '$lib/storePVal';
	import * as zip from '@zip.js/zip.js';

	export let pDef: tParamDef;
	export let geom: tGeomFunc;

	function checkWarn(txt: string) {
		let rWarn = true;
		const re = /warn/i;
		if (txt.search(re) < 0) {
			rWarn = false;
		}
		return rWarn;
	}
	let simTime = 0;
	// log and paramChange
	let logValue = 'Dummy initial\nWill be replaced during onMount\n';
	let calcErr = false;
	let calcWarn = false;
	function paramChange2(iPageName: string) {
		const mydate = new Date().toLocaleTimeString();
		logValue = `Geometry ${iPageName} computed at ${mydate}\n`;
		const geome = geom(simTime, $storePV[pDef.page]);
		logValue += geome.logstr;
		calcErr = geome.calcErr;
		calcWarn = checkWarn(geome.logstr);
		//geomRedraw(simTime);
	}
	function paramChange() {
		paramChange2(pDef.page);
	}
	$: paramChange2(pDef.page); // for reactivity on page change
	// export drawings
	function download_zipfile(file_name: string, blob: Blob) {
		//create temporary an invisible element
		const elem_a_download = document.createElement('a');
		const objectURL = URL.createObjectURL(blob);
		elem_a_download.setAttribute('href', objectURL);
		elem_a_download.setAttribute('download', file_name);
		//document.body.appendChild(elem_a_download); // it does not seem required to append the element to the DOM to use it
		elem_a_download.click();
		//document.body.removeChild(elem_a_download);
		elem_a_download.remove(); // Is this really required?
		URL.revokeObjectURL(objectURL);
	}
	async function downloadExport() {
		console.log('todo020');
		const zipFileWriter = new zip.BlobWriter();
		const helloWorldReader = new zip.TextReader('Hello world!');
		const zipWriter = new zip.ZipWriter(zipFileWriter);
		await zipWriter.add('hello.txt', helloWorldReader);
		const zipFileBlob = await zipWriter.close();
		download_zipfile('abc.zip', zipFileBlob);
	}
</script>

<InputParams {pDef} on:paramChg={paramChange} {geom} {simTime} />
<section>
	<h2>Log</h2>
	<textarea
		rows="5"
		cols="94"
		readonly
		wrap="off"
		value={logValue}
		class:colorErr={calcErr}
		class:colorWarn={calcWarn}
	/>
</section>
<Drawing {pDef} {geom} bind:simTime />
<section>
	<h2>Export</h2>
	<select>
		<option value="svg">svg</option>
		<option value="sxf">dxf</option>
		<option value="pax">png</option>
	</select>
	<button on:click={downloadExport}>Save to File</button>
</section>

<style lang="scss">
	@use '$lib/style/colors.scss';
	@use '$lib/style/styling.scss';

	section > h2 {
		@include styling.mix-h2;
	}
	section > textarea {
		/*resize: horizontal;*/
		margin-left: 0.5rem;
	}
	section > textarea.colorWarn {
		background-color: colors.$warn-calc-warning;
	}
	section > textarea.colorErr {
		background-color: colors.$warn-calc-error;
	}
	section > button,
	section > select {
		@include styling.mix-button;
	}
</style>
