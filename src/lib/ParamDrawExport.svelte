<script lang="ts">
	//import type { tCanvasAdjust } from '$lib/geom/canvas_utils';
	import TimeControl from '$lib/TimeControl.svelte';
	import { point, entityList } from '$lib/geom/euclid2d';
	import type { tParams, tPObj, tGeomFunc } from '$lib/paramGeom';
	import { onMount } from 'svelte';

	export let params: tParams;
	export let geom: tGeomFunc;

	const pObj: tPObj = {};
	for (const p of params.params) {
		pObj[p.name] = p.init;
	}

	let windowWidth: number;
	let canvasFull: HTMLCanvasElement;
	let canvasZoom: HTMLCanvasElement;
	const canvas_size_min = 400;

	const eList = entityList();
	let simTime = 0;
	function canvasRedraw() {
		//console.log(`windowWidth: ${windowWidth}`);
		const ctx1 = canvasFull.getContext('2d') as CanvasRenderingContext2D;
		const canvas_size = Math.max(0.4 * windowWidth, canvas_size_min);
		ctx1.canvas.width = canvas_size;
		ctx1.canvas.height = canvas_size;
		eList.draw(ctx1);
		// extra drawing
		const cAdjust = eList.getCanvasAdjust(ctx1.canvas.width, ctx1.canvas.height);
		//point(5, 5).draw(ctx1, cAdjust, 'green');
		//point(5, 15).draw(ctx1, cAdjust, 'blue', 'rectangle');
		for (const i of [10, 100, 200]) {
			point(i, 0).draw(ctx1, cAdjust, 'blue', 'cross');
			point(-i, 0).draw(ctx1, cAdjust, 'blue', 'cross');
			point(0, i).draw(ctx1, cAdjust, 'blue', 'cross');
			point(0, -i).draw(ctx1, cAdjust, 'blue', 'cross');
		}
		point(0, 0).draw(ctx1, cAdjust, 'red', 'cross');
	}
	let domInit = 0;
	function geomRedraw(iSimTime: number) {
		const points = geom(iSimTime, pObj);
		eList.clear();
		for (const p of points) {
			eList.addPoint(p);
		}
		canvasRedraw();
		domInit = 1;
	}
	onMount(() => {
		// initial drawing
		geomRedraw(simTime);
	});
	$: {
		//console.log(`dbg050: ${simTime}`);
		if (domInit === 1) {
			geomRedraw(simTime);
		}
	}
</script>

<svelte:window bind:innerWidth={windowWidth} on:resize={canvasRedraw} />
<section>
	{#each params.params as param}
		<article class="oneParam">
			<span>{param.name}:</span>
			<input
				id="{param.name}ID1"
				type="number"
				bind:value={pObj[param.name]}
				min={param.min}
				max={param.max}
				step={param.step}
			/>
			<input
				id="{param.name}ID2"
				type="range"
				bind:value={pObj[param.name]}
				min={param.min}
				max={param.max}
				step={param.step}
			/>
			<span
				>unit: {param.unit}, init: {param.init}, min: {param.min}, max: {param.max}, step: {param.step}</span
			>
		</article>
	{/each}
</section>
<TimeControl
	tMax={params.sim.tMax}
	tStep={params.sim.tStep}
	tUpdate={params.sim.tUpdate}
	bind:simTime
/>
<canvas id="full" width={canvas_size_min} height={canvas_size_min} bind:this={canvasFull} />
<canvas id="zoom" width={canvas_size_min} height={canvas_size_min} bind:this={canvasZoom} />

<style lang="scss">
	@use '$lib/style/colors.scss';

	section > article > span {
		color: darkBlue;
	}
	canvas {
		//display: block;
		background-color: pink;
		margin: 1rem;
	}
</style>
