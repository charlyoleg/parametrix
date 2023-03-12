<script lang="ts">
	import { radToDeg, point } from '$lib/geom/euclid2d.js';
	import { onMount } from 'svelte';

	const canvas_size_min = 400;

	//const p1 = Point(0, 0);
	//const p2 = Point(5, 5);
	//const l1 = Line(p1, p2);
	//const a1 = Arc(p1, p2, 1);
	const p1 = point(10, 10);
	const p2 = point(10, 30);

	onMount(() => {
		function redraw() {
			console.log(`p1: ${p1.cx} ${p1.cy}`);
			console.log(`conversion: ${radToDeg(1)}`);
			const vw = document.documentElement.clientWidth;
			const canvas1 = document.getElementById('full') as HTMLCanvasElement;
			const ctx1 = canvas1.getContext('2d') as CanvasRenderingContext2D;
			const canvas_size = Math.max(0.4 * vw, canvas_size_min);
			ctx1.canvas.width = canvas_size;
			ctx1.canvas.height = canvas_size;
			const [ox, oy] = [canvas_size / 2, canvas_size / 2];
			ctx1.fillStyle = '#00aa00';
			ctx1.fillRect(0, 0, 80, 80);
			p1.draw(ctx1, ox, oy);
			p2.draw(ctx1, ox, oy);
		}

		// initial drawing
		redraw();
		// redrawing when resizing the window
		window.addEventListener('resize', redraw);
	});
</script>

<h2>Circles</h2>
<article>A circle with circle holes.</article>
<canvas id="full" width={canvas_size_min} height={canvas_size_min} />
<canvas id="zoom" width={canvas_size_min} height={canvas_size_min} />

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
