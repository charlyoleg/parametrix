// verify_contour_2.ts

import { degToRad, contour, figure } from '$lib/geom/figure';
import type { tParamDef, tParamVal, tGeom, tPageDef } from './aaParamGeom';

const pDef: tParamDef = {
	page: 'verify_contour_2',
	params: [
		{ name: 'r1', unit: 'mm', init: 20, min: 5, max: 200, step: 1 },
		{ name: 'a1', unit: 'deg', init: 30, min: -200, max: 200, step: 1 },
		{ name: 'at1', unit: 'deg', init: 30, min: -200, max: 200, step: 1 },
		{ name: 'at2', unit: 'deg', init: 130, min: -200, max: 200, step: 1 }
	],
	paramSvg: {
		r1: 'verify_contour_1_r1.svg',
		a1: 'verify_contour_1_r1.svg',
		at1: 'verify_contour_1_r1.svg',
		at2: 'verify_contour_1_r1.svg'
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
		const ata = param['a1'] + t;
		const at1 = param['at1'] + t;
		const at2 = param['at2'] + t;
		const ctr1 = contour(20, 20);
		ctr1.addSegStrokeA(40, 20);
		ctr1.addPointA(60, 20).addSegArc(r1, true, true);
		ctr1.addPointA(80, 20).addSegArc(r1, true, false);
		ctr1.addPointA(100, 20).addSegArc(r1, false, true);
		ctr1.addPointA(120, 20).addSegArc(r1, false, false);
		ctr1.addSegStrokeA(140, 20);
		ctr1.addSegStrokeA(140, 40);
		ctr1.addPointA(140, 60).addSegArc(r1, true, true);
		ctr1.addPointA(140, 80).addSegArc(r1, true, false);
		ctr1.addPointA(140, 100).addSegArc(r1, false, true);
		ctr1.addPointA(140, 120).addSegArc(r1, false, false);
		ctr1.addSegStrokeA(140, 140);
		ctr1.addSegStrokeA(120, 140);
		ctr1.addPointA(100, 140).addSegArc(r1, true, true);
		ctr1.addPointA(80, 140).addSegArc(r1, true, false);
		ctr1.addPointA(60, 140).addSegArc(r1, false, true);
		ctr1.addPointA(40, 140).addSegArc(r1, false, false);
		ctr1.addSegStrokeA(20, 140);
		ctr1.addSegStrokeA(20, 120);
		ctr1.addPointA(20, 100).addSegArc(r1, true, true);
		ctr1.addPointA(20, 80).addSegArc(r1, true, false);
		ctr1.addPointA(20, 60).addSegArc(r1, false, true);
		ctr1.addPointA(20, 40).addSegArc(r1, false, false);
		ctr1.closeSegStroke();
		ctr1.check(); // throw an exception if any error
		rGeome.fig.addMain(ctr1);
		const ctr2 = contour(20, -20);
		ctr2.addSegStrokeA(40, -40);
		ctr2.addPointA(60, -60).addSegArc(r1, true, true);
		ctr2.addPointA(80, -80).addSegArc(r1, true, false);
		ctr2.addPointA(100, -100).addSegArc(r1, false, true);
		ctr2.addPointA(120, -120).addSegArc(r1, false, false);
		ctr2.addSegStrokeA(140, -140);
		ctr2.addSegStrokeR(20, 20)
			.addPointR(20, 20)
			.addSegArc(r1, false, false)
			.addPointRP(Math.PI / 4, 28)
			.addSegArc(r1, false, true)
			.addPointRP(Math.PI / 4, 28)
			.addSegArc(r1, true, true)
			.addPointRP(Math.PI / 4, 28)
			.addSegArc(r1, true, false)
			.addSegStrokeRP(Math.PI / 4, 20)
			.addSegStrokeRP(-Math.PI / 4, 20)
			.addPointR(10, -9)
			.addPointR(20, -20)
			.addSegArc2()
			.addPointR(20, -9)
			.addPointR(20, -20)
			.addSegArc2()
			.addPointR(9, -6)
			.addPointR(20, -20)
			.addSegArc2()
			.addPointR(9, -14)
			.addPointR(20, -20)
			.addSegArc2()
			.addPointR(9, 0)
			.addPointR(20, -20)
			.addSegArc2()
			.addSegStrokeR(20, -20)
			.addSegStrokeR(20, 20)
			.addPointR(9, 20)
			.addPointR(20, 20)
			.addSegArc2()
			.addPointR(20, 10)
			.addPointR(20, 20)
			.addSegArc2()
			.addPointR(9, 6)
			.addPointR(20, 20)
			.addSegArc2()
			.addPointR(9, 14)
			.addPointR(20, 20)
			.addSegArc2()
			.addPointR(9, 0)
			.addPointR(20, 20)
			.addSegArc2()
			.addSegStrokeR(20, 20)
			.addSegStrokeR(0, 20)
			.addPointR(15, 8)
			.addPointR(0, 20)
			.addSegArc2()
			.addPointR(-15, 8)
			.addPointR(0, 20)
			.addSegArc2()
			.addPointR(5, 8)
			.addPointR(0, 20)
			.addSegArc2()
			.addPointR(-5, 8)
			.addPointR(0, 20)
			.addSegArc2()
			.addSegStrokeR(0, 20)
			.addSegStrokeR(20, 0)
			.addPointR(8, 15)
			.addPointR(20, 0)
			.addSegArc2()
			.addPointR(8, -15)
			.addPointR(20, 0)
			.addSegArc2()
			.addPointR(8, 5)
			.addPointR(20, 0)
			.addSegArc2()
			.addPointR(8, -5)
			.addPointR(20, 0)
			.addSegArc2()
			.addSegStrokeR(20, 0)
			.addSegStrokeR(0, -20)
			.addPointR(15, -8)
			.addPointR(0, -20)
			.addSegArc2()
			.addPointR(-15, -8)
			.addPointR(0, -20)
			.addSegArc2()
			.addPointR(5, -8)
			.addPointR(0, -20)
			.addSegArc2()
			.addPointR(-5, -8)
			.addPointR(0, -20)
			.addSegArc2()
			.addSegStrokeR(0, -20)
			.addSegStrokeR(-20, 0)
			.addPointR(-8, 15)
			.addPointR(-20, 0)
			.addSegArc2()
			.addPointR(-8, -15)
			.addPointR(-20, 0)
			.addSegArc2()
			.addPointR(-8, 5)
			.addPointR(-20, 0)
			.addSegArc2()
			.addPointR(-8, -5)
			.addPointR(-20, 0)
			.addSegArc2()
			.addSegStrokeR(-20, 0);
		ctr2.check(); // throw an exception if any error
		rGeome.fig.addMain(ctr2);
		const ctr3 = contour(200, 200)
			.addSegStrokeR(20, 0)
			.addPointR(20, 0)
			.addSegArc3(degToRad(ata), true)
			.addSegStrokeR(20, 0)
			.addPointR(20, 0)
			.addSegArc3(degToRad(ata), false)
			.addSegStrokeR(20, 0)
			.addSegStrokeR(0, 20)
			.addPointR(0, 20)
			.addSegArc3(degToRad(ata), true)
			.addSegStrokeR(0, 20)
			.addPointR(0, 20)
			.addSegArc3(degToRad(ata), false)
			.addSegStrokeR(0, 20)
			.addSegStrokeR(-20, 0)
			.addPointR(-20, 0)
			.addSegArc3(degToRad(ata), true)
			.addSegStrokeR(-20, 0)
			.addPointR(-20, 0)
			.addSegArc3(degToRad(ata), false)
			.addSegStrokeR(-20, 0)
			.addSegStrokeR(0, -20)
			.addPointR(0, -20)
			.addSegArc3(degToRad(ata), true)
			.addSegStrokeR(0, -20)
			.addPointR(0, -20)
			.addSegArc3(degToRad(ata), false)
			.addSegStrokeR(0, -20);
		ctr3.check(); // throw an exception if any error
		rGeome.fig.addMain(ctr3);
		const ctr4 = contour(600, 200)
			.addSegStrokeR(20, 20)
			.addPointR(20, 20)
			.addSegArc3(degToRad(ata), true)
			.addSegStrokeR(20, 20)
			.addPointR(20, 20)
			.addSegArc3(degToRad(ata), false)
			.addSegStrokeR(20, 20)
			.addSegStrokeR(-20, 20)
			.addPointR(-20, 20)
			.addSegArc3(degToRad(ata), true)
			.addSegStrokeR(-20, 20)
			.addPointR(-20, 20)
			.addSegArc3(degToRad(ata), false)
			.addSegStrokeR(-20, 20)
			.addSegStrokeR(-20, -20)
			.addPointR(-20, -20)
			.addSegArc3(degToRad(ata), true)
			.addSegStrokeR(-20, -20)
			.addPointR(-20, -20)
			.addSegArc3(degToRad(ata), false)
			.addSegStrokeR(-20, -20)
			.addSegStrokeR(20, -20)
			.addPointR(20, -20)
			.addSegArc3(degToRad(ata), true)
			.addSegStrokeR(20, -20)
			.addPointR(20, -20)
			.addSegArc3(degToRad(ata), false)
			.addSegStrokeR(20, -20);
		ctr4.check(); // throw an exception if any error
		rGeome.fig.addMain(ctr4);
		const ctr5 = contour(100, 500)
			.addSegStrokeR(20, 0)
			.addPointR(20, 0)
			.addSeg2Arcs(degToRad(at1), degToRad(at2))
			.addSegStrokeR(20, 0);
		ctr5.check(); // throw an exception if any error
		rGeome.fig.addMain(ctr5);
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
