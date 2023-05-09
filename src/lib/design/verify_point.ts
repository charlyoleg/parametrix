// verify_point.ts

import { degToRad, point, figure } from '$lib/geom/figure';
import type { tParamDef, tParamVal, tGeom, tPageDef } from './aaParamGeom';

const pDef: tParamDef = {
	page: 'verify_point',
	params: [
		{ name: 'p1x', unit: 'mm', init: 30, min: -200, max: 200, step: 1 },
		{ name: 'p1y', unit: 'mm', init: 50, min: -200, max: 200, step: 1 },
		{ name: 'p2a', unit: 'degree', init: 30, min: -200, max: 200, step: 1 },
		{ name: 'p2l', unit: 'mm', init: 60, min: 0, max: 200, step: 1 },
		{ name: 'rotateOrig', unit: 'degree', init: 45, min: -200, max: 200, step: 1 },
		{ name: 'scaleOrig', unit: 'scalar', init: 1.5, min: 0.1, max: 2, step: 0.1 }
	],
	paramSvg: {
		p1x: 'verify_point_p1x.svg',
		p1y: 'verify_point_p1x.svg',
		p2a: 'verify_point_p1x.svg',
		p2l: 'verify_point_p1x.svg',
		rotateOrig: 'verify_point_p1x.svg',
		scaleOrig: 'verify_point_p1x.svg'
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
		const p2 = point(0, 0).setPolar(degToRad(param['p2a']), param['p2l']);
		const p3 = p1.rotateOrig(degToRad(param['rotateOrig']));
		const p4 = p1.scaleOrig(param['scaleOrig']);
		rGeome.fig.addPoint(p1);
		rGeome.fig.addPoint(p2);
		rGeome.fig.addPoint(p3);
		rGeome.fig.addPoint(p4);
		rGeome.logstr += 'verify_point draw successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg;
		console.log(emsg);
	}
	return rGeome;
}

const pageDef: tPageDef = {
	pTitle: 'Verify point',
	pDescription: 'Debugging point.ts',
	pDef: pDef,
	pGeom: pGeom
};

export { pageDef };
