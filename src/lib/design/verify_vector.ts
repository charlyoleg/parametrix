// verify_vector.ts

import { degToRad, point, vector, Figure } from '$lib/geom/figure';
import type { tParamDef, tParamVal, tGeom, tPageDef } from './aaParamGeom';

const pDef: tParamDef = {
	page: 'verify_vector',
	params: [
		{ name: 'p1x', unit: 'mm', init: 30, min: -200, max: 200, step: 1 },
		{ name: 'p1y', unit: 'mm', init: 50, min: -200, max: 200, step: 1 },
		{ name: 'p2x', unit: 'mm', init: 80, min: -200, max: 200, step: 1 },
		{ name: 'p2y', unit: 'mm', init: -30, min: -200, max: 200, step: 1 },
		{ name: 'v1a', unit: 'degree', init: 30, min: -200, max: 200, step: 1 },
		{ name: 'v1l', unit: 'mm', init: 60, min: 0, max: 200, step: 1 },
		{ name: 'v2a', unit: 'degree', init: 30, min: -200, max: 200, step: 1 },
		{ name: 'v2l', unit: 'mm', init: 60, min: 0, max: 200, step: 1 }
	],
	paramSvg: {
		p1x: 'verify_point_p1x.svg',
		p1y: 'verify_point_p1x.svg',
		p2x: 'verify_point_p1x.svg',
		p2y: 'verify_point_p1x.svg',
		v1a: 'verify_point_p1x.svg',
		v1l: 'verify_point_p1x.svg',
		v2a: 'verify_point_p1x.svg',
		v2l: 'verify_point_p1x.svg'
	},
	sim: {
		tMax: 10,
		tStep: 0.1,
		tUpdate: 500 // every 0.5 second
	}
};

function pGeom(t: number, param: tParamVal): tGeom {
	const rGeome: tGeom = { fig: new Figure(), logstr: '', calcErr: true };
	rGeome.logstr += `simTime: ${t}\n`;
	try {
		const p1 = point(param['p1x'], param['p1y'] + t);
		const p2 = point(param['p2x'], param['p2y']);
		const v1 = vector(degToRad(param['v1a']), param['v1l'], p1);
		const v2 = vector(degToRad(param['v2a']), param['v2l'], p1);
		rGeome.fig.addPoint(p1);
		rGeome.fig.addPoint(p2);
		rGeome.fig.addVector(v1);
		rGeome.fig.addVector(v2);
		const v3 = v1.add(v2);
		const p3 = v3.translatePoint(p2);
		rGeome.fig.addVector(v3);
		rGeome.fig.addPoint(p3);
		rGeome.logstr += 'verify_vector draw successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg;
		console.log(emsg);
	}
	return rGeome;
}

const pageDef: tPageDef = {
	pTitle: 'Verify vector',
	pDescription: 'Debugging vector.ts',
	pDef: pDef,
	pGeom: pGeom
};

export { pageDef };
