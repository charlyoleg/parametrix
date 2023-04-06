<script lang="ts">
	import { point } from '$lib/geom/euclid2d';
	import type { tParamDef, tParamVal, tGeom } from '$lib/paramGeom';
	import { fround } from '$lib/paramGeom';
	import ParamDrawExport from '$lib/ParamDrawExport.svelte';

	const pi12 = fround(Math.PI / 12);
	const pi24 = fround(Math.PI / 24); // input-number min and step must be rounded to avoid UI issue
	const pi4 = fround(Math.PI / 4);
	const pi120 = fround(Math.PI / 120); // rounded to avoid UI issue
	const circleParams: tParamDef = {
		page: 'circle',
		params: [
			{ name: 'angle', unit: 'radian', init: pi12, min: pi24, max: pi4, step: pi120 },
			{ name: 'amplitude-offset', unit: 'mm', init: 1, min: 0.5, max: 4, step: 0.1 },
			{ name: 'amplitude-scale', unit: 'scalar', init: 0.2, min: 0.1, max: 0.5, step: 0.01 }
		],
		sim: {
			tMax: 10,
			tStep: 0.1,
			tUpdate: 500
		}
	};
	function circleGeom(t: number, param: tParamVal): tGeom {
		const rGeome: tGeom = { points: [], logstr: '' };
		rGeome.logstr += `simTime: ${t}\n`;
		//rGeome.points.push(point(0, 0));
		const p1 = point(10, 10);
		const p2 = point(10, 30);
		//rGeome.points.push(p1);
		rGeome.points.push(p2);
		for (let i = 0; i < 20; i++) {
			rGeome.points.push(
				p1
					.scale(p2, param['amplitude-offset'] + param['amplitude-scale'] * i)
					.rotate(p2, i * param['angle'] + (t * Math.PI) / 2 / circleParams.sim.tMax)
			);
		}
		rGeome.logstr += 'Circle draw successfully!\n';
		return rGeome;
	}
</script>

<h1>Circles</h1>
<article>A circle with circle holes.</article>
<ParamDrawExport pDef={circleParams} geom={circleGeom} />

<style lang="scss">
	@use '$lib/style/colors.scss';

	h1 {
		margin: 1rem 1rem 0;
	}
	article {
		font-size: 1rem;
		font-weight: 400;
		font-style: italic;
		margin: 0 1rem 2rem;
	}
</style>
