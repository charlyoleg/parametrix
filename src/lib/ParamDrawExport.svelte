<script lang="ts">
	import type { tCanvasAdjust } from '$lib/geom/canvas_utils';
	import { colors, canvas2point, adjustCenter, adjustRect } from '$lib/geom/canvas_utils';
	import TimeControl from '$lib/TimeControl.svelte';
	import ZoomControl from '$lib/ZoomControl.svelte';
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
	let cAdjust: tCanvasAdjust;
	let zAdjust: tCanvasAdjust;
	function canvasRedrawFull() {
		const ctx1 = canvasFull.getContext('2d') as CanvasRenderingContext2D;
		ctx1.clearRect(0, 0, ctx1.canvas.width, ctx1.canvas.height);
		cAdjust = eList.getAdjustFull(ctx1.canvas.width, ctx1.canvas.height);
		eList.draw(ctx1, cAdjust);
		// extra drawing
		//point(5, 5).draw(ctx1, cAdjust, 'green');
		//point(5, 15).draw(ctx1, cAdjust, 'blue', 'rectangle');
		for (const i of [10, 100, 200]) {
			point(i, 0).draw(ctx1, cAdjust, colors.reference, 'cross');
			point(-i, 0).draw(ctx1, cAdjust, colors.reference, 'cross');
			point(0, i).draw(ctx1, cAdjust, colors.reference, 'cross');
			point(0, -i).draw(ctx1, cAdjust, colors.reference, 'cross');
		}
		point(0, 0).draw(ctx1, cAdjust, colors.origin, 'cross');
	}
	function canvasRedrawZoom() {
		const ctx2 = canvasZoom.getContext('2d') as CanvasRenderingContext2D;
		ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
		if (zAdjust === undefined || zAdjust.init === 0) {
			zAdjust = eList.getAdjustZoom(ctx2.canvas.width, ctx2.canvas.height);
			//console.log(`dbg047: init zAdjust: ${zAdjust.xMin} ${zAdjust.yMin}`);
		}
		eList.draw(ctx2, zAdjust);
		// extra drawing
		for (const i of [10, 100, 200]) {
			point(i, 0).draw(ctx2, zAdjust, colors.reference, 'cross');
			point(-i, 0).draw(ctx2, zAdjust, colors.reference, 'cross');
			point(0, i).draw(ctx2, zAdjust, colors.reference, 'cross');
			point(0, -i).draw(ctx2, zAdjust, colors.reference, 'cross');
		}
		point(0, 0).draw(ctx2, zAdjust, colors.origin, 'cross');
	}
	function canvasSetSize() {
		//console.log(`windowWidth: ${windowWidth}`);
		const ctx1 = canvasFull.getContext('2d') as CanvasRenderingContext2D;
		const canvas_size = Math.max(0.4 * windowWidth, canvas_size_min);
		ctx1.canvas.width = canvas_size;
		ctx1.canvas.height = canvas_size;
	}
	function canvasResize() {
		canvasSetSize();
		canvasRedrawFull();
		canvasRedrawZoom();
	}
	let domInit = 0;
	function geomRedraw(iSimTime: number) {
		const points = geom(iSimTime, pObj);
		eList.clear();
		for (const p of points) {
			eList.addPoint(p);
		}
		canvasRedrawFull();
		canvasRedrawZoom();
		domInit = 1;
	}
	onMount(() => {
		// initial drawing
		canvasSetSize();
		geomRedraw(simTime);
	});
	$: {
		//console.log(`dbg050: ${simTime}`);
		if (domInit === 1) {
			geomRedraw(simTime);
		}
	}
	function zoomScale(iFactor: number) {
		const shift = (1 - iFactor) / 2;
		zAdjust.xMin += shift * zAdjust.xyDiff;
		zAdjust.yMin += shift * zAdjust.xyDiff;
		zAdjust.xyDiff *= iFactor;
		zAdjust.scaleX *= 1.0 / iFactor;
		zAdjust.scaleY *= 1.0 / iFactor;
	}
	function zoomClick(event: CustomEvent<{ action: string }>) {
		//console.log(`dbg094: ${event.detail.action}`);
		switch (event.detail.action) {
			case 'zoomInit':
				zAdjust.init = 0;
				break;
			case 'zoomIn':
				zoomScale(0.7);
				break;
			case 'zoomOut':
				zoomScale(1.3);
				break;
			case 'moveLeft':
				zAdjust.xMin += -0.2 * zAdjust.xyDiff;
				break;
			case 'moveRight':
				zAdjust.xMin += 0.2 * zAdjust.xyDiff;
				break;
			case 'moveUp':
				zAdjust.yMin += 0.2 * zAdjust.xyDiff;
				break;
			case 'moveDown':
				zAdjust.yMin += -0.2 * zAdjust.xyDiff;
				break;
			default:
				console.log(`ERR423: ${event.detail.action} has no case!`);
		}
		canvasRedrawZoom();
	}
	// zoom functions on the canvasFull
	type tMouse = {
		timestamp: number;
		offsetX: number;
		offsetY: number;
	};
	const mouseDelayMax = 3000; // only action if mouse-up occurs less than 3000 ms after mouse-down
	const mouseDiffClick = 10; // if diffX and diffY are smaller than 10 pixel then it's a click
	const mouseDiffRatioSelect = 3; // The selection must be more or less a square
	let mouseF: tMouse = { timestamp: 0, offsetX: 0, offsetY: 0 };
	function cFullMouseDn(eve: MouseEvent) {
		//console.log(`dbg131: cFullMouseDn ${eve.offsetX} ${eve.offsetY} ${eve.button}`);
		// left click
		if (eve.button === 0) {
			mouseF.timestamp = Date.now();
			mouseF.offsetX = eve.offsetX;
			mouseF.offsetY = eve.offsetY;
			//const ctx1 = canvasFull.getContext('2d') as CanvasRenderingContext2D;
			//const [px, py] = canvas2point(eve.offsetX, eve.offsetY, cAdjust);
			//point(px, py).draw(ctx1, cAdjust, colors.mouse, 'rectangle');
		}
	}
	function cFullMouseUp(eve: MouseEvent) {
		//console.log(`dbg139: cFullMouseUp ${eve.offsetX} ${eve.offsetY} ${eve.button}`);
		// left click
		if (eve.button === 0) {
			//const ctx1 = canvasFull.getContext('2d') as CanvasRenderingContext2D;
			//const [px, py] = canvas2point(eve.offsetX, eve.offsetY, cAdjust);
			//point(px, py).draw(ctx1, cAdjust, colors.mouse, 'circle');
			if (Date.now() - mouseF.timestamp < mouseDelayMax) {
				const diffX = Math.abs(mouseF.offsetX - eve.offsetX);
				const diffY = Math.abs(mouseF.offsetY - eve.offsetY);
				if (diffX < mouseDiffClick && diffY < mouseDiffClick) {
					console.log(`dbg160: a click at ${eve.offsetX} ${eve.offsetY}`);
					const [px, py] = canvas2point(eve.offsetX, eve.offsetY, cAdjust);
					zAdjust = adjustCenter(px, py, zAdjust);
					geomRedraw(simTime);
				}
				if (diffX > mouseDiffClick && diffY > mouseDiffClick) {
					const diffRatio1 = diffX / diffY;
					const diffRatio2 = 1.0 / diffRatio1;
					if (diffRatio1 < mouseDiffRatioSelect && diffRatio2 < mouseDiffRatioSelect) {
						console.log(`dbg160: a selection at ${eve.offsetX} ${eve.offsetY}`);
						const [p1x, p1y] = canvas2point(eve.offsetX, eve.offsetY, cAdjust);
						const [p2x, p2y] = canvas2point(mouseF.offsetX, mouseF.offsetY, cAdjust);
						zAdjust = adjustRect(p1x, p1y, p2x, p2y, canvas_size_min, canvas_size_min);
						geomRedraw(simTime);
					}
				}
			} else {
				console.log(`dbg205: ignore ${eve.offsetX} ${eve.offsetY} because too slow`);
			}
		}
	}
	// just drawing a rectangle to help zooming
	function cFullMouseMove(eve: MouseEvent) {
		//console.log(`dbg179: cFullMouseMove ${eve.offsetX} ${eve.offsetY} ${eve.buttons}`);
		// left click
		if (eve.buttons === 1) {
			const diffX = eve.offsetX - mouseF.offsetX;
			const diffY = eve.offsetY - mouseF.offsetY;
			canvasRedrawFull();
			const ctx1 = canvasFull.getContext('2d') as CanvasRenderingContext2D;
			ctx1.beginPath();
			ctx1.rect(mouseF.offsetX, mouseF.offsetY, diffX, diffY);
			ctx1.strokeStyle = colors.mouse;
			ctx1.stroke();
		}
	}
</script>

<svelte:window bind:innerWidth={windowWidth} on:resize={canvasResize} />
<section>
	<h2>Parameters</h2>
	{#each params.params as param}
		<article class="oneParam">
			<span>{param.name}:</span>
			<input
				type="number"
				bind:value={pObj[param.name]}
				min={param.min}
				max={param.max}
				step={param.step}
				on:change={() => geomRedraw(simTime)}
			/>
			<input
				type="range"
				bind:value={pObj[param.name]}
				min={param.min}
				max={param.max}
				step={param.step}
				on:change={() => geomRedraw(simTime)}
			/>
			<span
				>unit: {param.unit}, init: {param.init}, min: {param.min}, max: {param.max}, step: {param.step}</span
			>
		</article>
	{/each}
</section>
<section>
	<h2>Log</h2>
	<h2>Drawing</h2>
	<div class="rack">
		<TimeControl
			tMax={params.sim.tMax}
			tStep={params.sim.tStep}
			tUpdate={params.sim.tUpdate}
			bind:simTime
		/>
		<canvas
			class="full"
			width={canvas_size_min}
			height={canvas_size_min}
			bind:this={canvasFull}
			on:mousedown={cFullMouseDn}
			on:mouseup={cFullMouseUp}
			on:mousemove={cFullMouseMove}
		/>
	</div>
	<div class="rack">
		<canvas
			class="zoom"
			width={canvas_size_min}
			height={canvas_size_min}
			bind:this={canvasZoom}
		/>
		<ZoomControl on:myevent={zoomClick} />
	</div>
</section>
<section>
	<h2>Export</h2>
</section>

<style lang="scss">
	@use '$lib/style/colors.scss';

	section > h2 {
		color: colors.$pde-title;
	}
	section > article > span {
		color: colors.$pde-params;
	}
	section > div.rack {
		display: inline-block;
		margin: 1rem;
		text-align: center;
	}
	section > div.rack > canvas {
		//display: block;
		background-color: colors.$pde-canvas;
		margin: 0.2rem;
	}
	section > div.rack > canvas.full {
		margin-bottom: 2.8rem;
	}
</style>
