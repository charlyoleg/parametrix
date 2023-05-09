// verify_line_3.ts

import { point, bisector, circleCenter, figure } from '$lib/geom/figure';
import type { tParamDef, tParamVal, tGeom, tPageDef } from './aaParamGeom';

const pDef: tParamDef = {
	page: 'verify_line_3',
	params: [
		{ name: 'p1x', unit: 'mm', init: 30, min: -200, max: 200, step: 1 },
		{ name: 'p1y', unit: 'mm', init: 50, min: -200, max: 200, step: 1 },
		{ name: 'p2x', unit: 'mm', init: 40, min: -200, max: 200, step: 1 },
		{ name: 'p2y', unit: 'mm', init: -20, min: -200, max: 200, step: 1 },
		{ name: 'p3x', unit: 'mm', init: -30, min: -200, max: 200, step: 1 },
		{ name: 'p3y', unit: 'mm', init: 30, min: -200, max: 200, step: 1 }
	],
	paramSvg: {
		p1x: 'verify_line_p1x.svg',
		p1y: 'verify_line_p1x.svg',
		p2x: 'verify_line_p1x.svg',
		p2y: 'verify_line_p1x.svg',
		p3x: 'verify_line_p1x.svg',
		p3y: 'verify_line_p1x.svg'
	},
	sim: {
		tMax: 10,
		tStep: 0.1,
		tUpdate: 500 // every 0.5 second
	}
};

function pGeom(t: number, param: tParamVal): tGeom {
	const rGeome: tGeom = { fig: figure(), logstr: '', calcErr: true };
	rGeome.logstr += `simTime: ${t}\n`;
	try {
		const p1 = point(param['p1x'], param['p1y'] + t);
		const p2 = point(param['p2x'], param['p2y']);
		const p3 = point(param['p3x'], param['p3y']);
		rGeome.fig.addPoint(p1);
		rGeome.fig.addPoint(p2);
		rGeome.fig.addPoint(p3);
		const l1 = bisector(p1, p2);
		rGeome.fig.addLine(l1);
		const pCenter = circleCenter(p1, p2, p3);
		rGeome.fig.addPoint(pCenter);
		rGeome.logstr += 'verify_line_3 draw successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg;
		console.log(emsg);
	}
	return rGeome;
}

const pageDef: tPageDef = {
	pTitle: 'Verify line 3',
	pDescription: 'Debugging more more line.ts',
	pDef: pDef,
	pGeom: pGeom
};

export { pageDef };
