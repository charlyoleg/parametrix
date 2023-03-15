<script lang="ts">
	import { MenuSet, setMenu } from '$lib/menuList.js';
	import Navigat from '$lib/Navigat.svelte';

	import type { CanvasAdjust } from '$lib/geom/canvas_utils.js';
	import { point } from '$lib/geom/euclid2d.js';
	import { onMount } from 'svelte';

	let windowWidth: number;
	let canvasFull: HTMLCanvasElement;
	let canvasZoom: HTMLCanvasElement;
	const canvas_size_min = 400;

	//const p1 = Point(0, 0);
	//const p2 = Point(5, 5);
	//const l1 = Line(p1, p2);
	//const a1 = Arc(p1, p2, 1);
	const p1 = point(10, 10);
	const p2 = point(10, 30);

	function canvasRedraw() {
		console.log(`windowWidth: ${windowWidth}`);
		const ctx1 = canvasFull.getContext('2d') as CanvasRenderingContext2D;
		const canvas_size = Math.max(0.4 * windowWidth, canvas_size_min);
		ctx1.canvas.width = canvas_size;
		ctx1.canvas.height = canvas_size;
		const cAdjust: CanvasAdjust = {
			oX: canvas_size / 2,
			oY: canvas_size / 2,
			scaleX: 1.0,
			scaleY: 1.0
		};
		p1.draw(ctx1, cAdjust);
		p2.draw(ctx1, cAdjust);
	}

	onMount(() => {
		// initial drawing
		canvasRedraw();
	});

	setMenu(MenuSet.First);
</script>

<Navigat />

<svelte:window bind:innerWidth={windowWidth} on:resize={canvasRedraw} />

<h2>Circles</h2>
<article>A circle with circle holes.</article>
<canvas id="full" width={canvas_size_min} height={canvas_size_min} bind:this={canvasFull} />
<canvas id="zoom" width={canvas_size_min} height={canvas_size_min} bind:this={canvasZoom} />

<style lang="scss">
	@use '$lib/style/colors.scss';

	h2 {
		margin: 0;
	}
	canvas {
		//display: block;
		background-color: pink;
		margin: 1rem;
	}
</style>
