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

	// load parameters
	let paramFiles: FileList;
	function loadFile(fileP: File) {
		const reader = new FileReader();
		reader.addEventListener('loadend', () => {
			const paramJson: tPObj = JSON.parse(reader.result as string);
			//console.log(`dbg345`);
			for (const p of params.params) {
				if (Object.hasOwn(paramJson, p.name)) {
					pObj[p.name] = paramJson[p.name];
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
		const file_name = `px_${params.page}_${datestr}.json`;
		const file_content = JSON.stringify(pObj, null, '  ');
		download_file(file_name, file_content);
		console.log(`dbg343: ${file_name}`);
	}
	// Canavas Figures
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
		const geome = geom(iSimTime, pObj);
		eList.clear();
		for (const p of geome.points) {
			eList.addPoint(p);
		}
		canvasRedrawFull();
		canvasRedrawZoom();
		domInit = 1;
	}
	onMount(() => {
		// initial drawing
		canvasSetSize();
		//geomRedraw(simTime);
		paramChange();
	});
	$: {
		//console.log(`dbg050: ${simTime}`);
		if (domInit === 1) {
			geomRedraw(simTime);
		}
	}
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
			canvasRedrawZoom();
		}
	}
	function cZoomWheel(eve: WheelEvent) {
		if (eve.deltaY > 0) {
			zAdjust = adjustScale(0.7, zAdjust);
		} else {
			zAdjust = adjustScale(1.3, zAdjust);
		}
		canvasRedrawZoom();
	}
	// log and paramChange
	let logValue = 'Dummy initial\nWill be replaced during onMount\n';
	function paramChange() {
		logValue = 'Geometry computed at ' + new Date().toLocaleTimeString() + '\n';
		const geome = geom(simTime, pObj);
		logValue += geome.logstr;
		geomRedraw(simTime);
	}
</script>

<svelte:window bind:innerWidth={windowWidth} on:resize={canvasResize} />
<section>
	<h2>Parameters</h2>
	<label for="loadParams">Load Params from file</label>
	<input
		id="loadParams"
		type="file"
		accept="text/plain, application/json"
		bind:files={paramFiles}
	/>
	<button on:click={dowloadParams}>Set Params Default</button>
	<button on:click={dowloadParams}>Load Params from localStorage</button>
	{#each params.params as param}
		<article class="oneParam">
			<span>{param.name}:</span>
			<input
				type="number"
				bind:value={pObj[param.name]}
				min={param.min}
				max={param.max}
				step={param.step}
				on:change={paramChange}
			/>
			<input
				type="range"
				bind:value={pObj[param.name]}
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
</section>
<section>
	<h2>Log</h2>
	<textarea rows="5" cols="80" readonly wrap="off" bind:value={logValue} />
</section>
<section>
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
			on:mousedown={cZoomMouseDn}
			on:mousemove={cZoomMouseMove}
			on:wheel|preventDefault={cZoomWheel}
		/>
		<ZoomControl on:myevent={zoomClick} />
	</div>
</section>
<section>
	<h2>Export</h2>
	<select>
		<option value="svg">svg</option>
		<option value="sxf">dxf</option>
		<option value="png">png</option>
	</select>
	<button on:click={dowloadParams}>Save to File</button>
</section>

<style lang="scss">
	@use '$lib/style/colors.scss';

	section > h2 {
		color: colors.$pde-title;
	}
	section > article > span {
		color: colors.$pde-params;
	}
	section > textarea {
		resize: horizontal;
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
