<script lang="ts">
	import { Point, point } from '$lib/geom/euclid2d';
	import type { tParams, tGeom } from '$lib/paramGeom';
	import ParamDrawExport from '$lib/ParamDrawExport.svelte';

	const params: tParams = {
		params: [],
		sim: {
			tMax: 10,
			tStep: 0.1,
			tUpdate: 500
		}
	};
	function circleGeom(t: number): tGeom {
		const rList: Array<Point> = [];
		rList.push(point(0, 0));
		const p1 = point(10, 10);
		const p2 = point(10, 30);
		rList.push(p1);
		rList.push(p2);
		for (let i = 0; i < 20; i++) {
			rList.push(
				p1
					.scale(p2, 1 + 0.2 * i)
					.rotate(p2, (i * Math.PI) / 12 + (t * Math.PI) / 2 / params.sim.tMax)
			);
		}
		return rList;
	}
</script>

<h1>Circles</h1>
<article>A circle with circle holes.</article>
<ParamDrawExport {params} geom={circleGeom} />

<style lang="scss">
	@use '$lib/style/colors.scss';

	h1 {
		margin: 1rem;
	}
</style>
