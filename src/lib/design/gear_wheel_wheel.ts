// gear_wheel_wheel.ts

import { contour, contourCircle, figure, degToRad, point } from '$lib/geom/figure';
import type { tParamDef, tParamVal, tGeom, tPageDef } from './aaParamGeom';
//import type { Involute } from './involute';
import { involute } from './involute';

const pDef: tParamDef = {
	page: 'gear_wheel_wheel',
	params: [
		{ name: 'module', unit: 'mm', init: 10, min: 0.01, max: 1000, step: 0.01 },
		{ name: 'N1', unit: 'scalar', init: 23, min: 3, max: 1000, step: 1 },
		{ name: 'N2', unit: 'scalar', init: 19, min: 3, max: 1000, step: 1 },
		{ name: 'angleCenterCenter', unit: 'degree', init: 0, min: -180, max: 180, step: 1 },
		{ name: 'addInterAxis', unit: 'mm', init: 0, min: 0, max: 100, step: 0.01 },
		{ name: 'c1x', unit: 'mm', init: 0, min: -200, max: 200, step: 1 },
		{ name: 'c1y', unit: 'mm', init: 0, min: -200, max: 200, step: 1 },
		{ name: 'ah1', unit: 'scalar', init: 1, min: 0.1, max: 2, step: 0.05 },
		{ name: 'dh1', unit: 'scalar', init: 1, min: 0.1, max: 2, step: 0.05 },
		{ name: 'bh1', unit: 'scalar', init: 0.25, min: 0.1, max: 2, step: 0.05 },
		{ name: 'bhr1', unit: 'mm', init: 0.1, min: 0.02, max: 50, step: 0.01 },
		{ name: 'ah2', unit: 'scalar', init: 1, min: 0.1, max: 2, step: 0.05 },
		{ name: 'dh2', unit: 'scalar', init: 1, min: 0.1, max: 2, step: 0.05 },
		{ name: 'bh2', unit: 'scalar', init: 0.25, min: 0.1, max: 2, step: 0.05 },
		{ name: 'bhr2', unit: 'mm', init: 0.1, min: 0.02, max: 50, step: 0.01 },
		{ name: 'at1', unit: '%', init: 50, min: 10, max: 90, step: 0.5 },
		{ name: 'at2', unit: '%', init: 50, min: 10, max: 90, step: 0.5 },
		{ name: 'optimalPressureAngle', unit: 'checkbox', init: 1, min: 0, max: 1, step: 1 },
		{ name: 'brr1', unit: 'mm', init: 50, min: 10, max: 2000, step: 0.01 },
		{ name: 'functioningPressureAngle', unit: 'checkbox', init: 1, min: 0, max: 1, step: 1 },
		{ name: 'brr2', unit: 'mm', init: 50, min: 10, max: 2000, step: 0.01 },
		{ name: 'symetricPressureAngle', unit: 'checkbox', init: 1, min: 0, max: 1, step: 1 },
		{ name: 'blr1', unit: 'mm', init: 50, min: 10, max: 2000, step: 0.01 },
		{ name: 'blr2', unit: 'mm', init: 50, min: 10, max: 2000, step: 0.01 },
		{ name: 'initAngle', unit: 'degree', init: 0, min: -180, max: 180, step: 1 },
		{ name: 'rightLeftCenter', unit: 'dropdown', init: 0, min: 0, max: 2, step: 1 }
	],
	paramSvg: {
		module: 'default_param_blank.svg',
		N1: 'default_param_blank.svg',
		N2: 'default_param_blank.svg',
		angleCenterCenter: 'default_param_blank.svg',
		addInterAxis: 'default_param_blank.svg',
		c1x: 'default_param_blank.svg',
		c1y: 'default_param_blank.svg',
		ah1: 'default_param_blank.svg',
		dh1: 'default_param_blank.svg',
		bh1: 'default_param_blank.svg',
		bhr1: 'default_param_blank.svg',
		ah2: 'default_param_blank.svg',
		dh2: 'default_param_blank.svg',
		bh2: 'default_param_blank.svg',
		bhr2: 'default_param_blank.svg',
		at1: 'default_param_blank.svg',
		at2: 'default_param_blank.svg',
		optimalPressureAngle: 'default_param_blank.svg',
		brr1: 'default_param_blank.svg',
		functioningPressureAngle: 'default_param_blank.svg',
		brr2: 'default_param_blank.svg',
		symetricPressureAngle: 'default_param_blank.svg',
		blr1: 'default_param_blank.svg',
		blr2: 'default_param_blank.svg',
		initAngle: 'default_param_blank.svg',
		rightLeftCenter: 'default_param_blank.svg'
	},
	sim: {
		tMax: 100,
		tStep: 0.5,
		tUpdate: 500 // every 0.5 second
	}
};

class GearProfile {
	mod = 1;
	TN = 23;
	as = 1;
	cx = 0;
	cy = 0;
	brr = 50;
	blr = 50;
	ar = 54;
	pr = 53;
	dr = 52;
	br = 51;
	bhr = 1;
	adt = 0.5;
	initAngle = 0;
	axisAngle = 0;
	involuteR = involute(0, 0, 50, 0, true);
	involuteL = involute(0, 0, 50, 0, false);
	rud = 0;
	rup = 0;
	rua = 0;
	rwd = 0;
	rwp = 0;
	rwa = 0;
	lud = 0;
	lup = 0;
	lua = 0;
	lwd = 0;
	lwp = 0;
	lwa = 0;
	construct() {
		this.mod = 1;
	}
	setModuleToothNumber(iMod: number, iTN: number) {
		this.mod = iMod;
		this.TN = iTN;
		this.pr = (this.mod * this.TN) / 2;
		this.as = (2 * Math.PI) / this.TN;
	}
	setCenterPosition(icx: number, icy: number) {
		this.cx = icx;
		this.cy = icy;
	}
	setCircleRadius(iah: number, idh: number, ibh: number, ibhr: number) {
		this.ar = this.pr + this.mod * iah;
		this.dr = this.pr - this.mod * idh;
		this.br = this.dr - this.mod * ibh;
		this.bhr = ibhr;
	}
	setBaseCircles(baseRight: number, baseLeft: number) {
		this.brr = baseRight;
		this.blr = baseLeft;
	}
	setToothThickness(iat: number) {
		this.adt = iat / 100;
	}
	setAngles(initAng: number, axisAng: number) {
		this.initAngle = initAng;
		this.axisAngle = axisAng;
	}
	getInvoluteAngles() {
		this.involuteR = involute(this.cx, this.cy, this.brr, 0, true);
		if (this.dr > this.brr) {
			this.rud = this.involuteR.uFromL(this.dr);
		} else {
			this.rud = 0;
		}
		this.rup = this.involuteR.uFromL(this.pr);
		this.rua = this.involuteR.uFromL(this.ar);
		this.rwd = this.involuteR.wFromU(this.rud);
		this.rwp = this.involuteR.wFromU(this.rup);
		this.rwa = this.involuteR.wFromU(this.rua);
		this.involuteL = involute(this.cx, this.cy, this.blr, 0, false);
		if (this.dr > this.blr) {
			this.lud = this.involuteL.uFromL(this.dr);
		} else {
			this.rud = 0;
		}
		this.lup = this.involuteL.uFromL(this.pr);
		this.lua = this.involuteL.uFromL(this.ar);
		this.lwd = this.involuteL.wFromU(this.lud);
		this.lwp = this.involuteL.wFromU(this.lup);
		this.lwa = this.involuteL.wFromU(this.lua);
	}
	getProfile() {
		this.getInvoluteAngles();
		const aDiffRd = this.rwd - this.rwp;
		const aDiffRa = this.rwa - this.rwp;
		const aDiffLd = this.lwd - this.lwp;
		const aDiffLa = this.lwa - this.lwp;
		const erdr = this.dr > this.brr ? this.dr : this.brr;
		const eldr = this.dr > this.blr ? this.dr : this.blr;
		const center = point(this.cx, this.cy);
		// this first point is equal to the first stroke of the loop.
		// Contour will remove it because last and new points are identical
		const first = center.translatePolar(this.initAngle + aDiffRd, this.br);
		const rProfile = contour(first.cx, first.cy);
		for (let i = 0; i < this.TN; i++) {
			const refA = this.initAngle + i * this.as;
			const ptrb = center.translatePolar(refA + aDiffRd, this.br);
			rProfile.addSegStrokeA(ptrb.cx, ptrb.cy);
			const ptrd = center.translatePolar(refA + aDiffRd, erdr);
			rProfile.addSegStrokeA(ptrd.cx, ptrd.cy);
			const ptrp = center.translatePolar(refA, this.pr);
			rProfile.addSegStrokeA(ptrp.cx, ptrp.cy);
			const ptra = center.translatePolar(refA + aDiffRa, this.ar);
			rProfile.addSegStrokeA(ptra.cx, ptra.cy);
			const refAl = refA + this.as * this.adt;
			const ptla = center.translatePolar(refAl + aDiffLa, this.ar);
			rProfile.addSegStrokeA(ptla.cx, ptla.cy);
			const ptlp = center.translatePolar(refAl, this.pr);
			rProfile.addSegStrokeA(ptlp.cx, ptlp.cy);
			const ptld = center.translatePolar(refAl + aDiffLd, eldr);
			rProfile.addSegStrokeA(ptld.cx, ptld.cy);
			const ptlb = center.translatePolar(refAl + aDiffLd, this.br);
			rProfile.addSegStrokeA(ptlb.cx, ptlb.cy);
		}
		rProfile.closeSegStroke();
		return rProfile;
	}
}

function pGeom(t: number, param: tParamVal): tGeom {
	const rGeome: tGeom = { fig: figure(), logstr: '', calcErr: true };
	rGeome.logstr += `simTime: ${t}\n`;
	try {
		// re-arrange parameters
		const gp1 = new GearProfile();
		const gp2 = new GearProfile();
		gp1.setModuleToothNumber(param['module'], param['N1']);
		gp2.setModuleToothNumber(param['module'], param['N2']);
		const angleCenterCenter = degToRad(param['angleCenterCenter']);
		const interAxis = gp1.pr + gp2.pr + param['addInterAxis'];
		const c2x = param['c1x'] + interAxis * Math.cos(angleCenterCenter);
		const c2y = param['c1y'] + interAxis * Math.sin(angleCenterCenter);
		gp1.setCenterPosition(param['c1x'], param['c1y']);
		gp2.setCenterPosition(c2x, c2y);
		gp1.setCircleRadius(param['ah1'], param['dh1'], param['bh1'], param['bhr1']);
		gp2.setCircleRadius(param['ah2'], param['dh2'], param['bh2'], param['bhr2']);
		// base circles
		const functioningPressureAngle = param['functioningPressureAngle'];
		const symetricPressureAngle = param['symetricPressureAngle'];
		let brr1 = param['brr1'];
		let brr2 = param['brr2'];
		let blr1 = param['blr1'];
		let blr2 = param['blr2'];
		if (param['optimalPressureAngle'] === 1) {
			if (gp2.TN > gp1.TN) {
				brr1 = gp1.dr;
				brr2 = (brr1 * gp2.TN) / gp1.TN;
			} else {
				brr2 = gp2.dr;
				brr1 = (brr2 * gp1.TN) / gp2.TN;
			}
			blr1 = brr1;
			blr2 = brr2;
		}
		gp1.setBaseCircles(brr1, blr1);
		gp2.setBaseCircles(brr2, blr2);
		gp1.setToothThickness(param['at1']);
		gp2.setToothThickness(param['at2']);
		gp1.setAngles(degToRad(param['initAngle']), angleCenterCenter);
		const rightLeftCenter = param['rightLeftCenter'];
		gp2.setAngles(0, angleCenterCenter + Math.PI);
		// construction lines and circles
		rGeome.fig.addDynamics(contourCircle(gp1.cx, gp1.cy, gp1.ar));
		rGeome.fig.addDynamics(contourCircle(gp1.cx, gp1.cy, gp1.pr));
		rGeome.fig.addDynamics(contourCircle(gp1.cx, gp1.cy, gp1.dr));
		rGeome.fig.addDynamics(contourCircle(gp1.cx, gp1.cy, gp1.br));
		rGeome.fig.addDynamics(contourCircle(gp1.cx, gp1.cy, gp1.brr));
		rGeome.fig.addDynamics(contourCircle(gp1.cx, gp1.cy, gp1.blr));
		rGeome.fig.addDynamics(contourCircle(gp2.cx, gp2.cy, gp2.ar));
		rGeome.fig.addDynamics(contourCircle(gp2.cx, gp2.cy, gp2.pr));
		rGeome.fig.addDynamics(contourCircle(gp2.cx, gp2.cy, gp2.dr));
		rGeome.fig.addDynamics(contourCircle(gp2.cx, gp2.cy, gp2.br));
		rGeome.fig.addDynamics(contourCircle(gp2.cx, gp2.cy, gp2.brr));
		rGeome.fig.addDynamics(contourCircle(gp2.cx, gp2.cy, gp2.blr));
		// gearwheel-1
		const gp1p = gp1.getProfile();
		rGeome.logstr += gp1p.check();
		rGeome.fig.addMain(gp1p);
		const gp2p = gp2.getProfile();
		rGeome.logstr += gp2p.check();
		rGeome.fig.addSecond(gp2p);
		rGeome.logstr += 'gear_wheel_wheel draw successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg;
		console.log(emsg);
	}
	return rGeome;
}

const pageDef: tPageDef = {
	pTitle: 'Gearwheel-gearwheel',
	pDescription: 'Gear-system with two wheels',
	pDef: pDef,
	pGeom: pGeom
};

export { pageDef };
