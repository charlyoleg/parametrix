// verify_contour_3.ts

import { contour, figure } from '$lib/geom/figure';
import type { tParamDef, tParamVal, tGeom, tPageDef } from './aaParamGeom';

const pDef: tParamDef = {
	page: 'verify_contour_3',
	params: [{ name: 'r1', unit: 'mm', init: 10, min: 1, max: 200, step: 1 }],
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
		const r1 = param['r1'] + t;
		const ctr1 = contour(100, 0)
			.addSegStrokeR(20, 100)
			.addCornerRounded(r1)
			.addSegStrokeR(100, 20)
			.addCornerRounded(r1)
			.addSegStrokeR(-100, 20)
			.addCornerRounded(r1)
			.addSegStrokeR(-20, 100)
			.addCornerRounded(r1)
			.addSegStrokeR(-20, -100)
			.addCornerRounded(r1)
			.addSegStrokeR(-100, -20)
			.addCornerRounded(r1)
			.addSegStrokeR(100, -20)
			.addCornerRounded(r1)
			.closeSegStroke()
			.addCornerRounded(r1);
		ctr1.check();
		rGeome.fig.addMain(ctr1);
		rGeome.logstr += 'verify_contour_3 draw successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg;
		console.log(emsg);
	}
	return rGeome;
}

const pageDef: tPageDef = {
	pTitle: 'Verify contour 3',
	pDescription: 'Debugging contour.ts for rounded corners and widened corners',
	pDef: pDef,
	pGeom: pGeom
};

export { pageDef };
