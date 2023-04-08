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
		tMax: 10,
		tStep: 0.1,
		tUpdate: 500
	}
};

function pGeom(t: number, param: tParamVal): tGeom {
	const rGeome: tGeom = { points: [], logstr: '' };
	rGeome.logstr += `simTime: ${t}\n`;
	rGeome.points.push(point(10 + param['width'], 10));
	rGeome.points.push(point(30, 30 + param['height']));
	rGeome.points.push(point(30, 0));
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
