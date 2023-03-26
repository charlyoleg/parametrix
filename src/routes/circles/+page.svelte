<script lang="ts">
	import { point } from '$lib/geom/euclid2d';
	import type { tParams, tPObj, tGeom } from '$lib/paramGeom';
	import { fround } from '$lib/paramGeom';
	import ParamDrawExport from '$lib/ParamDrawExport.svelte';

	const circleParams: tParams = {
		params: [
			{
				name: 'angle',
				unit: 'radian',
				init: fround(Math.PI / 12),
				min: fround(Math.PI / 24),
				max: fround(Math.PI / 4),
				step: fround(Math.PI / 120)
			},
			{ name: 'amplitude-offset', unit: 'mm', init: 1, min: 0.5, max: 4, step: 0.1 },
			{ name: 'amplitude-scale', unit: 'scalar', init: 0.2, min: 0.1, max: 0.5, step: 0.01 }
		],
		sim: {
			tMax: 10,
			tStep: 0.1,
			tUpdate: 500
		}
	};
	function circleGeom(t: number, param: tPObj): tGeom {
		const rList: tGeom = [];
		rList.push(point(0, 0));
		const p1 = point(10, 10);
		const p2 = point(10, 30);
		rList.push(p1);
		rList.push(p2);
		for (let i = 0; i < 20; i++) {
			rList.push(
				p1
					.scale(p2, param['amplitude-offset'] + param['amplitude-scale'] * i)
					.rotate(p2, i * param['angle'] + (t * Math.PI) / 2 / circleParams.sim.tMax)
			);
		}
		return rList;
	}
</script>

<h1>Circles</h1>
<article>A circle with circle holes.</article>
<ParamDrawExport params={circleParams} geom={circleGeom} />

<style lang="scss">
	@use '$lib/style/colors.scss';

	h1 {
		margin: 1rem;
	}
</style>
