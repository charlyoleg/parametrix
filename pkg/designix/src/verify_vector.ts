// verify_vector.ts

import type { tParamDef, tParamVal, tGeom, tPageDef } from 'geometrix';
import { degToRad, point, vector, figure, pNumber } from 'geometrix';

const pDef: tParamDef = {
	page: 'verify_vector',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('p1x', 'mm', 30, -200, 200, 1),
		pNumber('p1y', 'mm', 50, -200, 200, 1),
		pNumber('p2x', 'mm', 80, -200, 200, 1),
		pNumber('p2y', 'mm', -30, -200, 200, 1),
		pNumber('v1a', 'degree', 30, -200, 200, 1),
		pNumber('v1l', 'mm', 60, 0, 200, 1),
		pNumber('v2a', 'degree', 30, -200, 200, 1),
		pNumber('v2l', 'mm', 60, 0, 200, 1)
	],
	paramSvg: {
		p1x: 'verify_vector_p1x.svg',
		p1y: 'verify_vector_p1x.svg',
		p2x: 'verify_vector_p1x.svg',
		p2y: 'verify_vector_p1x.svg',
		v1a: 'verify_vector_p1x.svg',
		v1l: 'verify_vector_p1x.svg',
		v2a: 'verify_vector_p1x.svg',
		v2l: 'verify_vector_p1x.svg'
	},
	sim: {
		tMax: 10,
		tStep: 0.1,
		tUpdate: 500 // every 0.5 second
	}
};

function pGeom(t: number, param: tParamVal): tGeom {
	const rGeome: tGeom = { fig: { one: figure() }, logstr: '', calcErr: true };
	rGeome.logstr += `simTime: ${t}\n`;
	try {
		const p1 = point(param['p1x'], param['p1y'] + t);
		const p2 = point(param['p2x'], param['p2y']);
		const v1 = vector(degToRad(param['v1a']), param['v1l'], p1);
		const v2 = vector(degToRad(param['v2a']), param['v2l'], p1);
		rGeome.fig.one.addPoint(p1);
		rGeome.fig.one.addPoint(p2);
		rGeome.fig.one.addVector(v1);
		rGeome.fig.one.addVector(v2);
		const v3 = v1.add(v2);
		const p3 = v3.translatePoint(p2);
		rGeome.fig.one.addVector(v3);
		rGeome.fig.one.addPoint(p3);
		rGeome.logstr += 'verify_vector draw successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg;
		console.log(emsg);
	}
	return rGeome;
}

const verifyVector1Def: tPageDef = {
	pTitle: 'Verify vector',
	pDescription: 'Debugging vector.ts',
	pDef: pDef,
	pGeom: pGeom
};

export { verifyVector1Def };
