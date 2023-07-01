// verify_point.ts

import type { tParamDef, tParamVal, tGeom, tPageDef } from 'geometrix';
import { degToRad, point, figure, pNumber } from 'geometrix';

const pDef: tParamDef = {
	page: 'verify_point',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('p1x', 'mm', 30, -200, 200, 1),
		pNumber('p1y', 'mm', 50, -200, 200, 1),
		pNumber('p2a', 'degree', 30, -200, 200, 1),
		pNumber('p2l', 'mm', 60, 0, 200, 1),
		pNumber('rotateOrig', 'degree', 45, -200, 200, 1),
		pNumber('scaleOrig', 'scalar', 1.5, 0.1, 2, 0.1)
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
	const rGeome: tGeom = { fig: { one: figure() }, logstr: '', calcErr: true };
	rGeome.logstr += `simTime: ${t}\n`;
	try {
		const p1 = point(param['p1x'], param['p1y'] + t);
		const p2 = point(0, 0).setPolar(degToRad(param['p2a']), param['p2l']);
		const p3 = p1.rotateOrig(degToRad(param['rotateOrig']));
		const p4 = p1.scaleOrig(param['scaleOrig']);
		rGeome.fig.one.addPoint(p1);
		rGeome.fig.one.addPoint(p2);
		rGeome.fig.one.addPoint(p3);
		rGeome.fig.one.addPoint(p4);
		rGeome.logstr += 'verify_point draw successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg;
		console.log(emsg);
	}
	return rGeome;
}

const verifyPoint1Def: tPageDef = {
	pTitle: 'Verify point',
	pDescription: 'Debugging point.ts',
	pDef: pDef,
	pGeom: pGeom
};

export { verifyPoint1Def };
