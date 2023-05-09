// verify_line_2.ts

import { point, line, figure } from '$lib/geom/figure';
import type { tParamDef, tParamVal, tGeom, tPageDef } from './aaParamGeom';
import { degToRad } from '$lib/geom/angle_utils';

const pDef: tParamDef = {
	page: 'verify_line_2',
	params: [
		{ name: 'l1cx', unit: 'mm', init: 10, min: -200, max: 200, step: 1 },
		{ name: 'l1cy', unit: 'mm', init: 20, min: -200, max: 200, step: 1 },
		{ name: 'l1ca', unit: 'degree', init: 15, min: -200, max: 200, step: 1 },
		{ name: 'l2cx', unit: 'mm', init: 30, min: -200, max: 200, step: 1 },
		{ name: 'l2cy', unit: 'mm', init: 50, min: -200, max: 200, step: 1 },
		{ name: 'l2ca', unit: 'degree', init: 35, min: -200, max: 200, step: 1 },
		{ name: 'p3x', unit: 'mm', init: -30, min: -200, max: 200, step: 1 },
		{ name: 'p3y', unit: 'mm', init: 30, min: -200, max: 200, step: 1 }
	],
	paramSvg: {
		l1cx: 'verify_line_2_l1cx.svg',
		l1cy: 'verify_line_2_l1cx.svg',
		l1ca: 'verify_line_2_l1cx.svg',
		l2cx: 'verify_line_2_l1cx.svg',
		l2cy: 'verify_line_2_l1cx.svg',
		l2ca: 'verify_line_2_l1cx.svg',
		p3x: 'verify_line_2_l1cx.svg',
		p3y: 'verify_line_2_l1cx.svg'
	},
	sim: {
		tMax: 100,
		tStep: 0.1,
		tUpdate: 500 // every 0.5 second
	}
};

function pGeom(t: number, param: tParamVal): tGeom {
	const rGeome: tGeom = { fig: figure(), logstr: '', calcErr: true };
	rGeome.logstr += `simTime: ${t}\n`;
	try {
		const p1 = point(param['l1cx'], param['l1cy']);
		const p2 = point(param['l2cx'], param['l2cy']);
		const p3 = point(param['p3x'], param['p3y']);
		rGeome.fig.addPoint(p1);
		rGeome.fig.addPoint(p2);
		rGeome.fig.addPoint(p3);
		const l1 = line(param['l1cx'], param['l1cy'], degToRad(param['l1ca'] + t));
		const l2 = line(param['l2cx'], param['l2cy'], degToRad(param['l2ca']));
		rGeome.fig.addLine(l1);
		rGeome.fig.addLine(l2);
		rGeome.fig.addPoint(l1.intersection(l2));
		rGeome.fig.addPoint(l1.projectPoint(p3));
		rGeome.logstr += `dist(l1, p3) = ${l1.distanceToPoint(p3)}\n`;
		rGeome.fig.addPoint(l2.projectPoint(p3));
		rGeome.logstr += `dist(l2, p3) = ${l2.distanceToPoint(p3)}\n`;
		const bisector = l1.bisector(l2, p3);
		const pBisec = point(bisector.cx, bisector.cy).translatePolar(bisector.ca, 30);
		rGeome.fig.addPoint(pBisec);
		rGeome.logstr += 'verify_line_2 draw successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg;
		console.log(emsg);
	}
	return rGeome;
}

const pageDef: tPageDef = {
	pTitle: 'Verify line 2',
	pDescription: 'Debugging more line.ts',
	pDef: pDef,
	pGeom: pGeom
};

export { pageDef };
