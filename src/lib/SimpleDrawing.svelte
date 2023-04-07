<script lang="ts">
	import type { tCanvasAdjust } from '$lib/geom/canvas_utils';
	import { colors } from '$lib/geom/canvas_utils';
	import { point, entityList } from '$lib/geom/euclid2d';
	import type { tParamVal, tGeomFunc } from '$lib/design/aaParamGeom';
	import { onMount } from 'svelte';

	export let pVal: tParamVal;
	export let pValEve: number;
	export let geom: tGeomFunc;
	export let simTime = 0;

	let canvasMini: HTMLCanvasElement;
	const canvas_size_mini = 200;

	// Canavas Figures
	const eList = entityList();
	let mAdjust: tCanvasAdjust;
	function canvasRedrawMini() {
		const ctx1 = canvasMini.getContext('2d') as CanvasRenderingContext2D;
		ctx1.clearRect(0, 0, ctx1.canvas.width, ctx1.canvas.height);
		mAdjust = eList.getAdjustFull(ctx1.canvas.width, ctx1.canvas.height);
		eList.draw(ctx1, mAdjust);
		// extra drawing
		//point(5, 5).draw(ctx1, mAdjust, 'green');
		//point(5, 15).draw(ctx1, mAdjust, 'blue', 'rectangle');
		for (const i of [10, 100, 200]) {
			point(i, 0).draw(ctx1, mAdjust, colors.reference, 'cross');
			point(-i, 0).draw(ctx1, mAdjust, colors.reference, 'cross');
			point(0, i).draw(ctx1, mAdjust, colors.reference, 'cross');
			point(0, -i).draw(ctx1, mAdjust, colors.reference, 'cross');
		}
		point(0, 0).draw(ctx1, mAdjust, colors.origin, 'cross');
	}
	let domInit = 0;
	function geomRedraw(iSimTime: number) {
		const geome = geom(iSimTime, pVal);
		eList.clear();
		for (const p of geome.points) {
			eList.addPoint(p);
		}
		canvasRedrawMini();
		domInit = 1;
	}
	onMount(() => {
		// initial drawing
		geomRedraw(simTime);
		//paramChange();
	});
	// reactivity on simTime and pValEve
	$: {
		//console.log(`dbg101: pValEve: ${pValEve}`);
		pValEve = pValEve;
		if (domInit === 1) {
			geomRedraw(simTime);
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
