<script lang="ts">
	import type { tParamDef, tParamVal, tGeomFunc } from '$lib/paramGeom';
	import InputParams from '$lib/InputParams.svelte';
	import Drawing from '$lib/Drawing.svelte';

	export let pDef: tParamDef;
	export let geom: tGeomFunc;

	let pVal: tParamVal = {};
	let pValEve = 0;
	let simTime = 0;
	// log and paramChange
	let logValue = 'Dummy initial\nWill be replaced during onMount\n';
	function paramChange() {
		logValue = 'Geometry computed at ' + new Date().toLocaleTimeString() + '\n';
		const geome = geom(simTime, pVal);
		logValue += geome.logstr;
		pValEve += 1;
		//geomRedraw(simTime);
	}
	// export drawings
	function dowloadExport() {
		console.log('todo020');
	}
</script>

<InputParams {pDef} bind:pVal on:paramChg={paramChange} />
<section>
	<h2>Log</h2>
	<textarea rows="5" cols="80" readonly wrap="off" bind:value={logValue} />
</section>
<Drawing {pDef} {pVal} {pValEve} {geom} bind:simTime />
<section>
	<h2>Export</h2>
	<select>
		<option value="svg">svg</option>
		<option value="sxf">dxf</option>
		<option value="pax">png</option>
	</select>
	<button on:click={dowloadExport}>Save to File</button>
</section>

<style lang="scss">
	@use '$lib/style/colors.scss';
	@use '$lib/style/styling.scss';

	section > h2 {
		@include styling.mix-h2;
	}
	section > textarea {
		resize: horizontal;
	}
	section > button,
	section > select {
		@include styling.mix-button;
	}
</style>
