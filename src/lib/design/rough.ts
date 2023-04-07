// rough.ts

import { point } from '$lib/geom/euclid2d';
import type { tParamDef, tParamVal, tGeom, tPageDef } from './aaParamGeom';
//import { fround } from './aaParamGeom';

const pDef: tParamDef = {
	page: 'circles',
	params: [],
	sim: {
		tMax: 10,
		tStep: 0.1,
		tUpdate: 500
	}
};

function pGeom(t: number, param: tParamVal): tGeom {
	const rGeome: tGeom = { points: [], logstr: '' };
	rGeome.logstr += `simTime: ${t}\n`;
	rGeome.points.push(point(10, 10));
	rGeome.points.push(point(30, 30));
	rGeome.points.push(point(30, 0));
	rGeome.logstr += 'Rough draw successfully!\n';
	return rGeome;
}

const pageDef: tPageDef = {
	pTitle: 'Rough',
	pDescription: 'Just 3 points.',
	pDef: pDef,
	pGeom: pGeom
};

export { pageDef };
