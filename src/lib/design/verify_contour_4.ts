// verify_contour_4.ts

import { point, contour, figure } from '$lib/geom/figure';
import type { tParamDef, tParamVal, tGeom, tPageDef } from './aaParamGeom';

const pDef: tParamDef = {
	page: 'verify_contour_4',
	params: [
		{ name: 'n1', unit: 'scalar', init: 12, min: 1, max: 50, step: 1 },
		{ name: 'n2', unit: 'scalar', init: 6, min: 3, max: 50, step: 1 },
		{ name: 'r1', unit: 'mm', init: 10, min: 0, max: 20, step: 1 }
	],
	paramSvg: {
		n1: 'verify_contour_1_r1.svg',
		n2: 'verify_contour_1_r1.svg',
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
		const n1 = param['n1'];
		const n2 = param['n2'];
		const r1 = param['r1'];
		const l1 = 50;
		const as = (2 * Math.PI) / (n2 * 3);
		const ctr1 = contour(l1, 0);
		const ctr1b = contour(l1, 0)
			.addSegStrokeAP(as, 1.5 * l1)
			//.addCornerRounded(r1)
			.addPointAP(2 * as, l1)
			.addSegStroke()
			//.addSegArc(0.45 * l1, false, true)
			//.addCornerWidened(r1)
			.addSegStrokeAP(3 * as, 1.1 * l1);
		for (let i = 1; i < n1; i++) {
			const p0 = point(0, 0);
			const ctr1c = ctr1b.rotate(p0, 3 * as).scale(p0, 1.1);
			ctr1.addPartial(ctr1c);
		}
		//ctr1.closeSegStroke();
		//rGeome.logstr += ctr1.check();
		rGeome.fig.addMain(ctr1);
		rGeome.logstr += 'verify_contour_4 draw successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg;
		console.log(emsg);
	}
	return rGeome;
}

const pageDef: tPageDef = {
	pTitle: 'Verify contour 4',
	pDescription: 'Debugging contour.ts for addPartial',
	pDef: pDef,
	pGeom: pGeom
};

export { pageDef };
