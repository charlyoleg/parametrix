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
	function paramChange() {
		logValue = 'Geometry computed at ' + new Date().toLocaleTimeString() + '\n';
		const geome = geom(simTime, $storePV[pDef.page]);
		logValue += geome.logstr;
		//geomRedraw(simTime);
	}
	// export drawings
	function dowloadExport() {
		console.log('todo020');
	}
</script>

<InputParams {pDef} bind:pVal={$storePV[pDef.page]} on:paramChg={paramChange} {geom} {simTime} />
<section>
	<h2>Log</h2>
	<textarea rows="5" cols="80" readonly wrap="off" bind:value={logValue} />
</section>
<Drawing {pDef} {geom} bind:simTime />
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
		margin-left: 0.5rem;
	}
	section > button,
	section > select {
		@include styling.mix-button;
	}
</style>
