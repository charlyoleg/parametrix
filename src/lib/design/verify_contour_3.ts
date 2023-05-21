// verify_contour_3.ts

import { degToRad, contour, figure } from '$lib/geom/figure';
import type { tParamDef, tParamVal, tGeom, tPageDef } from './aaParamGeom';

const pDef: tParamDef = {
	page: 'verify_contour_3',
	params: [
		{ name: 'r1', unit: 'mm', init: 10, min: 0, max: 200, step: 1 },
		{ name: 'r2', unit: 'mm', init: 10, min: 0, max: 200, step: 1 },
		{ name: 'r3', unit: 'mm', init: 9, min: 0, max: 200, step: 1 },
		{ name: 'r4', unit: 'mm', init: 10, min: 0, max: 200, step: 1 }
	],
	paramSvg: {
		r1: 'verify_contour_1_r1.svg',
		r2: 'verify_contour_1_r1.svg',
		r3: 'verify_contour_1_r1.svg',
		r4: 'verify_contour_1_r1.svg'
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
		const r2 = param['r2'] + t;
		const r3 = param['r3'] + t;
		const r4 = param['r4'] + t;
		const ctr1 = contour(100, 0)
			.addSegStrokeR(30, 200)
			.addCornerRounded(r1)
			.addSegStrokeR(200, 30)
			.addCornerRounded(r1)
			.addSegStrokeR(-200, 30)
			.addCornerRounded(r1)
			.addSegStrokeR(-30, 200)
			.addCornerRounded(r1)
			.addSegStrokeR(-30, -200)
			.addCornerRounded(r1)
			.addSegStrokeR(-200, -30)
			.addCornerRounded(r1)
			.addSegStrokeR(200, -30)
			.addCornerRounded(r1)
			.closeSegStroke()
			.addCornerRounded(r1);
		ctr1.check();
		rGeome.fig.addMain(ctr1);
		const l2 = 100;
		const ctr2 = contour(300, 0);
		for (let i = 0; i < 4; i++) {
			const angle = 90 * (1 - i); // turning CW
			ctr2.addSegStrokeRP(degToRad(angle), l2)
				.addCornerRounded(r2)
				.addSegStrokeRP(degToRad(angle - 45), l2)
				.addCornerRounded(r2)
				.addSegStrokeRP(degToRad(angle + 45), l2)
				.addCornerRounded(r2)
				.addSegStrokeRP(degToRad(angle), l2)
				.addCornerRounded(r2);
		}
		ctr2.check();
		rGeome.fig.addMain(ctr2);
		const l3 = 100;
		const ra3 = 70;
		const ctr3 = contour(0, 600).addSegStrokeR(l3, l3);
		for (let i = 0; i < 3; i++) {
			//const large = (i & 0x1) === 0 ? false : true;
			const large = false;
			//const ccw = i < 2 ? false : true;
			const ccw = true;
			//rGeome.logstr += `large ${large} ccw ${ccw}\n`;
			ctr3.addSegStrokeR(l3, 0)
				.addCornerRounded(r3)
				.addSegStrokeR(0, l3)
				.addCornerRounded(r3)
				.addPointR(l3, 0)
				.addSegArc(ra3, large, ccw)
				.addCornerRounded(r3)
				.addSegStrokeR(0, -l3)
				.addCornerRounded(r3);
		}
		ctr3.addSegStrokeR(l3, 0).addSegStrokeR(l3, -l3).closeSegStroke();
		ctr3.check();
		rGeome.fig.addMain(ctr3);
		const l4 = 200;
		const ra4 = 180;
		const ctr4 = contour(0, 1000)
			.addPointR(l4, 0)
			.addSegArc(ra4, false, true)
			.addCornerRounded(r4)
			.addPointR(0, l4)
			.addSegArc(ra4, false, true)
			.addPointR(-l4, -l4)
			.addSegArc(1.4 * ra4, false, true);
		ctr4.check();
		rGeome.fig.addMain(ctr4);
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
