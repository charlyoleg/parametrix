// rectangle.ts

import { point, figure } from '$lib/geom/figure';
import type { tParamDef, tParamVal, tGeom, tPageDef } from './aaParamGeom';
//import { fround } from './aaParamGeom';
import { pNumber } from './aaParamGeom';

const pDef: tParamDef = {
	page: 'rectangle',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('width', 'mm', 15, 3, 40, 0.5),
		pNumber('height', 'mm', 10, 3, 40, 0.5)
	],
	paramSvg: {
		width: 'rectangle_width.svg',
		height: 'rectangle_height.svg'
	},
	sim: {
		tMax: 120,
		tStep: 1,
		tUpdate: 500
	}
};

function pGeom(t: number, param: tParamVal): tGeom {
	const rGeome: tGeom = { fig: figure(), logstr: '', calcErr: true };
	rGeome.logstr += `simTime: ${t}\n`;
	try {
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
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg;
		console.log(emsg);
	}
	return rGeome;
}

const pageDef: tPageDef = {
	pTitle: 'Rectangle',
	pDescription: 'Just a rectangle.',
	pDef: pDef,
	pGeom: pGeom
};

export { pageDef };
