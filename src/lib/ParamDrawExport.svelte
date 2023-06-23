<script lang="ts">
	import type { tParamDef, tGeomFunc } from '$lib/design/aaParamGeom';
	import InputParams from '$lib/InputParams.svelte';
	import Drawing from '$lib/Drawing.svelte';
	import { storePV } from '$lib/storePVal';
	import {
		EFormat,
		fileBinContent,
		fileTextContent,
		fileSuffix,
		fileMime,
		fileBin
	} from '$lib/exportFile';

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
	let exportFormat: EFormat;
	function download_binFile(fName: string, fContent: Blob) {
		//create temporary an invisible element
		const elem_a_download = document.createElement('a');
		//const payload = 'data:' + fMime + ';base64,' + fContent;
		const payload = URL.createObjectURL(fContent);
		elem_a_download.setAttribute('href', payload);
		elem_a_download.setAttribute('download', fName);
		//document.body.appendChild(elem_a_download); // it does not seem required to append the element to the DOM to use it
		elem_a_download.click();
		//document.body.removeChild(elem_a_download);
		elem_a_download.remove(); // Is this really required?
		URL.revokeObjectURL(payload);
	}
	function download_textFile(fName: string, fContent: string, fMime: string) {
		//create temporary an invisible element
		const elem_a_download = document.createElement('a');
		const payload = 'data:' + fMime + ';utf-8,' + encodeURIComponent(fContent);
		elem_a_download.setAttribute('href', payload);
		elem_a_download.setAttribute('download', fName);
		//document.body.appendChild(elem_a_download); // it does not seem required to append the element to the DOM to use it
		elem_a_download.click();
		//document.body.removeChild(elem_a_download);
		elem_a_download.remove(); // Is this really required?
	}
	function dateString(): string {
		const re1 = /[-:]/g;
		const re2 = /\..*$/;
		const rDateStr = new Date()
			.toISOString()
			.replace(re1, '')
			.replace(re2, '')
			.replace('T', '_');
		return rDateStr;
	}
	async function downloadExport() {
		//console.log(`exportFormat ${exportFormat}`);
		const fSuffix = fileSuffix(exportFormat);
		const fMime = fileMime(exportFormat);
		const fBin = fileBin(exportFormat);
		const fName = pDef.page + '_' + dateString() + '.' + fSuffix;
		if (fBin) {
			const fContent = await fileBinContent(geom, simTime, $storePV[pDef.page], exportFormat);
			download_binFile(fName, fContent);
		} else {
			const fContent = fileTextContent(geom, $storePV[pDef.page], exportFormat);
			download_textFile(fName, fContent, fMime);
		}
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
	<select bind:value={exportFormat}>
		<option value={EFormat.eSVG}>current face as svg</option>
		<option value={EFormat.eDXF}>current face as dxf</option>
		<option value={EFormat.ePAX}>all faces as pax.json</option>
		<option value={EFormat.eZIP}>all as zip</option>
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
