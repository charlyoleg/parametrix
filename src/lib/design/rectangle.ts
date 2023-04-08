// rectangle.ts

import { point } from '$lib/geom/euclid2d';
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
	const rGeome: tGeom = { points: [], logstr: '' };
	rGeome.logstr += `simTime: ${t}\n`;
	const p1 = point(10, 10);
	const p2 = point(10 + param['width'], 10);
	const p3 = point(10 + param['width'], 10 + param['height']);
	const p4 = point(10, 10 + param['height']);
	const angle = (t * Math.PI) / 180;
	rGeome.points.push(p1);
	rGeome.points.push(p2.rotate(p1, angle));
	rGeome.points.push(p3.rotate(p1, angle));
	rGeome.points.push(p4.rotate(p1, angle));
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
