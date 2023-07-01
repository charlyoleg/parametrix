// verify_line.ts

import type { tParamDef, tParamVal, tGeom, tPageDef } from 'geometrix';
import { point, line, linePP, figure, pNumber } from 'geometrix';

const pDef: tParamDef = {
	page: 'verify_line',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('p1x', 'mm', 30, -200, 200, 1),
		pNumber('p1y', 'mm', 50, -200, 200, 1),
		pNumber('p2x', 'mm', 40, -200, 200, 1),
		pNumber('p2y', 'mm', -20, -200, 200, 1),
		pNumber('p3x', 'mm', -30, -200, 200, 1),
		pNumber('p3y', 'mm', 30, -200, 200, 1)
	],
	paramSvg: {
		p1x: 'verify_line_p1x.svg',
		p1y: 'verify_line_p1x.svg',
		p2x: 'verify_line_p1x.svg',
		p2y: 'verify_line_p1x.svg',
		p3x: 'verify_line_p1x.svg',
		p3y: 'verify_line_p1x.svg'
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
		const p3 = point(param['p3x'], param['p3y']);
		rGeome.fig.one.addPoint(p1);
		rGeome.fig.one.addPoint(p2);
		rGeome.fig.one.addPoint(p3);
		const l1 = line(0, 0, 0).setFromPoints(p1, p2);
		rGeome.fig.one.addLine(l1);
		//rGeome.fig.one.addLine(l2);
		rGeome.fig.one.addPoint(point(l1.getAxisXIntersection(), 0));
		rGeome.fig.one.addPoint(point(0, l1.getAxisYIntersection()));
		const p4 = l1.projectOrig();
		rGeome.fig.one.addPoint(p4);
		const p0 = point(0, 0);
		if (!p0.isEqual(p4)) {
			const l2 = linePP(p0, p4);
			rGeome.fig.one.addLine(l2);
		}
		rGeome.fig.one.addLine(l1.lineOrthogonal(p3));
		rGeome.fig.one.addLine(l1.lineParallel(p3));
		rGeome.fig.one.addPoint(l1.projectPoint(p3));
		rGeome.logstr += `dist(l1, p3) = ${l1.distanceToPoint(p3)}\n`;
		rGeome.logstr += 'verify_line draw successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg;
		console.log(emsg);
	}
	return rGeome;
}

const pageDef: tPageDef = {
	pTitle: 'Verify line',
	pDescription: 'Debugging line.ts',
	pDef: pDef,
	pGeom: pGeom
};

export { pageDef };
