<script lang="ts">
	import type { tParamDef, tGeomFunc } from '$lib/design/aaParamGeom';
	import InputParams from '$lib/InputParams.svelte';
	import Drawing from '$lib/Drawing.svelte';
	import { storePV } from '$lib/storePVal';

	export let pDef: tParamDef;
	export let geom: tGeomFunc;

	let simTime = 0;
	// log and paramChange
	let logValue = 'Dummy initial\nWill be replaced during onMount\n';
	let calcErr = false;
	function paramChange2(iPageName: string) {
		const mydate = new Date().toLocaleTimeString();
		logValue = `Geometry ${iPageName} computed at ${mydate}\n`;
		const geome = geom(simTime, $storePV[pDef.page]);
		logValue += geome.logstr;
		calcErr = geome.calcErr;
		//geomRedraw(simTime);
	}
	function paramChange() {
		paramChange2(pDef.page);
	}
	$: paramChange2(pDef.page); // for reactivity on page change
	// export drawings
	function downloadExport() {
		console.log('todo020');
	}
</script>

<InputParams {pDef} on:paramChg={paramChange} {geom} {simTime} />
<section>
	<h2>Log</h2>
	<textarea rows="5" cols="94" readonly wrap="off" value={logValue} class:colorWarn={calcErr} />
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
		resize: horizontal;
		margin-left: 0.5rem;
	}
	section > textarea.colorWarn {
		background-color: colors.$warn-calc-error;
	}
	section > button,
	section > select {
		@include styling.mix-button;
	}
</style>
