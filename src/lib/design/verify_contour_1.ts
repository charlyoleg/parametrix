// verify_contour_1.ts

import { contour, contourCircle, figure } from '$lib/geom/figure';
import type { tParamDef, tParamVal, tGeom, tPageDef } from './aaParamGeom';

const pDef: tParamDef = {
	page: 'verify_contour_1',
	params: [
		{ name: 'r1', unit: 'mm', init: 30, min: 10, max: 200, step: 1 },
		{ name: 'd1', unit: 'mm', init: 20, min: 10, max: 200, step: 1 },
		{ name: 'w1', unit: 'mm', init: 100, min: 10, max: 200, step: 1 },
		{ name: 'r2', unit: 'mm', init: 60, min: 10, max: 200, step: 1 },
		{ name: 'l1', unit: 'mm', init: 10, min: 5, max: 200, step: 1 },
		{ name: 'l2', unit: 'mm', init: 30, min: 5, max: 200, step: 1 }
	],
	paramSvg: {
		r1: 'verify_contour_1_r1.svg',
		d1: 'verify_contour_1_r1.svg',
		w1: 'verify_contour_1_r1.svg',
		r2: 'verify_contour_1_r1.svg',
		l1: 'verify_contour_1_l1.svg',
		l2: 'verify_contour_1_l2.svg'
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
		const d1 = param['d1'];
		const w1 = param['w1'];
		const r2 = param['r2'];
		const l1 = param['l1'];
		const l2 = param['l2'];
		const h1 = 6 * r1 + 4 * d1;
		const w12 = w1 / 2;
		const c1 = d1 + r1;
		const c12 = 2 * r1 + d1;
		const c2 = c1 + c12;
		const c3 = c1 + 2 * c12;
		const ctr1 = contour(0, 0);
		ctr1.addSegStrokeA(w1, 0);
		ctr1.addSegStrokeA(w1, h1);
		ctr1.addSegStrokeA(0, h1);
		ctr1.closeSegStroke();
		ctr1.check();
		rGeome.fig.addMain(ctr1);
		rGeome.fig.addMain(contourCircle(w12, c1, r1));
		rGeome.fig.addMain(contourCircle(w12, c2, r1 + t));
		rGeome.fig.addMain(contourCircle(w12, c3, r1));
		const ctr2 = contourCircle(w1 + r2, 3 * c1, r2);
		ctr2.check();
		rGeome.fig.addSecond(ctr2);
		const ctr3 = contour(100 + l1, 100)
			.addSegStrokeA(100 + l1 + l2, 100)
			.addSegStrokeR(0, l1)
			.addSegStrokeRP(0, l1)
			.addSegStrokeRP(Math.PI / 2, l2)
			.addSegStrokeAP(Math.PI / 4, 100 + Math.sqrt(2) * (2 * l1 + l2))
			.addSegStrokeA(100 + l1 + l2, 100 + 2 * l1 + l2)
			.addSegStrokeR(-l2, 0)
			.addSegStrokeR(0, -l1)
			.addSegStrokeR(-l1, 0)
			.addSegStrokeRP(-Math.PI / 2, l2)
			.addSegStrokeR(l1, 0)
			.closeSegStroke();
		ctr3.check();
		rGeome.fig.addSecond(ctr3);
		rGeome.logstr += 'verify_contour_1 draw successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg;
		console.log(emsg);
	}
	return rGeome;
}

const pageDef: tPageDef = {
	pTitle: 'Verify contour 1',
	pDescription: 'Debugging contour.ts',
	pDef: pDef,
	pGeom: pGeom
};

export { pageDef };
