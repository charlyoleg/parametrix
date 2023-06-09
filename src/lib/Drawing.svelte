<script lang="ts">
	import type { tCanvasAdjust } from '$lib/geom/canvas_utils';
	import {
		colors,
		canvas2point,
		adjustCenter,
		adjustRect,
		adjustScale,
		adjustTranslate
	} from '$lib/geom/canvas_utils';
	import TimeControl from '$lib/TimeControl.svelte';
	import ZoomControl from '$lib/ZoomControl.svelte';
	import LabelCheckbox from '$lib/LabelCheckbox.svelte';
	import type { tLayers, Figure } from '$lib/geom/figure';
	import { initLayers } from '$lib/geom/figure';
	import type { tParamDef, tParamVal, tGeomFunc } from '$lib/design/aaParamGeom';
	import { storePV } from '$lib/storePVal';
	import { dLayers } from '$lib/drawingLayers';
	import { onMount } from 'svelte';

	export let pDef: tParamDef;
	export let geom: tGeomFunc;
	export let simTime = 0;

	let windowWidth: number;
	let canvasFull: HTMLCanvasElement;
	let canvasZoom: HTMLCanvasElement;
	const canvas_size_min = 400;

	// Canavas Figures
	let layers = initLayers();
	let aFigure: Figure;
	let cAdjust: tCanvasAdjust;
	let zAdjust: tCanvasAdjust;
	$: layers = $dLayers;
	function canvasRedrawFull(iLayers: tLayers) {
		const ctx1 = canvasFull.getContext('2d') as CanvasRenderingContext2D;
		ctx1.clearRect(0, 0, ctx1.canvas.width, ctx1.canvas.height);
		try {
			cAdjust = aFigure.getAdjustFull(ctx1.canvas.width, ctx1.canvas.height);
			aFigure.draw(ctx1, cAdjust, iLayers);
		} catch (emsg) {
			//rGeome.logstr += emsg;
			console.log(emsg);
		}
		// extra drawing
		//point(5, 5).draw(ctx1, cAdjust, 'green');
		//point(5, 15).draw(ctx1, cAdjust, 'blue', 'rectangle');
	}
	function canvasRedrawZoom(iLayers: tLayers) {
		const ctx2 = canvasZoom.getContext('2d') as CanvasRenderingContext2D;
		ctx2.clearRect(0, 0, ctx2.canvas.width, ctx2.canvas.height);
		try {
			if (zAdjust === undefined || zAdjust.init === 0) {
				zAdjust = aFigure.getAdjustZoom(ctx2.canvas.width, ctx2.canvas.height);
				//console.log(`dbg047: init zAdjust: ${zAdjust.xMin} ${zAdjust.yMin}`);
			}
			aFigure.draw(ctx2, zAdjust, iLayers);
		} catch (emsg) {
			//rGeome.logstr += emsg;
			console.log(emsg);
		}
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
		canvasRedrawFull(layers);
		canvasRedrawZoom(layers);
	}
	let domInit = 0;
	function geomRedrawSub(iSimTime: number, pVal: tParamVal, iLayers: tLayers) {
		aFigure = geom(iSimTime, pVal).fig;
		canvasRedrawFull(iLayers);
		canvasRedrawZoom(iLayers);
		domInit = 1;
	}
	function geomRedraw(iSimTime: number) {
		geomRedrawSub(iSimTime, $storePV[pDef.page], layers);
	}
	onMount(() => {
		// initial drawing
		canvasSetSize();
		geomRedraw(simTime);
		//paramChange();
	});
	// reactivity on simTime, $storePV and layers
	$: {
		if (domInit === 1) {
			geomRedrawSub(simTime, $storePV[pDef.page], layers);
		}
	}
	// Zoom stories
	function zoomClick(event: CustomEvent<{ action: string }>) {
		//console.log(`dbg094: ${event.detail.action}`);
		switch (event.detail.action) {
			case 'zoomInit':
				zAdjust.init = 0;
				break;
			case 'zoomIn':
				zAdjust = adjustScale(0.7, zAdjust);
				break;
			case 'zoomOut':
				zAdjust = adjustScale(1.3, zAdjust);
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
		canvasRedrawZoom(layers);
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
					//console.log(`dbg160: a click at ${eve.offsetX} ${eve.offsetY}`);
					const [px, py] = canvas2point(eve.offsetX, eve.offsetY, cAdjust);
					zAdjust = adjustCenter(px, py, zAdjust);
					geomRedraw(simTime);
				}
				if (diffX > mouseDiffClick && diffY > mouseDiffClick) {
					const diffRatio1 = diffX / diffY;
					const diffRatio2 = 1.0 / diffRatio1;
					if (diffRatio1 < mouseDiffRatioSelect && diffRatio2 < mouseDiffRatioSelect) {
						//console.log(`dbg160: a selection at ${eve.offsetX} ${eve.offsetY}`);
						const [p1x, p1y] = canvas2point(eve.offsetX, eve.offsetY, cAdjust);
						const [p2x, p2y] = canvas2point(mouseF.offsetX, mouseF.offsetY, cAdjust);
						zAdjust = adjustRect(p1x, p1y, p2x, p2y, canvas_size_min, canvas_size_min);
						geomRedraw(simTime);
					}
				}
			} else {
				console.log(`Warn205: ignore ${eve.offsetX} ${eve.offsetY} because too slow`);
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
			canvasRedrawFull(layers);
			const ctx1 = canvasFull.getContext('2d') as CanvasRenderingContext2D;
			ctx1.beginPath();
			ctx1.rect(mouseF.offsetX, mouseF.offsetY, diffX, diffY);
			ctx1.strokeStyle = colors.mouse;
			ctx1.stroke();
		}
	}
	// translate Zoom drawing
	let mouseZx: number;
	let mouseZy: number;
	let mouseZadjust: tCanvasAdjust;
	function cZoomMouseDn(eve: MouseEvent) {
		//console.log(`dbg231: cZoomMouseDn ${eve.offsetX} ${eve.offsetY} ${eve.button}`);
		// left click
		if (eve.button === 0) {
			const [p1x, p1y] = canvas2point(eve.offsetX, eve.offsetY, zAdjust);
			mouseZx = p1x; // point
			mouseZy = p1y;
			mouseZadjust = structuredClone(zAdjust); // deepCopy
			//const ctx2 = canvasZoom.getContext('2d') as CanvasRenderingContext2D;
			//const [px, py] = canvas2point(eve.offsetX, eve.offsetY, cAdjust);
			//point(px, py).draw(ctx2, cAdjust, colors.mouse, 'rectangle');
		}
	}
	function cZoomMouseMove(eve: MouseEvent) {
		//console.log(`dbg202: cZoomMouseMove ${eve.offsetX} ${eve.offsetY} ${eve.buttons}`);
		// left click
		if (eve.buttons === 1) {
			const [p2x, p2y] = canvas2point(eve.offsetX, eve.offsetY, mouseZadjust);
			zAdjust = adjustTranslate(mouseZx, mouseZy, p2x, p2y, mouseZadjust);
			canvasRedrawZoom(layers);
		}
	}
	function cZoomWheel(eve: WheelEvent) {
		if (eve.deltaY > 0) {
			zAdjust = adjustScale(0.7, zAdjust);
		} else {
			zAdjust = adjustScale(1.3, zAdjust);
		}
		canvasRedrawZoom(layers);
	}
</script>

<svelte:window bind:innerWidth={windowWidth} on:resize={canvasResize} />
<section>
	<h2>Drawing</h2>
	<LabelCheckbox />
	<div class="rack">
		<TimeControl
			tMax={pDef.sim.tMax}
			tStep={pDef.sim.tStep}
			tUpdate={pDef.sim.tUpdate}
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
			on:mousedown={cZoomMouseDn}
			on:mousemove={cZoomMouseMove}
			on:wheel|preventDefault={cZoomWheel}
		/>
		<ZoomControl on:myevent={zoomClick} />
	</div>
</section>

<style lang="scss">
	@use '$lib/style/colors.scss';
	@use '$lib/style/styling.scss';

	section > h2 {
		@include styling.mix-h2;
	}
	section > div.rack {
		display: inline-block;
		margin: 0 1rem 0;
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
