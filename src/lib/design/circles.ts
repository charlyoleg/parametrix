// circles.ts

import { degToRad, point, Figure } from '$lib/geom/euclid2d';
import type { tParamDef, tParamVal, tGeom, tPageDef } from './aaParamGeom';
//import { fround } from './aaParamGeom';

//const pi12 = fround(Math.PI / 12);
//const pi24 = fround(Math.PI / 24); // input-number min and step must be rounded to avoid UI issue
//const pi4 = fround(Math.PI / 4);
//const pi120 = fround(Math.PI / 120); // rounded to avoid UI issue

const pDef: tParamDef = {
	page: 'circles',
	params: [
		{ name: 'angle', unit: 'degree', init: 15, min: 5, max: 45, step: 1 },
		{ name: 'amplitude-offset', unit: 'mm', init: 1, min: 0.5, max: 4, step: 0.1 },
		{ name: 'amplitude-scale', unit: 'scalar', init: 0.2, min: 0.1, max: 0.5, step: 0.01 }
	],
	sim: {
		tMax: 10,
		tStep: 0.1,
		tUpdate: 500
	}
};

function pGeom(t: number, param: tParamVal): tGeom {
	const rGeome: tGeom = { fig: new Figure(), logstr: '' };
	rGeome.logstr += `simTime: ${t}\n`;
	//rGeome.fig.addPoint(point(0, 0));
	const p1 = point(10, 10);
	const p2 = point(10, 30);
	//rGeome.fig.addPoint(p1);
	rGeome.fig.addPoint(p2);
	for (let i = 0; i < 20; i++) {
		rGeome.fig.addPoint(
			p1
				.scale(p2, param['amplitude-offset'] + param['amplitude-scale'] * i)
				.rotate(p2, i * degToRad(param['angle']) + (t * Math.PI) / 2 / pDef.sim.tMax)
		);
	}
	rGeome.logstr += 'Circles draw successfully!\n';
	return rGeome;
}

const pageDef: tPageDef = {
	pTitle: 'Circles',
	pDescription: 'A spiral made by points.',
	pDef: pDef,
	pGeom: pGeom
};

export { pageDef };
