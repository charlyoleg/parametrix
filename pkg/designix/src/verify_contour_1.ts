// verify_contour_1.ts

import type { tParamDef, tParamVal, tGeom, tPageDef } from 'geometrix';
import { contour, contourCircle, figure, pNumber } from 'geometrix';

const pDef: tParamDef = {
	page: 'verify_contour_1',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('r1', 'mm', 30, 10, 200, 1),
		pNumber('d1', 'mm', 20, 10, 200, 1),
		pNumber('w1', 'mm', 100, 10, 200, 1),
		pNumber('r2', 'mm', 60, 10, 200, 1),
		pNumber('l1', 'mm', 10, 5, 200, 1),
		pNumber('l2', 'mm', 30, 5, 200, 1)
	],
	paramSvg: {
		r1: 'verify_contour_1_r1.svg',
		d1: 'verify_contour_1_r1.svg',
		w1: 'verify_contour_1_r1.svg',
		r2: 'verify_contour_1_r1.svg',
		l1: 'verify_contour_1_l1.svg',
		l2: 'verify_contour_1_l1.svg'
	},
	sim: {
		tMax: 10,
		tStep: 0.5,
		tUpdate: 500 // every 0.5 second
	}
};

function pGeom(t: number, param: tParamVal): tGeom {
	const rGeome: tGeom = { fig: { one: figure() }, logstr: '', calcErr: true };
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
		rGeome.fig.one.addMain(ctr1);
		rGeome.fig.one.addMain(contourCircle(w12, c1, r1));
		rGeome.fig.one.addMain(contourCircle(w12, c2, r1 + t));
		rGeome.fig.one.addMain(contourCircle(w12, c3, r1));
		const ctr2 = contourCircle(w1 + r2, 3 * c1, r2);
		ctr2.check();
		rGeome.fig.one.addSecond(ctr2);
		const ctr3 = contour(200 + l1, 200)
			.addSegStrokeA(200 + l1 + l2, 200)
			.addSegStrokeR(0, l1)
			.addSegStrokeRP(0, l1)
			.addSegStrokeRP(Math.PI / 2, l2)
			.addSegStrokeAP(Math.PI / 4, Math.sqrt(2) * (200 + l1 + l2))
			.addSegStrokeA(200 + l1 + l2, 200 + 2 * l1 + l2)
			.addSegStrokeR(-l2, 0)
			.addSegStrokeR(0, -l1)
			.addSegStrokeR(-l1, 0)
			.addSegStrokeRP(-Math.PI / 2, l2)
			.addSegStrokeR(l1, 0)
			.closeSegStroke();
		ctr3.check();
		rGeome.fig.one.addSecond(ctr3);
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
