// verify_contour_2.ts

import { contour, figure } from '$lib/geom/figure';
import type { tParamDef, tParamVal, tGeom, tPageDef } from './aaParamGeom';

const pDef: tParamDef = {
	page: 'verify_contour_2',
	params: [{ name: 'r1', unit: 'mm', init: 30, min: 10, max: 200, step: 1 }],
	paramSvg: {
		r1: 'verify_contour_1_r1.svg'
	},
	sim: {
		tMax: 10,
		tStep: 0.5,
		tUpdate: 500 // every 0.5 second
	}
};

function pGeom(t: number, param: tParamVal): tGeom {
	const rGeome: tGeom = { fig: figure(), logstr: '', calcErr: true };
	rGeome.logstr += `simTime: ${t}\n`;
	try {
		const r1 = param['r1'];
		const ctr1 = contour(20, 20);
		ctr1.addSegStroke(40, 20);
		ctr1.addSegArc(60, 20, r1, true, true);
		ctr1.addSegArc(80, 20, r1, true, false);
		ctr1.addSegArc(100, 20, r1, false, true);
		ctr1.addSegArc(120, 20, r1, false, false);
		ctr1.addSegStroke(140, 20);
		ctr1.addSegStroke(140, 40);
		ctr1.addSegArc(140, 60, r1, true, true);
		ctr1.addSegArc(140, 80, r1, true, false);
		ctr1.addSegArc(140, 100, r1, false, true);
		ctr1.addSegArc(140, 120, r1, false, false);
		ctr1.addSegStroke(140, 140);
		ctr1.addSegStroke(120, 140);
		ctr1.addSegArc(100, 140, r1, true, true);
		ctr1.addSegArc(80, 140, r1, true, false);
		ctr1.addSegArc(60, 140, r1, false, true);
		ctr1.addSegArc(40, 140, r1, false, false);
		ctr1.addSegStroke(20, 140);
		ctr1.addSegStroke(20, 120);
		ctr1.addSegArc(20, 100, r1, true, true);
		ctr1.addSegArc(20, 80, r1, true, false);
		ctr1.addSegArc(20, 60, r1, false, true);
		ctr1.addSegArc(20, 40, r1, false, false);
		ctr1.closeSegStroke();
		rGeome.fig.addMain(ctr1);
		const ctr2 = contour(20, -20);
		ctr2.addSegStroke(40, -40);
		ctr1.addSegArc(60, -60, r1, true, true);
		ctr1.addSegArc(80, -80, r1, true, false);
		ctr1.addSegArc(100, -100, r1, false, true);
		ctr1.addSegArc(120, -120, r1, false, false);
		ctr1.addSegStroke(140, -140);
		rGeome.fig.addMain(ctr2);
		rGeome.logstr += 'verify_contour_2 draw successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg;
		console.log(emsg);
	}
	return rGeome;
}

const pageDef: tPageDef = {
	pTitle: 'Verify contour 2',
	pDescription: 'Debugging more contour.ts',
	pDef: pDef,
	pGeom: pGeom
};

export { pageDef };
