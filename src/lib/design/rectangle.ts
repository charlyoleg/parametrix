// rectangle.ts

import { point, Figure } from '$lib/geom/figure';
import type { tParamDef, tParamVal, tGeom, tPageDef } from './aaParamGeom';
//import { fround } from './aaParamGeom';

const pDef: tParamDef = {
	page: 'rectangle',
	params: [
		{ name: 'width', unit: 'mm', init: 15, min: 3, max: 40, step: 0.5 },
		{ name: 'height', unit: 'mm', init: 10, min: 3, max: 40, step: 0.5 }
	],
	sim: {
		tMax: 120,
		tStep: 1,
		tUpdate: 500
	}
};

function pGeom(t: number, param: tParamVal): tGeom {
	const rGeome: tGeom = { fig: new Figure(), logstr: '' };
	rGeome.logstr += `simTime: ${t}\n`;
	const p1 = point(10, 10);
	const p2 = point(10 + param['width'], 10);
	const p3 = point(10 + param['width'], 10 + param['height']);
	const p4 = point(10, 10 + param['height']);
	const angle = (t * Math.PI) / 180;
	rGeome.fig.addPoint(p1);
	rGeome.fig.addPoint(p2.rotate(p1, angle));
	rGeome.fig.addPoint(p3.rotate(p1, angle));
	rGeome.fig.addPoint(p4.rotate(p1, angle));
	rGeome.logstr += 'Rectangle draw successfully!\n';
	return rGeome;
}

const pageDef: tPageDef = {
	pTitle: 'Rectangle',
	pDescription: 'Just a rectangle.',
	pDef: pDef,
	pGeom: pGeom
};

export { pageDef };
