<script lang="ts">
	//import type { tCanvasAdjust } from '$lib/geom/canvas_utils';
	import { point, entityList } from '$lib/geom/euclid2d';
	import { onMount } from 'svelte';

	let windowWidth: number;
	let canvasFull: HTMLCanvasElement;
	let canvasZoom: HTMLCanvasElement;
	const canvas_size_min = 400;

	const eList = entityList();
	const tMax = 10;
	//const tStep = 0.1;
	function createGeom(t: number) {
		eList.clear();
		eList.addPoint(point(0, 0));
		const p1 = point(10, 10);
		const p2 = point(10, 30);
		eList.addPoint(p1);
		eList.addPoint(p2);
		for (let i = 0; i < 20; i++) {
			eList.addPoint(
				p1.scale(p2, 1 + 0.2 * i).rotate(p2, (i * Math.PI) / 12 + (t * Math.PI) / 2 / tMax)
			);
		}
	}
	createGeom(0);
	function canvasRedraw() {
		console.log(`windowWidth: ${windowWidth}`);
		const ctx1 = canvasFull.getContext('2d') as CanvasRenderingContext2D;
		const canvas_size = Math.max(0.4 * windowWidth, canvas_size_min);
		ctx1.canvas.width = canvas_size;
		ctx1.canvas.height = canvas_size;
		eList.draw(ctx1);
		// extra drawing
		const cAdjust = eList.getCanvasAdjust(ctx1.canvas.width, ctx1.canvas.height);
		point(5, 5).draw(ctx1, cAdjust, 'green');
		point(5, 15).draw(ctx1, cAdjust, 'blue', 'rectangle');
		point(5, 25).draw(ctx1, cAdjust, 'red', 'cross');
	}
	onMount(() => {
		// initial drawing
		canvasRedraw();
	});
</script>

<svelte:window bind:innerWidth={windowWidth} on:resize={canvasRedraw} />

<h1>Circles</h1>
<article>A circle with circle holes.</article>
<canvas id="full" width={canvas_size_min} height={canvas_size_min} bind:this={canvasFull} />
<canvas id="zoom" width={canvas_size_min} height={canvas_size_min} bind:this={canvasZoom} />

<style lang="scss">
	@use '$lib/style/colors.scss';

	h1 {
		margin: 1rem;
	}
	canvas {
		//display: block;
		background-color: pink;
		margin: 1rem;
	}
</style>
