<script lang="ts">
	import type { tCanvasAdjust } from '$lib/geom/canvas_utils';
	//import { colors } from '$lib/geom/canvas_utils';
	//import type { tLayers } from '$lib/geom/figure';
	import { Figure, initLayers } from '$lib/geom/figure';
	import type { tParamVal, tGeomFunc } from '$lib/design/aaParamGeom';
	import { storePV } from '$lib/storePVal';
	import { onMount } from 'svelte';

	export let pageName: string;
	export let geom: tGeomFunc;
	export let simTime = 0;

	let canvasMini: HTMLCanvasElement;
	const canvas_size_mini = 200;

	const layers = initLayers();
	// Canavas Figures
	let aFigure: Figure;
	let mAdjust: tCanvasAdjust;
	function canvasRedrawMini() {
		const ctx1 = canvasMini.getContext('2d') as CanvasRenderingContext2D;
		ctx1.clearRect(0, 0, ctx1.canvas.width, ctx1.canvas.height);
		try {
			mAdjust = aFigure.getAdjustFull(ctx1.canvas.width, ctx1.canvas.height);
			aFigure.draw(ctx1, mAdjust, layers);
		} catch (emsg) {
			//rGeome.logstr += emsg;
			console.error(emsg);
		}
		// extra drawing
		//point(5, 5).draw(ctx1, mAdjust, 'green');
		//point(5, 15).draw(ctx1, mAdjust, 'blue', 'rectangle');
	}
	let domInit = 0;
	function geomRedraw(iSimTime: number, ipVal: tParamVal) {
		aFigure = geom(iSimTime, ipVal).fig;
		canvasRedrawMini();
		domInit = 1;
	}
	onMount(() => {
		// initial drawing
		geomRedraw(simTime, $storePV[pageName]);
		//paramChange();
	});
	// reactivity on simTime and $storePV
	$: {
		if (domInit === 1) {
			geomRedraw(simTime, $storePV[pageName]);
		}
	}
</script>

<canvas class="mini" width={canvas_size_mini} height={canvas_size_mini} bind:this={canvasMini} />

<style lang="scss">
	@use '$lib/style/colors.scss';
	@use '$lib/style/styling.scss';

	canvas {
		background-color: colors.$pde-canvas;
	}
</style>
